// pages/newspaper/index.js
const common = require('../../utils/common.js');
const catConfig = require('../../utils/categories.js');

Page({
  data: {
    statusBarHeight: 20,
    navHeight: 64,
    categories: catConfig.list
  },

  onLoad() {
    const statusBarHeight = common.getNavigationHeight().statusBarHeight;
    const navHeight = statusBarHeight + 64;
    this.setData({ statusBarHeight, navHeight });
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