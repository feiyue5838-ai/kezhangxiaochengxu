const common = require('../../utils/common.js');

Page({
  data: {
    statusBarHeight: 0,
  },

  onLoad() {
    const { statusBarHeight } = common.getNavigationHeight();
    this.setData({ statusBarHeight });
  },

  onBack() {
    wx.navigateBack();
  },
});
