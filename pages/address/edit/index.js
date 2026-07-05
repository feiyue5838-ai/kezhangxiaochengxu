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

  // 初始化省市区三列
  initRegionData() {
    const provinces = REGIONS.provinces;
    const firstProv = provinces[0];
    const cityOrDistrictList = REGIONS.cities[firstProv] || [];

    let cities, districtList;

    // 直辖市：cities[省] 是区数组
    if (Array.isArray(cityOrDistrictList)) {
      cities = [firstProv];
      districtList = cityOrDistrictList;
    } else {
      // 普通省：cities[省] 是市数组，再取第一个市的区
      cities = cityOrDistrictList;
      const firstCity = cities[0];
      districtList = REGIONS.cities[firstCity] || [];
    }

    this.setData({
      regionColumns: [provinces, cities, districtList]
    });
  },

  // 读取已保存的地址
  loadSavedAddress() {
    const address = wx.getStorageSync('deliveryAddress');
    if (!address || !address.province) return;

    const provinces = REGIONS.provinces;
    const pIdx = provinces.indexOf(address.province);
    if (pIdx < 0) return;

    const cityOrDistrictList = REGIONS.cities[address.province];
    let cIdx = 0, cName, dList;

    if (Array.isArray(cityOrDistrictList)) {
      // 直辖市
      cName = address.province;
      dList = cityOrDistrictList;
    } else {
      const cities = cityOrDistrictList || [];
      cIdx = cities.indexOf(address.city);
      if (cIdx < 0) cIdx = 0;
      cName = cities[cIdx];
      dList = REGIONS.cities[cName] || [];
    }

    const dIdx = dList.indexOf(address.district);
    if (dIdx < 0) dIdx = 0;

    this.setData({
      name: address.name || '',
      phone: address.phone || '',
      province: address.province,
      city: cName,
      district: dList[dIdx] || '',
      regionText: `${address.province} ${cName} ${dList[dIdx] || ''}`.trim(),
      regionIndex: [pIdx, cIdx, dIdx],
      regionColumns: [
        provinces,
        Array.isArray(cityOrDistrictList) ? [address.province] : cityOrDistrictList,
        dList
      ],
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
      // 省变化
      const province = regionColumns[0][value];
      const cityOrDistrictList = REGIONS.cities[province];
      let cities, dList;

      if (Array.isArray(cityOrDistrictList)) {
        cities = [province];
        dList = cityOrDistrictList;
      } else {
        cities = cityOrDistrictList;
        dList = REGIONS.cities[cities[0]] || [];
      }

      regionColumns = [regionColumns[0], cities, dList];
      regionIndex[1] = 0;
      regionIndex[2] = 0;
    } else if (column === 1) {
      // 市变化
      const province = regionColumns[0][regionIndex[0]];
      const cityOrDistrictList = REGIONS.cities[province];
      let dList;

      if (Array.isArray(cityOrDistrictList)) {
        dList = cityOrDistrictList;
      } else {
        const cityName = regionColumns[1][value];
        dList = REGIONS.cities[cityName] || [];
      }

      regionColumns[2] = dList;
      regionIndex[2] = 0;
    }

    this.setData({ regionColumns, regionIndex });
  },

  // 确认选择
  onRegionChange(e) {
    const [pIdx, cIdx, dIdx] = e.detail.value;
    const province = this.data.regionColumns[0][pIdx];
    const cityOrDistrictList = REGIONS.cities[province];

    let city, district;

    if (Array.isArray(cityOrDistrictList)) {
      city = province;
      district = cityOrDistrictList[dIdx] || '';
    } else {
      city = this.data.regionColumns[1][cIdx];
      district = this.data.regionColumns[2][dIdx] || '';
    }

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
