// pages/seal/reviews/index.js
const api = require('../../../utils/api.js');

Page({
  data: {
    reviewList: [],
    loading: true,
    reviewableOrders: []
  },

  onLoad() {
    this.loadReviews();
  },

  onShow() {
    this.loadReviewableOrders();
  },

  goBack() {
    wx.navigateBack({ delta: 1 });
  },

  // 从 API 加载已审核通过的评价列表
  async loadReviews() {
    this.setData({ loading: true });
    try {
      const res = await api.reviewList({ module: 'seal', limit: 50 });
      // 适配后端返回格式
      const list = Array.isArray(res) ? res : (res.items || res.list || []);
      this.setData({
        reviewList: list,
        loading: false
      });
    } catch (_e) {
      console.error('加载评价失败:', _e);
      this.setData({ loading: false });
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  // 获取已完成订单（可评价）
  async loadReviewableOrders() {
    try {
      const res = await api.getSealOrderList({ status: 5 }); // status=5 已完成
      const orders = Array.isArray(res) ? res : (res.items || res.list || []);
      // TODO: 过滤已评价的订单（需要后端返回 hasReviewed 字段）
      this.setData({ reviewableOrders: orders });
    } catch (_e) {
      console.error('加载订单失败:', _e);
      this.setData({ reviewableOrders: [] });
    }
  },

  // 跳转到提交评价页面
  goWriteReview(e) {
    const orderId = e.currentTarget.dataset.id;
    if (orderId) {
      wx.navigateTo({ url: `/pages/seal/review-submit/index?orderId=${orderId}` });
    } else {
      wx.showToast({ title: '请选择订单', icon: 'none' });
    }
  },

  // 我提交的评价（审核状态管理）
  goMyReviews() {
    wx.navigateTo({ url: '/pages/seal/reviews/my/index' });
  }
});
