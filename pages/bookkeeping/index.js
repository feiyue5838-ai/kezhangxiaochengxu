const common = require('../../utils/common.js');
Page({
  data: {
    services: [
      { id: 1, name: '代理记账', desc: '专业会计团队 · 智能做账报税', iconSvg: '/assets/icons/icon-wallet.svg', bgColor: '#E6F7FF' },
      { id: 2, name: '企业工商年报', desc: '年报公示 · 工商异常处理', iconSvg: '/assets/icons/icon-doc.svg', bgColor: '#F0FFF0' },
      { id: 3, name: '税务筹划', desc: '合理节税方案 · 税务风险诊断', iconSvg: '/assets/icons/icon-chart.svg', bgColor: '#FFF7E6' },
      { id: 4, name: '财务咨询', desc: '财务制度搭建 · 内部审计辅导', iconSvg: '/assets/icons/icon-clipboard.svg', bgColor: '#F0F0FF' }
    ]
  },
  onLoad() {},
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 });
    }
  },
  selectService(e) {
    const id = e.currentTarget.dataset.id;
    if (id === 1) {
      // 代理记账 - 跳转到下单页
      wx.navigateTo({ url: '/pages/bookkeeping/form/index' });
    } else {
      wx.showToast({ title: '功能开发中', icon: 'none' });
    }
  }
});
