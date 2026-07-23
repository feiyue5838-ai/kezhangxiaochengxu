// pages/seal/review-submit/index.js
const api = require('../../../utils/api.js');

Page({
  data: {
    orderId: '',
    orderInfo: null,
    serviceScore: 0,
    qualityScore: 0,
    reviewText: '',
    submitting: false
  },

  onLoad(options) {
    if (options.orderId) {
      this.setData({ orderId: options.orderId });
      this.loadOrderInfo(options.orderId);
    } else {
      wx.showToast({ title: '订单参数错误', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1500);
    }
  },

  // 加载订单信息
  async loadOrderInfo(orderId) {
    try {
      const order = await api.getSealOrderDetail(orderId);
      this.setData({ orderInfo: order });
    } catch (e) {
      console.error('加载订单失败:', e);
    }
  },

  onServiceStarTap(e) {
    if (this.data.submitting) return;
    const score = Number(e.currentTarget.dataset.score);
    this.setData({ serviceScore: score });
  },

  onQualityStarTap(e) {
    if (this.data.submitting) return;
    const score = Number(e.currentTarget.dataset.score);
    this.setData({ qualityScore: score });
  },

  onTextInput(e) {
    this.setData({ reviewText: e.detail.value });
  },

  async onSubmit() {
    if (this.data.submitting) {
      wx.showToast({ title: '正在提交，请勿重复点击', icon: 'none' });
      return;
    }

    const { orderId, serviceScore, qualityScore, reviewText } = this.data;
    const trimmed = reviewText.trim();

    if (!orderId) {
      wx.showToast({ title: '订单信息错误', icon: 'none' });
      return;
    }
    if (serviceScore === 0) {
      wx.showToast({ title: '请为服务态度评分', icon: 'none' });
      return;
    }
    if (qualityScore === 0) {
      wx.showToast({ title: '请为刻章质量评分', icon: 'none' });
      return;
    }
    if (trimmed.length > 0 && trimmed.length < 5) {
      wx.showToast({ title: '评价内容至少5个字', icon: 'none' });
      return;
    }

    this.setData({ submitting: true });

    try {
      await api.submitReview({
        orderId: orderId,
        module: 'seal',
        serviceScore: serviceScore,
        qualityScore: qualityScore,
        content: trimmed
      });

      wx.showToast({ title: '评价提交成功！', icon: 'success' });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    } catch (e) {
      console.error('提交评价失败:', e);
      wx.showToast({ title: e.message || '提交失败', icon: 'none' });
    } finally {
      this.setData({ submitting: false });
    }
  }
});
