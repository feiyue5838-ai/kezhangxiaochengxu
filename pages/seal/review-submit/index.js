// pages/seal/review-submit/index.js
Page({
  data: {
    serviceScore: 0,
    qualityScore: 0,
    reviewText: '',
    submitting: false
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

  onSubmit() {
    if (this.data.submitting) return;
    const { serviceScore, qualityScore, reviewText } = this.data;
    const trimmed = reviewText.trim();

    if (serviceScore === 0) {
      wx.showToast({ title: '请为服务态度评分', icon: 'none' });
      return;
    }
    if (qualityScore === 0) {
      wx.showToast({ title: '请为刻章质量评分', icon: 'none' });
      return;
    }

    this.setData({ submitting: true });

    // TODO: 接入真实 API 替换这里的模拟提交
    setTimeout(() => {
      wx.showToast({ title: '评价提交成功！', icon: 'success' });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }, 800);
  }
});
