Component({
  properties: { isPersonal: Boolean },
  data: {
    region: '', reason: '', contactPhone: '', companyName: '', legalPhone: '', personName: ''
  },
  methods: {
    openRegion() {
      this.triggerEvent('openregion');
    },
    openReason() {
      wx.showActionSheet({
        itemList: ['新刻印章','变更重刻','损坏重刻','遗失补刻','增刻印章'],
        success: r => {
          const list = ['新刻印章','变更重刻','损坏重刻','遗失补刻','增刻印章'];
          this.setData({ reason: list[r.tapIndex] });
          this.triggerEvent('formchange', this.getData());
        }
      });
    },
    setRegion(region) {
      this.setData({ region });
      this.triggerEvent('formchange', this.getData());
    },
    onContact(e) { 
      this.setData({ contactPhone: e.detail.value }); 
      this.triggerEvent('formchange', this.getData()); 
      if (e.detail.value) wx.vibrateShort();
    },
    onCompany(e) { this.setData({ companyName: e.detail.value }); this.triggerEvent('formchange', this.getData()); },
    onLegal(e) { 
      this.setData({ legalPhone: e.detail.value }); 
      this.triggerEvent('formchange', this.getData()); 
      if (e.detail.value) wx.vibrateShort();
    },
    onName(e) { this.setData({ personName: e.detail.value }); this.triggerEvent('formchange', this.getData()); },
    getData() {
      const b = { region: this.data.region, reason: this.data.reason, contactPhone: this.data.contactPhone };
      return this.data.isPersonal ? { ...b, personName: this.data.personName } : { ...b, companyName: this.data.companyName, legalPhone: this.data.legalPhone };
    },
    validate() {
      const d = this.data;
      if (!d.region) return wx.showToast({ title: '请选择执照地区', icon: 'none' }), false;
      if (!d.reason) return wx.showToast({ title: '请选择刻章原因', icon: 'none' }), false;
      if (!/^1[3-9]\d{9}$/.test(d.contactPhone)) return wx.showToast({ title: '请输入正确联系号码', icon: 'none' }), false;
      if (d.isPersonal) {
        if (!d.personName.trim()) return wx.showToast({ title: '请输入姓名', icon: 'none' }), false;
      } else {
        if (!d.companyName.trim()) return wx.showToast({ title: '请输入公司名称', icon: 'none' }), false;
        if (!/^1[3-9]\d{9}$/.test(d.legalPhone)) return wx.showToast({ title: '请输入正确法人电话', icon: 'none' }), false;
      }
      return true;
    }
  }
});
