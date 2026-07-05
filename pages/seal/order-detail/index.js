// pages/seal/order-detail/index.js
Page({
  data: {
    order: null,
    address: null,
    loading: true,
    isSubmitting: false
  },

  onLoad: function(options) {
    if (options.id) {
      this.loadOrder(options.id);
    } else {
      this.setData({ loading: false });
    }
  },

  goBack: function() {
    wx.navigateBack({ delta: 1 });
  },

  loadOrder: function(id) {
    try {
      var orders = wx.getStorageSync('seal_orders') || [];
      var found = null;
      for (var i = 0; i < orders.length; i++) {
        if (orders[i].id === id) {
          found = orders[i];
          break;
        }
      }
      if (found) {
        // 设置状态图标
        if (found.statusClass === 'completed') {
          found.statusIconSvg = '/assets/icons/icon-order-check.svg';
        } else if (found.statusClass === 'processing') {
          found.statusIconSvg = '/assets/icons/icon-order-hourglass.svg';
        } else if (found.statusClass === 'cancelled' || found.statusClass === 'refunded') {
          found.statusIconSvg = '/assets/icons/icon-order-cancelled.svg';
          if (found.statusClass === 'refunded') {
            found.statusClass = 'refund';
            found.statusText = '已退款';
          }
        } else {
          found.statusIconSvg = '/assets/icons/icon-order-doc.svg';
        }
        this.setData({ order: found, loading: false });

        // 读取邮寄地址
        var address = wx.getStorageSync('deliveryAddress');
        if (address && address.province) {
          this.setData({ address: address });
        }
      } else {
        this.setData({ loading: false });
        wx.showToast({ title: '订单不存在', icon: 'none' });
      }
    } catch (e) {
      this.setData({ loading: false });
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
      var orders = wx.getStorageSync('seal_orders') || [];
      var orderId = this.data.order.id;
      var found = false;
      for (var i = 0; i < orders.length; i++) {
        if (orders[i].id === orderId) {
          orders[i].status = status;
          orders[i].statusText = statusText;
          orders[i].statusClass = statusClass;
          found = true;
          break;
        }
      }
      if (found) {
        wx.setStorageSync('seal_orders', orders);
        this.setData({
          'order.status': status,
          'order.statusText': statusText,
          'order.statusClass': statusClass
        });
      }
    } catch (e) {
      // 更新失败静默处理
    }
  },

  // 申请售后
  onApplyAftersale: function() {
    var order = this.data.order;
    if (order) {
      wx.setStorageSync('aftersaleCurrent', order);
    }
    wx.navigateTo({ url: '/pages/aftersale/apply/index?orderId=' + order.id });
  },

  // 删除订单
  onDeleteOrder: function() {
    var that = this;
    wx.showModal({
      title: '删除订单',
      content: '确定删除此订单？删除后不可恢复',
      confirmColor: '#FF4D4F',
      success: function(res) {
        if (res.confirm) {
          try {
            var orders = wx.getStorageSync('seal_orders') || [];
            var filtered = orders.filter(function(o) { return o.id !== that.data.order.id; });
            wx.setStorageSync('seal_orders', filtered);
            wx.showToast({ title: '已删除', icon: 'success' });
            setTimeout(function() { wx.navigateBack(); }, 1500);
          } catch (e) {
            wx.showToast({ title: '删除失败', icon: 'none' });
          }
        }
      }
    });
  }
});
