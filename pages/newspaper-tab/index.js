// pages/newspaper-tab/index.js
const _common = require('../../utils/common.js');
const catConfig = require('../../utils/categories.js');

Page({
  data: {
    categories: catConfig.list
  },

  onLoad() {
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 });
    }
  },

  goToCategory(e) {
    const id = e.currentTarget.dataset.id;
    const url = catConfig.getRoute(id);
    if (url) {
      wx.navigateTo({ url });
    }
  }
});