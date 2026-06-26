// pages/newspaper/labor-dispute/index.js
const common = require('../../../utils/common.js');
const laborConfig = require('../../../utils/labor.js');

Page({
  data: {
    statusBarHeight: 20,
    navHeight: 64,
    showDocPicker: false,
    pickedIndex: 0,
    pickedItems: [],
    searchKey: '',
    floatBtnTop: 400,
    categoryList: laborConfig.categories
  },

  onLoad() {
    const statusBarHeight = common.getNavigationHeight().statusBarHeight;
    const navHeight = statusBarHeight + 64;
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
      pickedItems: cat.items,
      searchKey: ''
    });
  },

  closeDocPicker() {
    this.setData({ showDocPicker: false });
  },

  onSearch(e) {
    const key = e.detail.value || '';
    const cat = this.data.categoryList[this.data.pickedIndex];
    const filtered = key
      ? cat.items.filter(item => item.name.indexOf(key) !== -1)
      : cat.items;
    this.setData({ searchKey: key, pickedItems: filtered });
  },

  selectItem(e) {
    const { name } = e.currentTarget.dataset;
    if (!name) return;
    const cat = this.data.categoryList[this.data.pickedIndex];
    const item = (cat.items || []).find(d => d.name === name);
    if (!item) return;

    wx.setStorageSync('newspaperTemplate', {
      name: item.name,
      content: laborConfig.generateContent(item.name),
      businessType: '解除劳动',
      category: cat.name,
      _timestamp: Date.now()
    });
    wx.setStorageSync('formPageNavData', {
      type: '解除劳动',
      docName: item.name,
      categoryName: cat.name,
      itemName: item.name,
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
