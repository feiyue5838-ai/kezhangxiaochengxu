const common = require('../../utils/common.js');

Page({
  data: {
    statusBarHeight: 0,
    features: [
      { id: 1, name: '电子印章', icon: '/assets/icons/icon-b64-17.svg' },
      { id: 2, name: '登报公告', icon: '/assets/icons/icon-b64-7.svg'  },
      { id: 3, name: '证件办理', icon: '/assets/icons/icon-b64-22.svg' },
      { id: 4, name: '发票管理', icon: '/assets/icons/icon-b64-18.svg' },
      { id: 5, name: '订单管理', icon: '/assets/icons/icon-b64-13.svg' },
      { id: 6, name: '7×24客服', icon: '/assets/icons/icon-b64-21.svg' },
    ],
  },

  onLoad() {
    const { statusBarHeight } = common.getNavigationHeight();
    this.setData({ statusBarHeight });
  },

  onCopyWechat() {
    wx.setClipboardData({
      data: '蓉城企服',
      success: () => { wx.showToast({ title: '微信公众号已复制', icon: 'none' }); },
    });
  },

  onBack() {
    wx.navigateBack();
  },
});
