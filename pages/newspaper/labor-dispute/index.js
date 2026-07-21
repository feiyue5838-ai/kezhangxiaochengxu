// pages/newspaper/labor-dispute/index.js
const common = require('../../../utils/common.js');
const api = require('../../../utils/api.js');
const laborLocal = require('../../../utils/labor.js');

Page({
  data: {
    showDocPicker: false,
    pickedIndex: 0,
    pickedItems: [],
    searchKey: '',
    categoryList: [],      // API 优先，fallback 本地
    _apiReady: false,
  },

  onLoad() {
    this._floatDragStart = null;
    this._floatMoved = false;
    this._loadTemplates();
  },

  /** API-first 加载模板；失败则 fallback 本地 labor.js */
  async _loadTemplates() {
    try {
      const list = await api.getLaborTemplates();
      if (Array.isArray(list) && list.length > 0) {
        // API 返回格式：[{ id, name, desc, color, hot, total, docs: [{ name, content, desc }] }]
        const cats = list.map(cat => ({
          id: cat.id,
          name: cat.name,
          desc: cat.desc,
          color: cat.color,
          hot: cat.hot,
          docs: cat.docs.map(d => ({
            name: d.name,
            content: d.content,   // API 直接返回 content
            desc: d.desc || '',
          })),
        }));
        this.setData({ categoryList: cats, _apiReady: true });
        return;
      }
    } catch (e) {
      console.warn('[labor-dispute] API 加载失败，fallback 本地配置:', e.message);
    }
    // Fallback: 使用本地 labor.js
    this.setData({
      categoryList: laborLocal.categories,
      _apiReady: false,
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
      pickedItems: cat.docs || [],
      searchKey: '',
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
    const docs = cat.docs || [];
    const item = docs.find(d => d.name === name);
    if (!item) return;

    // 优先使用 API 返回的 content；fallback 本地 generateContent
    const content = (item.content && item.content.trim())
      ? item.content
      : (laborLocal.generateContent(item.name) || '');

    wx.setStorageSync('newspaperTemplate', {
      name: item.name,
      content: content,
      businessType: '劳动纠纷',
      category: cat.name,
      _timestamp: Date.now(),
    });
    wx.setStorageSync('formPageNavData', {
      type: '解除劳动',
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
  },
});
