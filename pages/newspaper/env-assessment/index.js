// pages/newspaper/env-assessment/index.js
const common = require('../../../utils/common.js');
const api = require('../../../utils/api.js');
const envConfig = require('../../../utils/env-assessment.js');

Page({
  data: {
    showDocPicker: false,
    pickedIndex: 0,
    pickedItems: [],
    searchKey: '',
    // API-first + fallback 模式：优先用 API 数据，本地兜底
    categoryList: envConfig.categories,
    _apiLoaded: false,
  },

  onLoad() {
    this._floatDragStart = null;
    this._floatMoved = false;
    this._loadFromAPI();
  },

  /** 尝试从后端 API 加载分类数据，失败则使用本地兜底 */
  async _loadFromAPI() {
    try {
      const data = await api.getEnvTemplates();
      if (Array.isArray(data) && data.length > 0) {
        this.setData({ categoryList: data, _apiLoaded: true });
      }
    } catch (e) {
      console.warn('[环评公示] API 加载失败，使用本地兜底数据', e);
    }
  },

  goBack() {
    wx.navigateBack();
  },

  openDocPicker(e) {
    const idx = e.currentTarget.dataset.index;
    const cat = this.data.categoryList[idx];
    const docs = cat.docs || [];
    this.setData({
      showDocPicker: true,
      pickedIndex: idx,
      pickedItems: docs,
      searchKey: '',
    });
  },

  closeDocPicker() {
    this.setData({ showDocPicker: false });
  },

  onSearch(e) {
    const key = e.detail.value || '';
    const cat = this.data.categoryList[this.data.pickedIndex];
    const allDocs = cat.docs || [];
    const filtered = key
      ? allDocs.filter(item => item.name.indexOf(key) !== -1)
      : allDocs;
    this.setData({ searchKey: key, pickedItems: filtered });
  },

  selectItem(e) {
    const { name } = e.currentTarget.dataset;
    if (!name) return;

    const cat = this.data.categoryList[this.data.pickedIndex];
    const item = (cat.docs || []).find(d => d.name === name);
    if (!item) return;

    // 优先使用 API 返回的 content，API 未命中则 fallback 本地 generateContent
    const content = item.content || envConfig.generateContent(name);

    wx.setStorageSync('newspaperTemplate', {
      name: item.name,
      content,
      businessType: '环评公示',
      category: cat.name,
      _timestamp: Date.now(),
    });
    wx.setStorageSync('formPageNavData', {
      type: '环评公示',
      docName: item.name,
      categoryName: cat.name,
      itemName: item.name,
      _timestamp: Date.now(),
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
