// pages/newspaper/order-detail.js
// 订单详情页 - 从本地存储读取订单详情
var common = require('../../../utils/common.js');

Page({
  data: {
    order: null,
    isSubmitting: false,


  onLoad: function(options) {
    if (options.id) {
      this.loadOrder(options.id);
    }
  },

  goBack: function() {
    wx.navigateBack({ delta: 1 });
  },

  loadOrder: function(id) {
    try {
      var orders = wx.getStorageSync('newspaper_orders') || [];
      var found = orders.find(function(o) { return o.id === id; });
      if (found) {
        found.statusIconSvg = found.statusClass === 'completed'
          ? '/assets/icons/icon-order-check.svg'
          : found.statusClass === 'processing'
            ? '/assets/icons/icon-order-hourglass.svg'
            : '/assets/icons/icon-order-doc.svg';
        this.setData({ order: found });
      } else {
        wx.showToast({ title: '订单不存在', icon: 'none' });
        setTimeout(function() { wx.navigateBack(); }, 1500);
      }
    } catch (e) {
      wx.showToast({ title: '读取失败', icon: 'none' });
    }
  },

  cancelOrder: function() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定取消此订单吗？',
      success: function(res) {
        if (res.confirm) {
          that.updateOrderStatus('cancelled', '已取消', 'cancelled');
          wx.showToast({ title: '已取消', icon: 'success' });
          setTimeout(function() { wx.navigateBack(); }, 1500);
        }
      }
    });
  },

  payOrder: function() {
    if (this.data.isSubmitting) {
      wx.showToast({ title: '请求处理中，请稍候', icon: 'none' });
      return;
    }
    this.setData({ isSubmitting: true });
    var that = this;
    wx.showModal({
      title: '模拟支付',
      content: '这是模拟支付（实际需接入微信支付）',
      success: function(res) {
        if (res.confirm) {
          that.updateOrderStatus('processing', '进行中', 'processing');
          wx.showToast({ title: '支付成功', icon: 'success' });
          that.setData({ isSubmitting: false });
        } else {
          that.setData({ isSubmitting: false });
        }
      }
    });
  },

  completeOrder: function() {
    var that = this;
    wx.showModal({
      title: '确认完成',
      content: '确认订单已完成？',
      success: function(res) {
        if (res.confirm) {
          that.updateOrderStatus('completed', '已完成', 'completed');
          wx.showToast({ title: '订单已完成', icon: 'success' });
        }
      }
    });
  },

  updateOrderStatus: function(status, statusText, statusClass) {
    try {
      var orders = wx.getStorageSync('newspaper_orders') || [];
      var index = orders.findIndex(function(o) { return o.id === this.data.order.id; }.bind(this));
      if (index > -1) {
        orders[index].status = status;
        orders[index].statusText = statusText;
        orders[index].statusClass = statusClass;
        wx.setStorageSync('newspaper_orders', orders);
        this.setData({
          'order.status': status,
          'order.statusText': statusText,
          'order.statusClass': statusClass
        });
      }
    } catch (e) {
      // 更新失败静默处理
    }
  }
});
