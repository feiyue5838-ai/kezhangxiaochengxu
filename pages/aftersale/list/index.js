const common = require('../../../utils/common.js');

Page({
  data: {
    statusBarHeight: 0,
    navHeight: 0,
    records: [],
    statusText: {
      pending: '待处理',
      processing: '处理中',
      completed: '已完成',
      rejected: '已拒绝',
      cancelled: '已撤销'
    },
    categoryText: {
      quality: '质量问题',
      missing: '漏刻/缺失',
      wrong: '信息错误',
      receipt: '补开收据',
      other: '其他'
    }
  },

  onLoad() {
    const statusBarHeight = common.getNavigationHeight().statusBarHeight;
    const navHeight = statusBarHeight + 64;
    this.setData({ statusBarHeight, navHeight });
  },

  onShow() {
    const records = wx.getStorageSync('aftersale_records') || [];
    this.setData({ records });
  },

  goApply() {
    wx.navigateTo({ url: '/pages/aftersale/apply/index' });
  },

  viewDetail(e) {
    const record = e.currentTarget.dataset.record;
    if (!record) return;
    // 传给详情页：序列化存储再跳转，避免长URL
    wx.setStorageSync('aftersaleCurrent', record);
    wx.navigateTo({ url: '/pages/aftersale/detail/index' });
  },

  goBack() {
    wx.navigateBack();
  },
});
