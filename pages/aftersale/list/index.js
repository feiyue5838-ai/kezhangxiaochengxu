const api = require('../../../utils/api.js');

Page({
  data: {
    records: [],
    loading: false,
    // 7=待处理  8=退款中  9=已完成
    statusText: { 7: '待处理', 8: '退款中', 9: '已完成' },
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
      const rows = res.rows || [];
      // 解析 remark
      const records = rows.map(r => {
        let category = '', reason = '', images = [];
        try {
          const rem = typeof r.remark === 'string' ? JSON.parse(r.remark) : (r.remark || {});
          category = rem.afterSales?.category || rem.category || '';
          reason = rem.afterSales?.reason || rem.reason || '';
          images = rem.afterSales?.images || rem.images || [];
        } catch { /* ignore */ }
        return { ...r, reason, category, images };
      });
      this.setData({ records, loading: false });
    }).catch(() => {
      this.setData({ loading: false });
    });
  },

  viewDetail(e) {
    const record = e.currentTarget.dataset.record;
    if (!record) return;
    wx.navigateTo({ url: '/pages/aftersale/detail/index?id=' + record.id });
  },

  goApply() {
    wx.navigateTo({ url: '/pages/aftersale/apply/index' });
  },

  goBack() {
    wx.navigateBack();
  },
});
