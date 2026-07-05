// pages/newspaper/personal-docs/index.js
const common = require('../../../utils/common.js');
const personalDocsConfig = require('../../../utils/personal-docs.js');

Page({
  data: {
    showDocPicker: false,
    pickedIndex: 0,
    pickedItems: [],
    searchKey: '',
    totalCount: personalDocsConfig.getTotalCount(),
    categoryList: personalDocsConfig.categories
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

    // 保存模板数据到 Storage
    wx.setStorageSync('newspaperTemplate', {
      name: item.name,
      content: personalDocsConfig.generateContent(item.name, cat.name),
      businessType: '个人证件',
      category: cat.name,
      _timestamp: Date.now()
    });

    // 保存分类信息用于 content-edit 页显示
    wx.setStorageSync('formPageNavData', {
      type: '个人证件',
      docName: item.name,
      categoryName: cat.name,
      itemName: item.name,
      _timestamp: Date.now()
    });

    // 跳转到填写登报内容页面
    wx.navigateTo({
      url: '/pages/newspaper/content-edit/index'
    });
  },

  onFloatTouchStart(e) { common.startDrag(this, e); },
  onFloatTouchMove(e) { common.moveDrag(this, e); },
  onFloatTouchEnd() { this._floatDragStart = null; },
  contactService() {
    if (this._floatMoved) return;
    wx.makePhoneCall({ phoneNumber: '4000049919' });
  }
});
