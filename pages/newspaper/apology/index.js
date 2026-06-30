// pages/newspaper/apology/index.js
const common = require('../../../utils/common.js');
const apologyConfig = require('../../../utils/apology.js');

Page({
  data: {
    statusBarHeight: 20,
    navHeight: 64,
    showDocPicker: false,
    pickedIndex: 0,
    pickedItems: [],
    searchKey: '',
    categoryList: apologyConfig.categories
  },

  onLoad() {
    const { statusBarHeight, navHeight } = common.getNavigationHeight();
    this.setData({ statusBarHeight, navHeight });
    this._floatDragStart = null;
    this._floatMoved = false;
  },

  goBack() {
    wx.navigateBack();
  },

  openDocPicker(e) {
    const idx = e.currentTarget.dataset.index;
    const cat = this.data.categoryList[idx];
    this.setData({
      showDocPicker: true,
      pickedIndex: idx,
      pickedItems: cat.docs,
      searchKey: ''
    });
  },

  closeDocPicker() {
    this.setData({ showDocPicker: false });
  },

  onSearch(e) {
    const key = e.detail.value || '';
    const cat = this.data.categoryList[this.data.pickedIndex];
    const filtered = key ? cat.docs.filter(item => item.name.indexOf(key) !== -1) : cat.docs;
    this.setData({ searchKey: key, pickedItems: filtered });
  },

  selectItem(e) {
    const { name } = e.currentTarget.dataset;
    if (!name) return;
    const cat = this.data.categoryList[this.data.pickedIndex];
    wx.setStorageSync('newspaperTemplate', {
      name,
      content: apologyConfig.generateContent(name),
      businessType: '登报道歉',
      category: cat.name,
      _timestamp: Date.now()
    });
    wx.setStorageSync('formPageNavData', {
      type: '登报道歉',
      docName: name,
      categoryName: cat.name,
      itemName: name,
      _timestamp: Date.now()
    });
    wx.navigateTo({ url: '/pages/newspaper/content-edit/index' });
  },

  onFloatTouchStart(e) {
    this._floatDragStart = e.touches[0].clientY;
    this._floatMoved = false;
  },

  onFloatTouchMove(e) {
    if (!this._floatDragStart) return;
    const dy = e.touches[0].clientY - this._floatDragStart;
    if (Math.abs(dy) > 10) this._floatMoved = true;
    let top = this.data.floatBtnTop + dy;
    top = Math.max(400, Math.min(1200, top));
    this._floatDragStart = e.touches[0].clientY;
    this.setData({ floatBtnTop: top });
  },

  onFloatTouchEnd() {
    this._floatDragStart = null;
  },

  contactService() {
    if (this._floatMoved) return;
    wx.makePhoneCall({ phoneNumber: '4000049919' });
  }
});
