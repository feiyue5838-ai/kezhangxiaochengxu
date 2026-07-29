// pages/newspaper/creditor/index.js
const common = require('../../../utils/common.js');
const creditorConfig = require('../../../utils/creditor.js');
const api = require('../../../utils/api.js');

let categoriesFromApi = null;

Page({
  data: {
    selectedCategory: '',
    categories: creditorConfig.categories.map(cat => ({
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
    searchKey: ''
  },

  onLoad() {
    this._floatTouch = null;
    // 缓存窗口高度，避免拖拽时重复调用 API
    try {
      const sys = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
      this._windowHeight = sys.windowHeight || 700;
    } catch (e) {
      this._windowHeight = 700;
    }
    this._loadFromApi();
  },

  async _loadFromApi() {
    try {
      const res = await api.getCreditorTemplates();
      if (Array.isArray(res) && res.length > 0) {
        categoriesFromApi = res;
        const mapped = res.map(cat => ({
          id: cat.id,
          name: cat.name,
          desc: cat.name,
          color: cat.color,
          hot: cat.hot,
          items: (cat.docs || []).map(d => ({ name: d.name, sub: cat.name })),
        }));
        this.setData({ categories: mapped });
      }
    } catch (e) {
      console.warn('[creditor] API 调用失败，使用前端硬编码兜底', e);
    }
  },

  goBack() {
    wx.navigateBack();
  },

  selectTemplate(e) {
    const { id } = e.currentTarget.dataset;
    const idx = this.data.categories.findIndex(c => c.id === id);
    const cat = this.data.categories[idx];
    this.setData({
      selectedCategory: id,
      pickedIndex: idx,
      pickedItems: cat.items || [],
      showDocPicker: true,
      searchKey: ''
    });
  },

  closeDocPicker() {
    this.setData({ showDocPicker: false, searchKey: '' });
  },

  onSearch(e) {
    const v = e.detail.value.trim().toLowerCase();
    const cat = this.data.categories[this.data.pickedIndex];
    if (!v) {
      this.setData({ searchKey: '', pickedItems: cat.items || [] });
      return;
    }
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

    // API 优先取 content，fallback 本地生成
    let content = null;
    if (categoriesFromApi) {
      const apiCat = categoriesFromApi.find(c => c.id === cat.id);
      if (apiCat) {
        const apiDoc = (apiCat.docs || []).find(d => d.name === name);
        if (apiDoc && apiDoc.content && apiDoc.content.trim()) {
          content = apiDoc.content;
        }
      }
    }
    if (!content) {
      content = creditorConfig.generateContent({ name: item.name });
    }

    wx.setStorageSync('newspaperTemplate', {
      name: item.name,
      content,
      businessType: '债权债务',
      category: cat.name,
      _timestamp: Date.now()
    });
    wx.setStorageSync('formPageNavData', {
      type: '债权债务',
      docName: item.name,
      categoryName: cat.name,
      itemName: item.name,
      _timestamp: Date.now()
    });
    this.setData({ showDocPicker: false });
    wx.navigateTo({ url: '/pages/newspaper/content-edit/index' });
  },

  contactService() {
    wx.makePhoneCall({ phoneNumber: '400-888-8888' });
  },

  onFloatTouchStart(e) {
    this._floatTouch = { startY: e.touches[0].clientY, curTop: this.data.floatBtnTop };
  },
  onFloatTouchMove(e) {
    if (!this._floatTouch) return;
    const dy = e.touches[0].clientY - this._floatTouch.startY;
    const newTop = Math.max(100, Math.min(this._floatTouch.curTop + dy, (this._windowHeight || 700) - 80));
    this.setData({ floatBtnTop: newTop });
  },
  onFloatTouchEnd() {
    this._floatTouch = null;
  }
});
