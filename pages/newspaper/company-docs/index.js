// pages/newspaper/company-docs/index.js
const common = require('../../../utils/common.js');
const companyDocsConfig = require('../../../utils/company-docs.js');
const api = require('../../../utils/api.js');

// API 返回的模板按 templateType 分组
// fallback：使用 company-docs.js 的 categories
let categoriesFromApi = null

Page({
  data: {
    showDocPicker: false,
    selectedCategory: '',
    pickedIndex: 0,
    pickedItems: [],
    searchKey: '',
    categoryList: companyDocsConfig.categories.map((cat, index) => ({
      ...cat,
      color: ['#5B6FE8', '#6474E9', '#6D78EB', '#767DEC', '#7F81ED', '#8886EF',
              '#918AF0', '#9A8FF1', '#A393F3', '#AC98F4', '#B59CF5', '#B49CF7'][index % 12],
    })),
    loading: false,
  },

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
      const res = await api.getCompanyDocTemplates();
      if (Array.isArray(res) && res.length > 0) {
        categoriesFromApi = res;
        this.setData({ categoryList: res, loading: false });
      }
    } catch (e) {
      console.warn('[company-docs] API 调用失败，使用前端硬编码兜底', e);
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

    // API 有 content 则直接用，否则本地规则生成
    const content = (item.content && item.content.trim())
      ? item.content
      : companyDocsConfig.generateContent(item.name, cat.name);

    wx.setStorageSync('newspaperTemplate', {
      name: item.name,
      content: content,
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

    this.setData({ showDocPicker: false }, () => {
      wx.navigateTo({ url: '/pages/newspaper/content-edit/index' });
    });
  },

  onFloatTouchStart(e) { common.startDrag(this, e); },
  onFloatTouchMove(e) { common.moveDrag(this, e); },
  onFloatTouchEnd() { this._floatDragStart = null; },
  contactService() {
    if (this._floatMoved) return;
    wx.makePhoneCall({ phoneNumber: '4000049919' });
  },
});
