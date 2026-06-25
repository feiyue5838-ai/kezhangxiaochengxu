// pages/newspaper/praise/index.js
const common = require('../../../utils/common.js');
const praiseConfig = require('../../../utils/praise.js');

Page({
  data: {
    statusBarHeight: 20,
    navHeight: 64,
    showDocPicker: false,
    pickedIndex: 0,
    pickedItems: [],
    searchKey: '',
    floatBtnTop: 400,
    categoryList: praiseConfig.categories
  },

  onLoad() {
    const { statusBarHeight, navHeight } = common.getNavigationHeight();
    this.setData({ statusBarHeight, navHeight });
    this._floatDragStart = null;
    this._floatMoved = false;
  },

  goBack() { wx.navigateBack(); },

  openDocPicker(e) {
    const idx = e.currentTarget.dataset.index;
    const cat = this.data.categoryList[idx];
    this.setData({ showDocPicker: true, pickedIndex: idx, pickedItems: cat.items, searchKey: '' });
  },

  closeDocPicker() { this.setData({ showDocPicker: false }); },

  onSearch(e) {
    const key = e.detail.value || '';
    const cat = this.data.categoryList[this.data.pickedIndex];
    const filtered = key ? cat.items.filter(item => item.name.indexOf(key) !== -1) : cat.items;
    this.setData({ searchKey: key, pickedItems: filtered });
  },

  selectItem(e) {
    const { name } = e.currentTarget.dataset;
    if (!name) return;
    const cat = this.data.categoryList[this.data.pickedIndex];
    wx.setStorageSync('newspaperTemplate', {
      name,
      content: praiseConfig.generateContent(name),
      businessType: '表扬信',
      category: cat.name,
      _timestamp: Date.now()
    });
    wx.setStorageSync('formPageNavData', {
      type: '表扬信',
      docName: name,
      categoryName: cat.name,
      itemName: name,
      _timestamp: Date.now()
    });
    wx.navigateTo({ url: '/pages/newspaper/content-edit/index' });
  },

  onFloatTouchStart(e) { common.startDrag(this, e); },
  onFloatTouchMove(e) { common.moveDrag(this, e); },
  onFloatTouchEnd() { this._floatDragStart = null; },
  contactService() {
    if (this._floatMoved) return;
    wx.makePhoneCall({ phoneNumber: '4000049919' });
  }
});
