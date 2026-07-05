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

  onLoad(options) {
    // 初始化省市区三列数据
    const provinces = Object.keys(REGIONS);
    const firstProvince = provinces[0];
    const firstProvinceData = REGIONS[firstProvince];
    let cities, firstCity, firstCityData;

    if (Array.isArray(firstProvinceData)) {
      // 直辖市：value 是区县数组，city 用省名
      cities = [firstProvince];
      firstCity = firstProvince;
      firstCityData = firstProvinceData;
    } else {
      cities = Object.keys(firstProvinceData);
      firstCity = cities[0];
      firstCityData = firstProvinceData[firstCity];
    }

    this.setData({
      regionColumns: [provinces, cities, firstCityData]
    });

    // 读取已有地址
    const address = wx.getStorageSync('deliveryAddress');
    if (address && address.province) {
      const pIdx = provinces.indexOf(address.province);
      if (pIdx >= 0) {
        const pData = REGIONS[address.province];
        let cIdx = 0, cName, cData, dIdx = 0;
        if (Array.isArray(pData)) {
          cName = address.province;
          cData = pData;
        } else {
          const cities = Object.keys(pData);
          cIdx = cities.indexOf(address.city);
          if (cIdx < 0) cIdx = 0;
          cName = cities[cIdx];
          cData = pData[cName] || [];
        }
        dIdx = cData.indexOf(address.district);
        if (dIdx < 0) dIdx = 0;
        this.setData({
          name: address.name || '',
          phone: address.phone || '',
          province: address.province,
          city: cName,
          district: cData[dIdx] || '',
          regionText: `${address.province} ${cName} ${cData[dIdx] || ''}`.trim(),
          regionIndex: [pIdx, cIdx, dIdx],
          regionColumns: [
            provinces,
            Array.isArray(pData) ? [address.province] : Object.keys(pData),
            cData
          ],
          isDefault: address.isDefault || false
        });
      }
    }
  },

  // 滚动某列触发（联动更新后续列）
  onRegionColumnChange(e) {
    const { column, value } = e.detail;
    let { regionColumns, regionIndex } = this.data;
    regionIndex = [...regionIndex];
    regionIndex[column] = value;

    if (column === 0) {
      // 省变化，重置市/区
      const province = regionColumns[0][value];
      const pData = REGIONS[province];
      let cities, cData;
      if (Array.isArray(pData)) {
        cities = [province];
        cData = pData;
      } else {
        cities = Object.keys(pData);
        cData = pData[cities[0]] || [];
      }
      regionColumns = [regionColumns[0], cities, cData];
      regionIndex[1] = 0;
      regionIndex[2] = 0;
    } else if (column === 1) {
      // 市变化，重置区
      const province = regionColumns[0][regionIndex[0]];
      const pData = REGIONS[province];
      let cityName, cData;
      if (Array.isArray(pData)) {
        cityName = province;
        cData = pData;
      } else {
        cityName = regionColumns[1][value];
        cData = pData[cityName] || [];
      }
      regionColumns[2] = cData;
      regionIndex[2] = 0;
    }

    this.setData({ regionColumns, regionIndex });
  },

  // 确认选择（点"确定"）
  onRegionChange(e) {
    const [pIdx, cIdx, dIdx] = e.detail.value;
    const province = this.data.regionColumns[0][pIdx];
    let city, district;
    const pData = REGIONS[province];
    if (Array.isArray(pData)) {
      city = province;
      district = pData[dIdx] || '';
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
