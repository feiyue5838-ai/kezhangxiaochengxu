// pages/newspaper/auction/index.js
const common = require('../../../utils/common.js');
const auctionConfig = require('../../../utils/auction.js');
const api = require('../../../utils/api.js');

// API 返回分组：{ id, name, color, hot, total, docs: [{ name, content }] }
// fallback：announcement.js 本地 categories + generateContent
let categoriesFromApi = null;

Page({
  data: {
    selectedCategory: '',
    categories: auctionConfig.categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      desc: cat.desc,
      color: cat.color,
      hot: cat.hot,
      items: cat.docs
    })),
    pickedIndex: -1,
    pickedItems: [],
    showDocPicker: false,
    searchKey: '',
    loading: false,
    useApi: false,
  },

  onLoad() {
    this._floatDragStart = null;
    this._floatMoved = false;
    this._loadFromApi();
  },

  async _loadFromApi() {
    this.setData({ loading: true });
    try {
      const res = await api.getAuctionTemplates();
      if (Array.isArray(res) && res.length > 0) {
        categoriesFromApi = res;
        const cats = res.map(g => ({
          id: g.id,
          name: g.name,
          desc: g.name,
          color: g.color,
          hot: g.hot,
          items: g.docs.map(d => ({ name: d.name, content: d.content }))
        }));
        this.setData({ categories: cats, loading: false, useApi: true });
        return;
      }
    } catch (e) {
      console.warn('[auction] API 调用失败，使用前端硬编码兜底', e);
    }
    this.setData({ loading: false });
  },

  goBack() { wx.navigateBack(); },

  selectTemplate(e) {
    const { id } = e.currentTarget.dataset;
    const idx = this.data.categories.findIndex(c => c.id == id || c.id === id);
    const cat = this.data.categories[idx];
    this.setData({ selectedCategory: id, pickedIndex: idx, pickedItems: cat.items || [], showDocPicker: true, searchKey: '' });
  },

  closeDocPicker() { this.setData({ showDocPicker: false, searchKey: '' }); },

  onSearch(e) {
    const v = e.detail.value.trim().toLowerCase();
    const cat = this.data.categories[this.data.pickedIndex];
    if (!v) { this.setData({ searchKey: '', pickedItems: cat.items || [] }); return; }
    const filtered = (cat.items || []).filter(d => d.name.toLowerCase().includes(v));
    this.setData({ searchKey: e.detail.value, pickedItems: filtered });
  },

  selectItem(e) {
    const { name } = e.currentTarget.dataset;
    const { pickedIndex, categories } = this.data;
    const cat = categories[pickedIndex];
    if (!name || !cat) return;
    const item = (cat.items || []).find(d => d.name === name);
    if (!item) return;

    // API 有 content 直接用；无则 fallback 规则生成
    const content = (item.content && item.content.trim())
      ? item.content
      : (auctionConfig.generateContent(name) || '');

    wx.setStorageSync('newspaperTemplate', {
      name,
      content,
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
    this.setData({ showDocPicker: false });
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
