// pages/license/index.js
const common = require('../../utils/common.js');
Page({
  data: {
    statusBarHeight: 20,
    navHeight: 64,
    services: [
      { id: 1, name: '商标注册申请', iconSvg: '/assets/icons/icon-b64-7.svg', color: '#5B6FE8', bgColor: '#E6F7FF' },
      { id: 2, name: '商标续展', iconSvg: '/assets/icons/icon-b64-8.svg', color: '#2F54EB', bgColor: '#F0F0FF' },
      { id: 3, name: '商标变更', iconSvg: '/assets/icons/icon-b64-9.svg', color: '#FA8C16', bgColor: '#FFF7E6' },
      { id: 4, name: '商标转让', iconSvg: '/assets/icons/icon-b64-10.svg', color: '#52C41A', bgColor: '#F0FFF0' }
    ]
  },

  onLoad() {
    const { statusBarHeight, navHeight } = common.getNavigationHeight();
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
