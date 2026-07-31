// pages/newspaper/court/index.js
const common = require('../../../utils/common.js');
const courtConfig = require('../../../utils/court.js');
const api = require('../../../utils/api.js');

// API 返回的模板按 templateType 分组；fallback 使用 court.js categories
let categoriesFromApi = null;

Page({
  data: {
    selectedCategory: '',
    categories: courtConfig.categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      desc: cat.desc,
      color: cat.color,
      hot: cat.hot,
      items: cat.docs
    })),
    loading: false,
    pickedIndex: -1,
    pickedItems: [],
    showDocPicker: false,
    searchKey: ''
  },

  onLoad() {
    this._floatDragStart = null;
    this._floatMoved = false;
    // 缓存窗口高度，避免拖拽时重复调用 API
    try {
      const sys = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
      this._windowHeight = sys.windowHeight || 700;
    } catch (e) {
      this._windowHeight = 700;
    }
    this._loadFromApi();
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 });
    }
  },

  async _loadFromApi() {
    this.setData({ loading: true })
    try {
      const res = await api.getCourtTemplates();
      if (Array.isArray(res) && res.length > 0) {
        categoriesFromApi = res;
        // 将 API 数据结构映射为页面所需结构
        const mapped = res.map((cat, idx) => ({
          id: cat.id,
          name: cat.name,
          desc: cat.name, // API 无 desc，用 name 替代
          color: cat.color,
          hot: cat.hot,
          items: (cat.docs || []).map(d => ({ name: d.name, sub: cat.name }))
        }));
        this.setData({ categories: mapped, loading: false });
      }
    } catch (e) {
      console.warn('[court] API 调用失败，使用前端硬编码兜底', e);
      this.setData({ loading: false });
    }
  },

  goBack() {
    wx.navigateBack();
  },

  selectTemplate(e) {
    const { id } = e.currentTarget.dataset;
    const idx = this.data.categories.findIndex(c => c.id === id);
    const cat = this.data.categories[idx];
    if (idx === -1) return;
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
    const filtered = (cat.items || []).filter(d =>
      d.name.toLowerCase().includes(v) || (d.sub || '').toLowerCase().includes(v)
    );
    this.setData({ searchKey: e.detail.value, pickedItems: filtered });
  },

  selectItem(e) {
    const { name } = e.currentTarget.dataset;
    const { pickedIndex, categories } = this.data;
    const cat = categories[pickedIndex];
    if (!name || !cat) return;

    // API 优先：尝试从 API 数据中找 content
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
    // fallback：本地图形生成
    if (!content) {
      content = courtConfig.generateContent({ name });
    }

    wx.setStorageSync('newspaperTemplate', {
      name,
      content,
      businessType: '法院公告',
      category: cat.name,
      _timestamp: Date.now()
    });
    wx.setStorageSync('formPageNavData', {
      type: '法院公告',
      docName: name,
      categoryName: cat.name,
      itemName: name,
      _timestamp: Date.now()
    });
    this.setData({ showDocPicker: false });
    wx.navigateTo({ url: '/pages/newspaper/content-edit/index' });
  },

  contactService() {
    if (this._floatMoved) return;
    wx.makePhoneCall({ phoneNumber: '4000049919' });
  },

  onFloatTouchStart(e) {
    this._floatDragStart = { startY: e.touches[0].clientY, curTop: this.data.floatBtnTop };
    this._floatMoved = false;
  },
  onFloatTouchMove(e) {
    if (!this._floatDragStart) return;
    const dy = e.touches[0].clientY - this._floatDragStart.startY;
    const newTop = Math.max(100, Math.min(this._floatDragStart.curTop + dy,
      this._windowHeight - 80));
    this._floatMoved = Math.abs(dy) > 5;
    this.setData({ floatBtnTop: newTop });
  },
  onFloatTouchEnd() {
    this._floatDragStart = null;
  }
});
