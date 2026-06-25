// pages/newspaper/invoice-receipt/index.js
const common = require('../../../utils/common.js');
const invoiceReceiptConfig = require('../../../utils/invoice-receipt.js');

const colors = ['#5B6FE8', '#FA8C16', '#52C41A', '#9BA8FF', '#13C2C2', '#EB2F96'];
const categories = invoiceReceiptConfig.categories.map((cat, index) => ({
  ...cat,
  color: colors[index % colors.length]
}));

Page({
  data: {
    statusBarHeight: 20,
    navHeight: 64,
    showDocPicker: false,
    pickedIndex: 0,
    pickedItems: [],
    searchKey: '',
    floatBtnTop: 400,
    categoryList: categories
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
    const filtered = key
      ? cat.docs.filter(item => item.name.indexOf(key) !== -1)
      : cat.docs;
    this.setData({ searchKey: key, pickedItems: filtered });
  },

  selectItem(e) {
    const { name } = e.currentTarget.dataset;
    if (!name) return;
    const cat = this.data.categoryList[this.data.pickedIndex];
    const item = (cat.items || []).find(d => d.name === name);
    if (!item) return;
    const itemName = item.name;

    wx.setStorageSync('newspaperTemplate', {
      name: itemName,
      content: invoiceReceiptConfig.generateContent(itemName),
      businessType: '发票收据',
      category: cat.name,
      _timestamp: Date.now()
    });
    wx.setStorageSync('formPageNavData', {
      type: '发票收据',
      docName: itemName,
      categoryName: cat.name,
      itemName: itemName,
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
