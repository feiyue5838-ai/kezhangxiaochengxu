// pages/seal/review-submit/index.js
const api = require('../../utils/api.js');
const { request } = require('../../utils/auth.js');

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

    // 调用后端评价接口（api.js 已配置）
    request({
      url: api.getApi('SEAL.REVIEW'),
      method: 'POST',
      data: {
        serviceScore,
        qualityScore,
        content: trimmed
      },
      success: (res) => {
        this.setData({ submitting: false });
        if (res.code === 0) {
          wx.showToast({ title: '评价提交成功！', icon: 'success' });
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        } else {
          wx.showToast({ title: res.msg || '提交失败', icon: 'none' });
        }
      },
      fail: () => {
        this.setData({ submitting: false });
        wx.showToast({ title: '网络异常', icon: 'none' });
      }
    });
  }
});
