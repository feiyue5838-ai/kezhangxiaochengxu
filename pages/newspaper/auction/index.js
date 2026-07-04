// pages/newspaper/auction/index.js
const common = require('../../../utils/common.js');
const auctionConfig = require('../../../utils/auction.js');

Page({
  data: {

    showDocPicker: false,
    pickedIndex: 0,
    pickedItems: [],
    searchKey: '',
    categoryList: auctionConfig.categories
  },

  onLoad() {
    this._floatDragStart = null;
    this._floatMoved = false;
  },

  goBack() { wx.navigateBack(); },

  openDocPicker(e) {
    const idx = e.currentTarget.dataset.index;
    const cat = this.data.categoryList[idx];
    this.setData({ showDocPicker: true, pickedIndex: idx, pickedItems: cat.docs, searchKey: '' });
  },

  closeDocPicker() { this.setData({ showDocPicker: false }); },

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
