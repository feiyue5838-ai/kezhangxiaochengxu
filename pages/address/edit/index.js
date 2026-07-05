// pages/address/edit/index.js
const REGIONS = require('../../../utils/region-data.js');

Page({
  data: {
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    regionText: '请选择省市区',
    regionIndex: [0, 0, 0],
    regionColumns: [[], [], []],
    isDefault: false
  },

  onLoad() {
    this.initRegionData();
    this.loadSavedAddress();
  },

  // 初始化省市区三列（省→市→区 三级结构）
  initRegionData() {
    const provinces = REGIONS.provinces;
    const firstProv = provinces[0];
    const cities = REGIONS.cities[firstProv] || [];
    const firstCity = cities[0] || '';
    const districts = REGIONS.districts[firstCity] || [];

    this.setData({
      regionColumns: [provinces, cities, districts]
    });
  },

  // 读取已保存的地址
  loadSavedAddress() {
    const address = wx.getStorageSync('deliveryAddress');
    if (!address || !address.province) return;

    const provinces = REGIONS.provinces;
    const pIdx = provinces.indexOf(address.province);
    if (pIdx < 0) return;

    const cities = REGIONS.cities[address.province] || [];
    const cIdx = cities.indexOf(address.city);
    const cName = cIdx >= 0 ? address.city : cities[0] || '';

    const districts = REGIONS.districts[cName] || [];
    const dIdx = districts.indexOf(address.district);

    this.setData({
      name: address.name || '',
      phone: address.phone || '',
      province: address.province,
      city: cName,
      district: dIdx >= 0 ? address.district : (districts[0] || ''),
      regionText: `${address.province} ${cName} ${dIdx >= 0 ? address.district : districts[0] || ''}`.trim(),
      regionIndex: [pIdx, cIdx >= 0 ? cIdx : 0, dIdx >= 0 ? dIdx : 0],
      regionColumns: [provinces, cities, districts],
      isDefault: address.isDefault || false
    });
  },

  // 滚动某列（联动）
  onRegionColumnChange(e) {
    const { column, value } = e.detail;
    let { regionColumns, regionIndex } = this.data;
    regionIndex = [...regionIndex];
    regionIndex[column] = value;

    if (column === 0) {
      // 省变化 → 重置市和区
      const province = regionColumns[0][value];
      const cities = REGIONS.cities[province] || [];
      const districts = REGIONS.districts[cities[0]] || [];

      regionColumns = [regionColumns[0], cities, districts];
      regionIndex[1] = 0;
      regionIndex[2] = 0;
    } else if (column === 1) {
      // 市变化 → 重置区
      const cityName = regionColumns[1][value];
      const districts = REGIONS.districts[cityName] || [];

      regionColumns[2] = districts;
      regionIndex[2] = 0;
    }

    this.setData({ regionColumns, regionIndex });
  },

  // 确认选择
  onRegionChange(e) {
    const [pIdx, cIdx, dIdx] = e.detail.value;
    const province = this.data.regionColumns[0][pIdx];
    const cities = REGIONS.cities[province] || [];
    const city = cities[cIdx] || '';
    const districts = REGIONS.districts[city] || [];
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
      isDefault: this.data.isDefault
    };

    wx.setStorageSync('deliveryAddress', address);
    wx.showToast({ title: '保存成功', icon: 'success' });

    setTimeout(() => {
      wx.navigateBack();
    }, 1000);
  }
});
