const api = require('../../../utils/api.js');

Page({
  data: {
    record: {},
    loading: false,
    statusText: { 7: '待处理', 8: '退款中', 9: '已完成' },
    statusIcon: { 7: '⏳', 8: '🔄', 9: '✅' },
    categoryText: {
      quality: '质量问题',
      missing: '漏刻/缺失',
      wrong: '信息错误',
      receipt: '补开收据',
      other: '其他'
    },
    nextIndex: 0,
    reason: '',
    category: '',
    images: []
  },

  onLoad(opt) {
    if (opt.id) {
      this.setData({ loading: true });
      api.getAfterSalesDetail(opt.id).then(res => {
        const record = res.data || res;
        this.setRecord(record);
        this.setData({ loading: false });
      }).catch(() => {
        this.setData({ loading: false });
      });
    } else {
      const record = wx.getStorageSync('aftersaleCurrent') || {};
      this.setRecord(record);
    }
  },

  setRecord(record) {
    const status = Number(record.status) || 7;
    const nextIdx = { 7: 1, 8: 2, 9: 3 }[status] || 1;
    const now = record.createdAt
      ? record.createdAt.replace('T', ' ').slice(0, 16)
      : '';

    // 从 remark 字段解析业务数据
    let reason = '', category = '', images = [];
    try {
      const r = typeof record.remark === 'string'
        ? JSON.parse(record.remark)
        : (record.remark || {});
      reason = r.afterSales?.reason || r.reason || '';
      category = r.afterSales?.category || r.category || '';
      images = r.afterSales?.images || r.images || [];
    } catch { /* ignore */ }

    // timeline 构造（3步：已提交→处理中→完成/拒绝）
    const timeline = [
      { time: now, title: '已提交', desc: '您的售后申请已提交，客服将在1-3个工作日内处理' },
      { time: status >= 8 ? now : '', title: '处理中', desc: '客服正在核实处理中，请耐心等待' },
      { time: status >= 9 ? now : '', title: status === 9 ? '已完成' : '已拒绝', desc: '' },
    ];

    this.setData({
      record: Object.assign({}, record, { timeline }),
      nextIndex: nextIdx - 1,
      reason,
      category,
      images
    });
  },

  previewImage(e) {
    const src = e.currentTarget.dataset.src;
    wx.previewImage({ current: src, urls: this.data.images || [src] });
  },

  goBack() {
    wx.navigateBack();
  },
});
