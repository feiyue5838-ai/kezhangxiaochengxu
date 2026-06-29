// pages/newspaper/court/index.js
const common = require('../../../utils/common.js');
const courtConfig = require('../../../utils/court.js');

const categories = courtConfig.categories.map(cat => ({
  id: cat.id,
  name: cat.name,
  desc: cat.desc,
  color: cat.color,
  hot: cat.hot,
  items: cat.docs
}));

Page({
  data: {
    statusBarHeight: 20,
    navHeight: 64,
    selectedCategory: '',
    categories,
    pickedIndex: -1,
    pickedItems: [],
    showDocPicker: false,
    searchKey: ''
  },

  onLoad() {
    const { statusBarHeight, navHeight } = common.getNavigationHeight();
    this.setData({ statusBarHeight, navHeight });
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
    const content = courtConfig.generateContent({ name: item.name });
    wx.setStorageSync('newspaperTemplate', {
      name: item.name,
      content,
      businessType: '法院公告',
      category: cat.name,
      _timestamp: Date.now()
    });
    wx.setStorageSync('formPageNavData', {
      type: '法院公告',
      docName: item.name,
      categoryName: cat.name,
      itemName: item.name,
      _timestamp: Date.now()
    });
    this.closeDocPicker();
    setTimeout(() => {
      wx.navigateTo({ url: '/pages/newspaper/content-edit/index' });
    }, 350);
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
    const newTop = Math.max(100, Math.min(this._floatTouch.curTop + dy, wx.getSystemInfoSync().windowHeight - 80));
    this.setData({ floatBtnTop: newTop });
  },
  onFloatTouchEnd() {
    this._floatTouch = null;
  }
});
