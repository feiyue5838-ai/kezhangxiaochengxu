// pages/newspaper/auction/index.js
const common = require('../../../utils/common.js');
const auctionConfig = require('../../../utils/auction.js');

Page({
  data: {
    statusBarHeight: 20,
    navHeight: 64,
    showDocPicker: false,
    pickedIndex: 0,
    pickedItems: [],
    searchKey: '',
    floatBtnTop: 400,
    categoryList: auctionConfig.categories
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
      content: auctionConfig.generateContent(name),
      businessType: '拍卖公告',
      category: cat.name,
      _timestamp: Date.now()
    });
    wx.setStorageSync('formPageNavData', {
      type: '拍卖公告',
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
