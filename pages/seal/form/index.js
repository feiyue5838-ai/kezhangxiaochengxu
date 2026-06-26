// pages/seal/form/index.js
const common = require('../../../utils/common.js');

Page({
  data: {
    formValid: false,
    formData: null,
    stampType: 'company',
    isPersonal: false,
    isQuery: false,
    statusBarHeight: 20, // 状态栏高度
    navHeight: 64, // 导航栏总高度
    pageTitle: '印章申请', // 导航栏标题
    currentProvince: {
      name: '四川省',
      url: 'https://yzcx.sczwfw.gov.cn:18511/',
      cities: [
        { name: '成都市', url: 'https://yzcx.sczwfw.gov.cn:18511/' }
      ]
    },
    currentCity: '成都市',
    cityPickerOpen: false,
    _provinceOrig: {
      name: '四川省',
      url: 'https://yzcx.sczwfw.gov.cn:18511/',
      cities: [
        { name: '成都市', url: 'https://yzcx.sczwfw.gov.cn:18511/' }
      ]
    },
    personalSeals: [
      { id: 's26', name: '个人签名章' },
      { id: 's27', name: '拆迁、买房使用' },
      { id: 's28', name: '公证使用' },
      { id: 's29', name: '企业员工使用' }
    ],
    selectedSeal: '',
    selectedSealName: '',
    isElectronic: false,
    selectedElectronicSeal: '',
    selectedElectronicSealName: '',
    electronicSeals: [
      { id: 'e1', name: '财务章', categoryId: 11 },
      { id: 'e2', name: '公章', categoryId: 12 },
      { id: 'e3', name: '合同章', categoryId: 13 },
      { id: 'e4', name: '法人章', categoryId: 14 },
      { id: 'e5', name: '发票章', categoryId: 15 },
      { id: 'e6', name: '个人签名章', categoryId: 16 },
      { id: 'e7', name: '其他印章', categoryId: 17 }
    ],
    selectedElectronicCategory: '',
    popupTitle: ''
  },

  onLoad(options) {
    // 从全局数据读取导航栏高度（app.js 已计算）
    const statusBarHeight = common.getNavigationHeight().statusBarHeight;
    const navHeight = statusBarHeight + 64;
    this.setData({ statusBarHeight, navHeight });

    // 清除旧流程数据，避免各入口互相影响
    // 只清除流程核心数据,不清除材料/地址/发票(用户在流程中可以来回切换)
    wx.removeStorageSync('selectedSealsData');
    wx.removeStorageSync('sealOrderForm');

    const type = options.type || 'company';
    const isPersonal = (type === 'personal');
    const isQuery = (type === 'query');
    const isElectronic = (type === 'electronic');

    const titles = {
      'company': '企业刻章',
      'personal': '个人印章',
      'electronic': '电子印章',
      'query': '刻章备案查询'
    };

    this.setData({
      stampType: type,
      isPersonal: isPersonal,
      isQuery: isQuery,
      isElectronic: isElectronic,
      formValid: false,
      currentProvince: this.data.currentProvince,
      currentCity: this.data.currentCity,
      pageTitle: titles[type] || '企业刻章'
    });
  },

  // 返回上一页
  goBack() {
    wx.navigateBack({ delta: 1 });
  },

  onFormChange(e) {
    const formData = e.detail;
    const valid = this.validateForm({ ...formData, selectedSeal: this.data.selectedSeal });
    this.setData({ formData: { ...formData, selectedSeal: this.data.selectedSeal }, formValid: valid });
  },

  // half-screen-popup 弹窗(个人印章选择)
  onOpenPersonalSeals() {
    this.setData({ selectedCategory: 'personal' });
    this.selectComponent('#sealPopup').openWithCategory(9);
  },

  onOpenProfessionalSeals() {
    this.setData({ selectedCategory: 'professional' });
    this.selectComponent('#sealPopup').openWithCategory(10);
  },

  // 弹窗确认(个人/电子印章直接跳转,无需再点下一步)
  onSealConfirm(e) {
    const { ids, names } = e.detail;
    this.setData({ selectedSeal: ids.join(','), selectedSealName: names.join('、') });
    this.setData({ formValid: ids.length > 0 }, () => {
      // 个人模式:弹窗确认后直接提交跳转
      if (this.data.isPersonal && this.data.formValid) {
        this._doPersonalSubmit();
      }
      // 电子印章模式:弹窗确认后直接提交跳转
      if (this.data.isElectronic && this.data.formValid) {
        this._doElectronicSubmit();
      }
    });
  },

  validateForm(data) {
    if (this.data.isPersonal) {
      // 个人印章:只需选择印章类型
      return !!data.selectedSeal;
    }
    if (this.data.isElectronic) {
      // 电子印章:只需选择印章
      return !!data.selectedSeal;
    }
    // 企业:需要填写完整表单
    if (!data) return false;
    if (!data.region) return false;
    if (!data.reason) return false;
    // 手机号格式校验
    if (!data.contactPhone || !/^1[3-9]\d{9}$/.test(data.contactPhone)) return false;
    if (!data.companyName || !data.companyName.trim()) return false;
    // 法人电话格式校验
    if (!data.legalPhone || !/^1[3-9]\d{9}$/.test(data.legalPhone)) return false;
    return true;
  },

  // 个人印章:提交并跳转订单确认页
  _doPersonalSubmit() {
    const ids = this.data.selectedSeal.split(',').filter(Boolean);
    const names = this.data.selectedSealName.split('、').filter(Boolean);
    const categoryName = this.data.selectedCategory === 'professional' ? '个人职业章' : '个人印章';
    wx.setStorageSync('selectedSealsData', {
      ids: ids,
      names: names,
      seals: this.data.selectedSeal,
      categoryName: categoryName,
      isPersonal: true,
      _timestamp: Date.now()
    });
    wx.navigateTo({
      url: '/pages/seal/order-confirm/index'
    });
  },

  onSubmit() {
    if (!this.data.formValid) {
      wx.showToast({ title: this.data.isPersonal ? '请选择印章类型' : '请填写完整信息', icon: 'none' });
      return;
    }

    if (this.data.isPersonal) {
      // 个人印章:调用公共提交方法
      this._doPersonalSubmit();
    } else if (this.data.isElectronic) {
      // 电子印章:直接跳转订单确认
      this._doElectronicSubmit();
    } else {
      // 企业:将表单数据存入 Storage,跳选择页
      wx.setStorageSync('sealOrderForm', this.data.formData);
      wx.navigateTo({ url: '/pages/seal/select/index?type=' + this.data.stampType });
    }
  },

  // ========== 备案查询模式 ==========

  onOpenCityPicker() {
    this.setData({ cityPickerOpen: !this.data.cityPickerOpen });
  },
  onCitySelect(e) {
    const index = e.currentTarget.dataset.index;
    const province = this.data.currentProvince;
    const city = province.cities[index];
    this.setData({
      currentCity: city.name,
      currentProvince: { ...province, url: city.url },
      cityPickerOpen: false
    });
  },

  // 电子印章:选择印章类型(改为弹窗选择)
  onElectronicSealSelect(e) {
    const { id, name, category } = e.currentTarget.dataset;
    this.setData({
      selectedElectronicSeal: id,
      selectedElectronicSealName: name,
      selectedElectronicCategory: id,
      popupTitle: name
    });
    // 打开半屏弹窗
    this.selectComponent('#sealPopup').openWithCategory(category);
  },

  // 电子印章:提交并跳转
  _doElectronicSubmit() {
    const ids = this.data.selectedSeal.split(',').filter(Boolean);
    const names = this.data.selectedSealName.split('、').filter(Boolean);
    wx.setStorageSync('selectedSealsData', {
      ids: ids,
      names: names,
      seals: this.data.selectedSeal,
      categoryName: '电子印章 - ' + this.data.selectedElectronicSealName,
      isPersonal: false,
      isElectronic: true,
      _timestamp: Date.now()
    });
    wx.navigateTo({ url: '/pages/seal/order-confirm/index' });
  },

  onGoVerify() {
    const url = this.data.currentProvince.url;
    wx.setClipboardData({
      data: url,
      success: function() {
        wx.showToast({ title: '链接已复制,请在浏览器中打开', icon: 'none' });
      }
    });
  },

});

