const common = require('../../utils/common.js');
Page({
  data: {},
  onLoad() {},
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 });
    }
  },
  goForm() {
    wx.navigateTo({ url: '/pages/bookkeeping/form/index' });
  }
});
