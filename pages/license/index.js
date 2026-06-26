// pages/license/index.js
const common = require('../../utils/common.js');
Page({
  data: {
    statusBarHeight: 20,
    navHeight: 64,
    services: [
      { id: 1, name: '企业内档', iconSvg: '/assets/icons/icon-b64-7.svg', color: '#5B6FE8', bgColor: '#E6F7FF' },
      { id: 2, name: '工商档案', iconSvg: '/assets/icons/icon-b64-8.svg', color: '#2F54EB', bgColor: '#F0F0FF' },
      { id: 3, name: '税务档案', iconSvg: '/assets/icons/icon-b64-9.svg', color: '#FA8C16', bgColor: '#FFF7E6' },
      { id: 4, name: '社保档案', iconSvg: '/assets/icons/icon-b64-10.svg', color: '#52C41A', bgColor: '#F0FFF0' }
    ]
  },

  onLoad() {
    const statusBarHeight = common.getNavigationHeight().statusBarHeight;
    const navHeight = statusBarHeight + 64;
    this.setData({ statusBarHeight, navHeight });
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 });
    }
  },

  selectService(e) {
    const id = e.currentTarget.dataset.id;
    wx.showToast({ title: '功能开发中', icon: 'none' });
  }
});
