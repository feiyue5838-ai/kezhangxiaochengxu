// pages/seal/review-submit/index.js
Page({
  data: {
    serviceScore: 0,
    qualityScore: 0,
    reviewText: ''
  },

  onServiceStarTap(e) {
    const score = Number(e.currentTarget.dataset.score);
    this.setData({ serviceScore: score });
  },

  onQualityStarTap(e) {
    const score = Number(e.currentTarget.dataset.score);
    this.setData({ qualityScore: score });
  },

  onTextInput(e) {
    this.setData({ reviewText: e.detail.value });
  },

  onSubmit() {
    const { serviceScore, qualityScore, reviewText } = this.data;
    if (serviceScore === 0) {
      wx.showToast({ title: '请为服务态度评分', icon: 'none' });
      return;
    }
    if (qualityScore === 0) {
      wx.showToast({ title: '请为刻章质量评分', icon: 'none' });
      return;
    }
    wx.showToast({ title: '评价提交成功！', icon: 'success' });
    setTimeout(() => {
      wx.navigateBack();
    }, 1500);
  }
});
