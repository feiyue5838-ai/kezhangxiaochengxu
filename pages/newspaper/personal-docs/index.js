// pages/newspaper/personal-docs/index.js
const common = require('../../../utils/common.js');
const personalDocsConfig = require('../../../utils/personal-docs.js');
const api = require('../../../utils/api.js');

Page({
  data: {
    showDocPicker: false,
    selectedCategory: '',
    pickedIndex: 0,
    pickedItems: [],
    searchKey: '',
    totalCount: 0,
    categoryList: []
  },

  onLoad() {
    this._floatDragStart = null;
    this._floatMoved = false;
    this._loadData();
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 });
    }
  },

  // 从后端 API 加载数据，失败则用硬编码兜底
  _loadData() {
    wx.showLoading({ title: '加载中...', mask: true });
    api.getPersonalDocs()
      .then(data => {
        wx.hideLoading();
        if (Array.isArray(data) && data.length > 0) {
          const totalCount = data.reduce((sum, cat) => sum + (cat.docs ? cat.docs.length : 0), 0);
          this.setData({ categoryList: data, totalCount });
        } else {
          this._useFallback();
        }
      })
      .catch(() => {
        wx.hideLoading();
        this._useFallback();
      });
  },

  // 硬编码兜底（离线/接口异常时）
  _useFallback() {
    const fallback = personalDocsConfig.categories;
    this.setData({
      categoryList: fallback,
      totalCount: personalDocsConfig.getTotalCount()
    });
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
      selectedCategory: cat.id,
      pickedItems: cat.docs || [],
      searchKey: ''
    });
  },

  closeDocPicker() {
    this.setData({ showDocPicker: false });
  },

  onSearch(e) {
    const key = e.detail.value || '';
    const cat = this.data.categoryList[this.data.pickedIndex];
    const docs = cat.docs || [];
    const filtered = key
      ? docs.filter(item => item.name.indexOf(key) !== -1)
      : docs;
    this.setData({ searchKey: key, pickedItems: filtered });
  },

  selectItem(e) {
    const { name } = e.currentTarget.dataset;
    if (!name) return;
    const cat = this.data.categoryList[this.data.pickedIndex];
    const item = (cat.docs || []).find(d => d.name === name);
    if (!item) return;

    // 后端返回的 content 有值则直接用，否则用本地生成逻辑
    const content = item.content || personalDocsConfig.generateContent(item.name, cat.name);

    // 保存模板数据到 Storage
    wx.setStorageSync('newspaperTemplate', {
      name: item.name,
      content: content,
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
