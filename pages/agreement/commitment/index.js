const api = require('../../../utils/api.js');

Page({
  data: {
    html: '<view class="loading">加载中...</view>',
  },

  onLoad() {
    this.loadContent();
  },

  onShow() {
    // 每次进入都刷新
  },

  loadContent() {
    wx.showLoading({ title: '加载中...' });
    api.getMaterialCommitment().then(res => {
      wx.hideLoading();
      const content = res && res.content ? res.content : '';
      if (content) {
        this.setData({ html: this.formatRich(content) });
      } else {
        this.setData({ html: '<view class="empty">暂无内容</view>' });
      }
    }).catch(() => {
      wx.hideLoading();
      this.setData({ html: '<view class="empty">加载失败</view>' });
    });
  },

  onBack() {
    wx.navigateBack();
  },

  formatRich(html) {
    if (!html) return '';
    return html
      .replace(/<p>/g, '<p class="p">')
      .replace(/<li>/g, '<li class="li">')
      .replace(/<ul>/g, '<ul class="ul">')
      .replace(/<ol>/g, '<ol class="ol">');
  },
});
