// pages/newspaper/government/index.js
const common = require('../../../utils/common.js');
const governmentConfig = require('../../../utils/government.js');
const api = require('../../../utils/api.js');

// API 返回的模板按 templateType 分组；fallback 使用 government.js categories
let categoriesFromApi = null;

Page({
  data: {
    showDocPicker: false,
    pickedIndex: 0,
    pickedItems: [],
    searchKey: '',
    categoryList: governmentConfig.categories,
  ,
    loading: false},

  onLoad() {
    this._floatDragStart = null;
    this._floatMoved = false;
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
      const res = await api.getGovernmentTemplates();
      if (Array.isArray(res) && res.length > 0) {
        categoriesFromApi = res;
        const mapped = res.map(cat => ({
          id: cat.id,
          name: cat.name,
          desc: cat.name,
          color: cat.color,
          hot: cat.hot,
          docs: (cat.docs || []).map(d => ({ name: d.name, sub: cat.name })),
        }));
        this.setData({ categoryList: mapped, loading: false });
      }
    } catch (e) {
      console.warn('[government] API 调用失败，使用前端硬编码兜底', e);
      this.setData({ loading: false });
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
    const filtered = key
      ? (cat.docs || []).filter(item => item.name.indexOf(key) !== -1)
      : (cat.docs || []);
    this.setData({ searchKey: key, pickedItems: filtered });
  },

  selectItem(e) {
    const { name } = e.currentTarget.dataset;
    if (!name) return;
    const cat = this.data.categoryList[this.data.pickedIndex];
    const item = (cat.docs || []).find(d => d.name === name);
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
      content = governmentConfig.generateContent(name);
    }

    wx.setStorageSync('newspaperTemplate', {
      name,
      content,
      businessType: '政府送达',
      category: cat.name,
      _timestamp: Date.now()
    });
    wx.setStorageSync('formPageNavData', {
      type: '政府送达',
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
