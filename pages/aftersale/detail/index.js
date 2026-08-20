const api = require('../../../utils/api.js');

Page({
  data: {
    record: {},
    loading: false,
    // 订单状态（与后端 OrderStatus 一致）：5=已完成(售后被拒) 7=售后中 8=退款中 9=已退款
    statusText: { 5: '已完成', 7: '售后中', 8: '退款中', 9: '已退款' },
    statusIcon: { 5: '✅', 7: '⏳', 8: '🔄', 9: '✅' },
    categoryText: {
      quality: '质量问题',
      missing: '漏刻/缺失',
      wrong: '信息错误',
      receipt: '补开收据',
      other: '其他'
    }
  },

  onLoad(opt) {
    if (opt.id) {
      this.setData({ loading: true });
      api.getAfterSalesDetail(opt.id).then(res => {
        const record = this.parseRecord(res.data || res);
        this.setData({ record, loading: false });
      }).catch(() => {
        this.setData({ loading: false });
      });
    } else {
      const raw = wx.getStorageSync('aftersaleCurrent') || {};
      const record = this.parseRecord(raw);
      this.setData({ record });
    }
  },

  parseRecord(raw) {
    const status = Number(raw.status) || 7;
    // currentStep: 0=已提交, 1=处理中, 2=完成（已退款/售后被拒后已完成）
    const finished = status === 9 || status === 5;
    const currentStep = finished ? 2 : (status >= 8 ? 1 : 0);

    // 解析 remark
    let reason = '', category = '', images = [];
    try {
      const rem = typeof raw.remark === 'string' ? JSON.parse(raw.remark) : (raw.remark || {});
      reason = rem.afterSales?.reason || rem.reason || '';
      category = rem.afterSales?.category || rem.category || '';
      images = rem.afterSales?.images || rem.images || [];
    } catch { /* ignore */ }

    const now = raw.createdAt
      ? raw.createdAt.replace('T', ' ').slice(0, 16)
      : (raw.createTime || '');

    const timeline = [
      { time: now, title: '已提交', desc: '您的退款/售后申请已提交' },
      { time: (!finished && status >= 7) ? now : '', title: '处理中', desc: '客服正在核实处理中' },
      { time: finished ? now : '', title: status === 9 ? '已退款' : '已完成', desc: '' },
    ];

    return {
      ...raw,
      reason,
      category,
      images,
      currentStep,
      timeline,
      phone: raw.phone || '',
    };
  },

  previewImage(e) {
    const src = e.currentTarget.dataset.src;
    wx.previewImage({ current: src, urls: this.data.record.images || [src] });
  },

  cancelApply() {
    const recordId = this.data.record && this.data.record.id;
    if (!recordId) {
      wx.showToast({ title: '缺少售后记录ID，无法撤销', icon: 'none' });
      return;
    }
    wx.showModal({
      title: '确认撤销',
      content: '确定要撤销此退款/售后申请吗？撤销后将无法恢复。',
      confirmColor: '#5B6FE8',
      success: (res) => {
        if (!res.confirm) return;
        wx.showLoading({ title: '撤销中...' });
        // 修复 S4：调用真实后端接口 POST /api/after-sales/user/:id/cancel
        api.cancelAfterSales(recordId).then(() => {
          wx.hideLoading();
          wx.showToast({ title: '已撤销', icon: 'success' });
          // 同步清理本地缓存，返回列表页（onShow 会自动刷新）
          wx.removeStorageSync('aftersaleCurrent');
          setTimeout(() => wx.navigateBack(), 1200);
        }).catch(() => {
          wx.hideLoading();
          // request 封装已统一弹错误 toast，这里兜底处理
        });
      }
    });
  },

  goBack() {
    wx.navigateBack();
  },
});
