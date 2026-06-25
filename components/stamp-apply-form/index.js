// components/stamp-apply-form/index.js
Component({
  properties: {
    isPersonal: { type: Boolean, value: false }
  },
  data: {
    region: '',
    regionCity: '',
    regionDistrict: '',
    reason: '',
    contactPhone: '',
    companyName: '',
    legalPhone: '',
    personName: '',
    chengduDistricts: [
      '锦江区','青羊区','金牛区','武侯区','成华区',
      '龙泉驿区','青白江区','新都区','温江区','双流区',
      '郫都区','新津区','简阳市','都江堰市','彭州市',
      '邛崃市','崇州市','金堂县','大邑县','蒲江县',
      '高新区','天府新区','东部新区'
    ]
  },
  methods: {
    onRegionChange(e) {
      const idx = e.detail.value;
      const district = this.data.chengduDistricts[idx];
      this.setData({ region: district, regionCity: '成都市', regionDistrict: district });
      this.triggerEvent('formchange', this.getData());
    },

    onChooseReason() {
      const that = this;
      wx.showActionSheet({
        itemList: ['新刻印章','变更重刻','损坏重刻','遗失补刻','增刻印章'],
        success(res) {
          const reasons = ['新刻印章','变更重刻','损坏重刻','遗失补刻','增刻印章'];
          that.setData({ reason: reasons[res.tapIndex] });
          that.triggerEvent('formchange', that.getData());
        }
      });
    },

    onInputContact(e) {
      this.setData({ contactPhone: e.detail.value });
      this.triggerEvent('formchange', this.getData());
    },

    onInputCompany(e) {
      this.setData({ companyName: e.detail.value });
      this.triggerEvent('formchange', this.getData());
    },

    onInputLegal(e) {
      this.setData({ legalPhone: e.detail.value });
      this.triggerEvent('formchange', this.getData());
    },

    onInputPersonName(e) {
      this.setData({ personName: e.detail.value });
      this.triggerEvent('formchange', this.getData());
    },

    getData() {
      const base = {
        region: this.data.region,
        regionCity: this.data.regionCity,
        regionDistrict: this.data.regionDistrict,
        reason: this.data.reason,
        contactPhone: this.data.contactPhone
      };
      if (this.data.isPersonal) {
        return { ...base, personName: this.data.personName };
      }
      return { ...base, companyName: this.data.companyName, legalPhone: this.data.legalPhone };
    },

    validate() {
      const d = this.data;
      if (!d.region) { wx.showToast({ title: '请选择执照地区', icon: 'none' }); return false; }
      if (!d.reason) { wx.showToast({ title: '请选择刻章原因', icon: 'none' }); return false; }
      if (!d.contactPhone || d.contactPhone.length !== 11) { wx.showToast({ title: '请输入正确联系号码', icon: 'none' }); return false; }
      if (d.isPersonal) {
        if (!d.personName || !d.personName.trim()) { wx.showToast({ title: '请输入姓名', icon: 'none' }); return false; }
      } else {
        if (!d.companyName.trim()) { wx.showToast({ title: '请输入公司名称', icon: 'none' }); return false; }
        if (!d.legalPhone || d.legalPhone.length !== 11) { wx.showToast({ title: '请输入正确法人电话', icon: 'none' }); return false; }
      }
      return true;
    }
  }
});
