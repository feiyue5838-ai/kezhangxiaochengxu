// pages/webview/index.js
Page({
  data: { url: '' },

  onLoad(options) {
    if (options.url) {
      this.setData({ url: decodeURIComponent(options.url) });
    }
  },

  onMessage(e) {
    // 接收 web-view 内网页通过 postMessage 发来的消息
  },

  onError(e) {
    wx.showToast({ title: '页面加载失败', icon: 'none' });
  }
});
