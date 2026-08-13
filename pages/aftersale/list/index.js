const api = require('../../../utils/api.js');

Page({
  data: {
    records: [],
    loading: false,
    // 7=售后中 待处理  8=退款中 处理中  9=已完成
    statusText: { 7: '待处理', 8: '退款中', 9: '已完成', rejected: '已拒绝', cancelled: '已撤销' },
    categoryText: {
      quality: '质量问题',
      missing: '漏刻/缺失',
      wrong: '信息错误',
      receipt: '补开收据',
      other: '其他'
    }
  },

  onShow() {
    this.loadRecords();
  },

  loadRecords() {
    this.setData({ loading: true });
    api.getUserAfterSales({ page: 1, pageSize: 50 }).then(res => {
      const list = res.list || res.rows || [];
      this.setData({ records: list, loading: false });
    }).catch(() => {
      this.setData({ loading: false });
    });
  },

  goApply() {
    wx.navigateTo({ url: '/pages/aftersale/apply/index' });
  },

  viewDetail(e) {
    const record = e.currentTarget.dataset.record;
    if (!record) return;
    wx.setStorageSync('aftersaleCurrent', record);
    wx.navigateTo({ url: '/pages/aftersale/detail/index?id=' + record.id });
  },

  goBack() {
    wx.navigateBack();
  },
});
