Page({
  data: {
    statusBarHeight: 0,
    navHeight: 0,
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    detail: '',
    regionText: '请选择省市区',
    regionIndex: -1,
    regionList: [],
    isDefault: false
  },

  onLoad(options) {
    // 导航栏安全区（与 realname 对齐）
    const sysInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: sysInfo.statusBarHeight || 20,
      navHeight: (sysInfo.statusBarHeight || 20) + 64
    });

    // 初始化区域列表
    const regions = [
      { province: '四川省', city: '成都市', district: '锦江区' },
      { province: '四川省', city: '成都市', district: '青羊区' },
      { province: '四川省', city: '成都市', district: '金牛区' },
      { province: '四川省', city: '成都市', district: '武侯区' },
      { province: '四川省', city: '成都市', district: '成华区' },
      { province: '四川省', city: '成都市', district: '龙泉驿区' },
      { province: '四川省', city: '成都市', district: '青白江区' },
      { province: '四川省', city: '成都市', district: '新都区' },
      { province: '四川省', city: '成都市', district: '温江区' },
      { province: '四川省', city: '成都市', district: '双流区' },
      { province: '四川省', city: '成都市', district: '郫都区' },
      { province: '四川省', city: '成都市', district: '新津区' },
      { province: '四川省', city: '成都市', district: '金堂县' },
      { province: '四川省', city: '成都市', district: '大邑县' },
      { province: '四川省', city: '成都市', district: '蒲江县' },
      { province: '四川省', city: '成都市', district: '简阳市' },
      { province: '四川省', city: '成都市', district: '都江堰市' },
      { province: '四川省', city: '成都市', district: '彭州市' },
      { province: '四川省', city: '成都市', district: '邛崃市' },
      { province: '四川省', city: '成都市', district: '崇州市' },
      { province: '四川省', city: '成都市', district: '高新区' },
      { province: '四川省', city: '成都市', district: '天府新区' },
      { province: '四川省', city: '成都市', district: '东部新区' }
    ];
    this.setData({ regionList: regions.map(r => r.province + ' ' + r.city + ' ' + r.district) });

    // 读取已有地址
    const address = wx.getStorageSync('deliveryAddress');
    if (address) {
      this.setData({
        name: address.name || '',
        phone: address.phone || '',
        province: address.province || '',
        city: address.city || '',
        district: address.district || '',
        detail: address.detail || '',
        regionText: address.province ? `${address.province} ${address.city} ${address.district}` : '请选择省市区',
        isDefault: address.isDefault || false
      });
    }
  },

  onNameInput(e) {
    this.setData({ name: e.detail.value });
  },

  onPhoneInput(e) {
    this.setData({ phone: e.detail.value });
  },

  onRegionChange(e) {
    const idx = e.detail.value;
    const regions = [
      { province: '四川省', city: '成都市', district: '锦江区' },
      { province: '四川省', city: '成都市', district: '青羊区' },
      { province: '四川省', city: '成都市', district: '金牛区' },
      { province: '四川省', city: '成都市', district: '武侯区' },
      { province: '四川省', city: '成都市', district: '成华区' },
      { province: '四川省', city: '成都市', district: '龙泉驿区' },
      { province: '四川省', city: '成都市', district: '青白江区' },
      { province: '四川省', city: '成都市', district: '新都区' },
      { province: '四川省', city: '成都市', district: '温江区' },
      { province: '四川省', city: '成都市', district: '双流区' },
      { province: '四川省', city: '成都市', district: '郫都区' },
      { province: '四川省', city: '成都市', district: '新津区' },
      { province: '四川省', city: '成都市', district: '金堂县' },
      { province: '四川省', city: '成都市', district: '大邑县' },
      { province: '四川省', city: '成都市', district: '蒲江县' },
      { province: '四川省', city: '成都市', district: '简阳市' },
      { province: '四川省', city: '成都市', district: '都江堰市' },
      { province: '四川省', city: '成都市', district: '彭州市' },
      { province: '四川省', city: '成都市', district: '邛崃市' },
      { province: '四川省', city: '成都市', district: '崇州市' },
      { province: '四川省', city: '成都市', district: '高新区' },
      { province: '四川省', city: '成都市', district: '天府新区' },
      { province: '四川省', city: '成都市', district: '东部新区' }
    ];
    const r = regions[idx];
    this.setData({
      regionIndex: idx,
      province: r.province,
      city: r.city,
      district: r.district,
      regionText: `${r.province} ${r.city} ${r.district}`
    });
  },

  onDetailInput(e) {
    this.setData({ detail: e.detail.value });
  },

  onDefaultChange(e) {
    this.setData({ isDefault: e.detail.value });
  },

  onBack() {
    wx.navigateBack();
  },

  onSave() {
    const { name, phone, province, city, district, detail } = this.data;

    if (!name.trim()) {
      wx.showToast({ title: '请输入收件人姓名', icon: 'none' });
      return;
    }

    if (!/^1\d{10}$/.test(phone)) {
      wx.showToast({ title: '请输入正确的手机号', icon: 'none' });
      return;
    }

    if (!province) {
      wx.showToast({ title: '请选择省市区', icon: 'none' });
      return;
    }

    if (!detail.trim()) {
      wx.showToast({ title: '请输入详细地址', icon: 'none' });
      return;
    }

    const address = {
      name: name.trim(),
      phone: phone.trim(),
      province,
      city,
      district,
      detail: detail.trim(),
      isDefault: this.data.isDefault
    };

    wx.setStorageSync('deliveryAddress', address);
    wx.showToast({ title: '保存成功', icon: 'success' });

    setTimeout(() => {
      wx.navigateBack();
    }, 1000);
  }
});
