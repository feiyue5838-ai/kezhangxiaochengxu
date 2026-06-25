// pages/seal/reviews/index.js
Page({
  data: {
    reviewList: []
  },
  onLoad() {
    this.loadReviews();
  },
  goWriteReview() {
    wx.navigateTo({ url: '/pages/seal/review-submit/index' });
  },
  loadReviews() {
    // 模拟数据，后续可对接后端API
    this.setData({
      reviewList: [
        { id: 1, maskedPhone: '138****6688', date: '2026-05-20', serviceScore: 5, qualityScore: 5, text: '刻章速度很快，当天就收到了，质量也很好，推荐！' },
        { id: 2, maskedPhone: '159****2231', date: '2026-05-18', serviceScore: 5, qualityScore: 4, text: '客服态度很好，耐心解答了我的问题，刻章也很正规。' },
        { id: 3, maskedPhone: '136****5512', date: '2026-05-15', serviceScore: 5, qualityScore: 5, text: '公司急需刻章，这里当天就办好了，非常满意！' },
        { id: 4, maskedPhone: '186****3309', date: '2026-05-12', serviceScore: 4, qualityScore: 5, text: '印章质量不错，字迹清晰，价格也合理。' },
        { id: 5, maskedPhone: '133****7712', date: '2026-05-10', serviceScore: 5, qualityScore: 5, text: '第二次在这里刻章了，一如既往的好，会继续支持！' }
      ]
    });
  }
});
