// pages/newspaper/bidding/index.js
const common = require('../../../utils/common.js');
const api = require('../../../utils/api.js');

// ========== 本地 fallback 数据（bidding.js 同款，API 不可用时兜底）==========
const biddingConfig = require('../../../utils/bidding.js');

Page({
  data: {
    showDocPicker: false,
    selectedCategory: '',
    pickedIndex: 0,
    pickedItems: [],
    searchKey: '',
    categoryList: [],    // API 数据优先，fallback 用 biddingConfig.categories
    _fallback: false,    // 标记是否走了本地 fallback
  },

  onLoad() {
    this._floatDragStart = null;
    this._floatMoved = false;
    this._loadData();
  },

  // API-first 加载，失败则 fallback 本地数据
  async _loadData() {
    try {
      const list = await api.getBiddingTemplates();
      if (list && list.length > 0) {
        this.setData({ categoryList: list, _fallback: false });
        return;
      }
    } catch (e) {
      console.warn('[bidding] API 加载失败，使用本地 fallback', e);
    }
    // fallback：直接用本地 biddingConfig.categories
    this.setData({
      categoryList: biddingConfig.categories,
      _fallback: true,
    });
  },

  goBack() { wx.navigateBack(); },

  openDocPicker(e) {
    const idx = e.currentTarget.dataset.index;
    const cat = this.data.categoryList[idx];
    const docs = cat.docs || [];
    this.setData({ showDocPicker: true, pickedIndex: idx, selectedCategory: cat.id, pickedItems: docs, searchKey: '' });
  },

  closeDocPicker() { this.setData({ showDocPicker: false }); },

  onSearch(e) {
    const key = e.detail.value || '';
    const cat = this.data.categoryList[this.data.pickedIndex];
    const docs = cat.docs || [];
    const filtered = key ? docs.filter(item => item.name.indexOf(key) !== -1) : docs;
    this.setData({ searchKey: key, pickedItems: filtered });
  },

  selectItem(e) {
    const { name } = e.currentTarget.dataset;
    if (!name) return;

    const cat = this.data.categoryList[this.data.pickedIndex];
    let content = null;

    // API 模式下：content 已在 docs 数组里（API 返回含 content）
    // 本地 fallback 模式：调 generateContent 兜底
    if (this.data._fallback) {
      content = biddingConfig.generateContent(name);
    } else {
      // API 数据中找对应 item 取 content
      const docs = cat.docs || [];
      const item = docs.find(d => d.name === name);
      content = item ? item.content : biddingConfig.generateContent(name);
    }

    wx.setStorageSync('newspaperTemplate', {
      name,
      content,
      businessType: '招标公告',
      category: cat.name,
      _timestamp: Date.now(),
    });
    wx.setStorageSync('formPageNavData', {
      type: '招标公告',
      docName: name,
      categoryName: cat.name,
      itemName: name,
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
