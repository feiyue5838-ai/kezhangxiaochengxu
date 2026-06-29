// pages/newspaper/confession/index.js
const common = require('../../../utils/common.js');
const confessionConfig = require('../../../utils/confession.js');

// 转换为发票收据同构的数据结构：{ name, color, docs: [{ name, icon }] }
const categories = confessionConfig.categories.map(cat => ({
  name: cat.category,
  color: cat.categoryColor,
  docs: cat.templates.map(tpl => ({ name: tpl.name, icon: tpl.icon }))
}));

const totalCount = categories.reduce((s, c) => s + c.docs.length, 0);

Page({
  data: {
    statusBarHeight: 20,
    navHeight: 64,
    totalCount,
    categories,
    // Sheet 状态
    showDocPicker: false,
    pickedIndex: 0,
    pickedItems: [],
    searchKey: ''
  },

  onLoad() {
    this._floatDragStart = null;
    this._floatMoved = false;
    const { statusBarHeight, navHeight } = common.getNavigationHeight();
    this.setData({ statusBarHeight, navHeight });
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 });
    }
  },

  goBack() {
    wx.navigateBack();
  },

  // 打开分类弹窗
  openDocPicker(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      showDocPicker: true,
      pickedIndex: index,
      pickedItems: categories[index].docs,
      searchKey: ''
    });
  },

  // 关闭弹窗
  closeDocPicker() {
    this.setData({ showDocPicker: false, searchKey: '' });
  },

  // 弹窗内搜索
  onSearch(e) {
    const key = (e.detail.value || '').trim();
    const cat = categories[this.data.pickedIndex];
    if (!key) {
      this.setData({ searchKey: '', pickedItems: cat.docs });
      return;
    }
    const filtered = cat.docs.filter(item =>
      item.name.indexOf(key) !== -1
    );
    this.setData({ searchKey: key, pickedItems: filtered });
  },

  // 选择模板
  selectItem(e) {
    const { name } = e.currentTarget.dataset;
    if (!name) return;
    const cat = categories[this.data.pickedIndex];
    const item = (this.data.pickedItems).find(d => d.name === name);
    if (!item) return;
    const content = confessionConfig.generateContent(item.name);

    wx.setStorageSync('newspaperTemplate', {
      name: item.name,
      content,
      businessType: '真情告白',
      category: cat.name,
      _timestamp: Date.now()
    });
    wx.setStorageSync('formPageNavData', {
      type: '真情告白',
      docName: item.name,
      categoryName: cat.name,
      itemName: item.name,
      _timestamp: Date.now()
    });

    this.setData({ showDocPicker: false });
    wx.navigateTo({ url: '/pages/newspaper/content-edit/index' });
  },

  // 浮动按钮拖拽
  onFloatTouchStart(e) {
    this._floatDragStart = e.touches[0].clientY;
    this._floatMoved = false;
  },
  onFloatTouchMove(e) {
    if (!this._floatDragStart) return;
    const dy = e.touches[0].clientY - this._floatDragStart;
    if (Math.abs(dy) > 10) this._floatMoved = true;
    let top = this.data.floatBtnTop + dy;
    top = Math.max(400, Math.min(1200, top));
    this._floatDragStart = e.touches[0].clientY;
    this.setData({ floatBtnTop: top });
  },
  onFloatTouchEnd() {
    this._floatDragStart = null;
  },
  contactService() {
    if (this._floatMoved) return;
    wx.makePhoneCall({ phoneNumber: '4000049919' });
  }
});
