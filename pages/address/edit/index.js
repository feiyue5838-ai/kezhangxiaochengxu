// pages/address/edit/index.js
const REGIONS = require('../../../utils/region-data.js');

Page({
  data: {
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    detail: '',              // P1: 补上 detail 字段声明
    regionText: '请选择省市区',
    regionIndex: [0, 0, 0],
    regionColumns: [[], [], []],
    isDefault: false
  },

  onLoad() {
    this.initRegionData();
    this.loadSavedAddress();
  },

  // 初始化省市区三列（一致三级结构：省→市→区）
  initRegionData() {
    const provinces = REGIONS.provinces;
    const firstProv = provinces[0];
    const cities = REGIONS.provinceToCities[firstProv] || [];
    const firstCity = cities[0] || '';
    const districts = REGIONS.cityToDistricts[firstCity] || [];

    this.setData({
      regionColumns: [provinces, cities, districts]
    });
  },

  // 读取已保存的地址（P1: 回填 detail 字段）
  loadSavedAddress() {
    const address = wx.getStorageSync('deliveryAddress');
    if (!address || !address.province) return;

    const provinces = REGIONS.provinces;
    const pIdx = provinces.indexOf(address.province);
    if (pIdx < 0) return;

    const cities = REGIONS.provinceToCities[address.province] || [];
    const cIdx = cities.indexOf(address.city);
    const cName = cIdx >= 0 ? address.city : (cities[0] || '');

    const districts = REGIONS.cityToDistricts[cName] || [];
    const dIdx = districts.indexOf(address.district);

    this.setData({
      name: address.name || '',
      phone: address.phone || '',
      province: address.province,
      city: cName,
      district: dIdx >= 0 ? address.district : (districts[0] || ''),
      detail: address.detail || '',           // P1: 回填详细地址
      regionText: `${address.province} ${cName} ${dIdx >= 0 ? address.district : districts[0] || ''}`.trim(),
      regionIndex: [pIdx, cIdx >= 0 ? cIdx : 0, dIdx >= 0 ? dIdx : 0],
      regionColumns: [provinces, cities, districts],
      isDefault: address.isDefault || false
    });
  },

  // 滚动某列（联动）—— P2: 不再直接修改 regionColumns[2]
  onRegionColumnChange(e) {
    const { column, value } = e.detail;
    const regionIndex = [...this.data.regionIndex];
    regionIndex[column] = value;

    if (column === 0) {
      // 省变化 → 重置市和区
      const province = this.data.regionColumns[0][value];
      const cities = REGIONS.provinceToCities[province] || [];
      const districts = REGIONS.cityToDistricts[cities[0]] || [];

      this.setData({
        regionColumns: [this.data.regionColumns[0], cities, districts],
        regionIndex: [value, 0, 0]
      });
    } else if (column === 1) {
      // 市变化 → 重置区（P2: 用新数组替换，不原地修改）
      const cityName = this.data.regionColumns[1][value];
      const districts = REGIONS.cityToDistricts[cityName] || [];

      this.setData({
        'regionColumns[2]': districts,
        'regionIndex[1]': value,
        'regionIndex[2]': 0
      });
    } else {
      // 第2列（区）滚动，只更新 index
      this.setData({
        'regionIndex[2]': value
      });
    }
  },

  // 确认选择
  onRegionChange(e) {
    const [pIdx, cIdx, dIdx] = e.detail.value;
    const province = this.data.regionColumns[0][pIdx];
    const cities = REGIONS.provinceToCities[province] || [];
    const city = cities[cIdx] || '';
    const districts = REGIONS.cityToDistricts[city] || [];
    const district = districts[dIdx] || '';

    this.setData({
      province,
      city,
      district,
      regionText: `${province} ${city} ${district}`.trim(),
      regionIndex: e.detail.value
    });
  },

  onNameInput(e) {
    this.setData({ name: e.detail.value });
  },

  onPhoneInput(e) {
    this.setData({ phone: e.detail.value });
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
    const { name, phone, province, city, district, detail, isDefault } = this.data;

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

    if (!detail || !detail.trim()) {
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
      isDefault
    };

    wx.setStorageSync('deliveryAddress', address);
    wx.showToast({ title: '保存成功', icon: 'success' });

    setTimeout(() => {
      wx.navigateBack();
    }, 1000);
  }
});
