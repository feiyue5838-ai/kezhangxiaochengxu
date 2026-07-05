// pages/newspaper/company-docs/index.js
const common = require('../../../utils/common.js');
const companyDocsConfig = require('../../../utils/company-docs.js');

const colors = [
  '#5B6FE8', '#FA8C16', '#52C41A', '#9BA8FF',
  '#13C2C2', '#EB2F96', '#F5222D', '#FAAD14',
  '#7B8FF7', '#A0D911', '#5B6FE8', '#8C8C8C'
];
const categories = companyDocsConfig.categories.map((cat, index) => ({
  ...cat,
  color: colors[index % colors.length]
}));

Page({
  data: {
    showDocPicker: false,
    pickedIndex: 0,
    pickedItems: [],
    searchKey: '',
    categoryList: categories
  },

  onLoad() {
    this._floatDragStart = null;
    this._floatMoved = false;
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 });
    }
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
    const item = (cat.docs || []).find(d => d.name === name);
    if (!item) return;

    wx.setStorageSync('newspaperTemplate', {
      name: item.name,
      content: companyDocsConfig.generateContent(item.name, cat.name),
      businessType: '企业证件',
      category: cat.name,
      _timestamp: Date.now()
    });
    wx.setStorageSync('formPageNavData', {
      type: '企业证件',
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
