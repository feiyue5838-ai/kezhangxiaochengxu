// pages/seal/order-detail/index.js
const api = require('../../../utils/api.js');

// Prisma 数字 status → 字符串 status + 样式 class
const statusMap = {
  1: { status: 'pending',    statusText: '待支付', statusClass: 'pending' },
  2: { status: 'processing', statusText: '已支付', statusClass: 'processing' },
  3: { status: 'processing', statusText: '制作中', statusClass: 'processing' },
  4: { status: 'completed',  statusText: '已发货', statusClass: 'completed' },
  5: { status: 'completed',  statusText: '已完成', statusClass: 'completed' },
  6: { status: 'cancelled',  statusText: '已取消', statusClass: 'cancelled' },
  7: { status: 'cancelled',  statusText: '退款中', statusClass: 'cancelled' },
  8: { status: 'cancelled',  statusText: '已退款', statusClass: 'cancelled' },
};

Page({
  data: {
    order: null,
    address: null,
    loading: true,
    isSubmitting: false,
    receipts: [],
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
    var that = this;
    this.setData({ loading: true });

    // 优先从后端 API 拉取真实订单数据
    api.getSealOrderDetail(id).then(function(order) {
      if (!order) { that._showNotFound(); return; }

      // 解析邮寄地址（后端存储为 JSON 字符串）
      var address = null;
      if (order.addressJson) {
        try { address = typeof order.addressJson === 'string' ? JSON.parse(order.addressJson) : order.addressJson; } catch(e) {}
      }

      // 印章名称：从 orderItems 拼接；无则用 companyName
      var desc = '';
      if (order.orderItems && order.orderItems.length > 0) {
        desc = order.orderItems
          .map(function(item) { return (item.seal && item.seal.name) || (item.package && item.package.name) || ''; })
          .filter(Boolean).join('、');
      }
      if (!desc) desc = order.companyName || '';

      // 状态映射
      var mapped = statusMap[order.status] || statusMap[1];

      var normalized = {
        id: order.id,
        module: 'seal',
        type: order.type === 'personal' ? '个人印章' : order.type === 'electronic' ? '电子印章' : '在线刻章',
        desc: desc,
        date: order.createdAt ? order.createdAt.split('T')[0] : '',
        createTime: order.createdAt ? order.createdAt.replace('T', ' ').substring(0, 16) : '',
        status: mapped.status,
        statusText: order.statusText || mapped.statusText,
        statusClass: mapped.statusClass,
        price: Number(order.totalPrice) || 0,
        url: '/pages/seal/order-confirm/index?id=' + order.id,
        // 原始数据供其他方法使用
        _raw: order,
        _address: address
      };

      that.setData({ order: normalized, address: address, loading: false });
      that.loadReceipts(id);
    }).catch(function() {
      // API 失败：从 Storage 兜底
      that._loadFromStorage(id);
    });
  },

  // Storage 兜底（历史本地单）
  _loadFromStorage: function(id) {
    var that = this;
    try {
      var orders = wx.getStorageSync('seal_orders') || [];
      var found = null;
      for (var i = 0; i < orders.length; i++) {
        if (orders[i].id == id) { found = orders[i]; break; }
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
            found.statusClass = 'cancelled';
            found.statusText = '已退款';
          }
        } else {
          found.statusIconSvg = '/assets/icons/icon-order-doc.svg';
        }
        var address = wx.getStorageSync('deliveryAddress') || null;
        if (address && !address.province) address = null;
        that.setData({ order: found, address: address, loading: false });
      } else {
        that._showNotFound();
      }
    } catch (e) {
      that._showNotFound();
    }
  },

  _showNotFound: function() {
    this.setData({ loading: false });
    wx.showToast({ title: '订单不存在', icon: 'none' });
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
    var id = this.data.order.id;
    var app = getApp();
    var openid = (app && app.globalData && app.globalData.openid) || '';
    wx.showLoading({ title: '发起支付' });
    api.getSealPayParams(id, openid).then(function(payRes) {
      var pay = payRes || {};
      var type = pay.type;
      var payment = pay.payment;
      wx.hideLoading();

      if (type === 'wechat' && payment) {
        wx.requestPayment({
          timeStamp: payment.timeStamp,
          nonceStr: payment.nonceStr,
          package: payment.package,
          signType: payment.signType || 'RSA',
          paySign: payment.paySign,
          success: function() { that._pollPaid(id); },
          fail: function(err) {
            that.setData({ isSubmitting: false });
            if (err && err.errMsg && err.errMsg.indexOf('cancel') >= 0) {
              wx.showToast({ title: '已取消支付', icon: 'none' });
            } else {
              wx.showToast({ title: '支付失败，请重试', icon: 'none' });
            }
          }
        });
      } else if (type === 'dev') {
        api.devConfirmPay(id).then(function() { that._afterPay(id); }).catch(function() {
          wx.hideLoading();
          that.setData({ isSubmitting: false });
          wx.showToast({ title: '支付处理失败', icon: 'none' });
        });
      } else {
        that._afterPay(id);
      }
    }).catch(function() {
      wx.hideLoading();
      that.setData({ isSubmitting: false });
      wx.showToast({ title: '获取支付参数失败', icon: 'none' });
    });
  },

  _afterPay: function(id) {
    this.setData({ isSubmitting: false });
    wx.showToast({ title: '支付成功', icon: 'success' });
    this.loadOrder(id);
  },

  _pollPaid: function(id) {
    var that = this;
    var tries = 0;
    var poll = function() {
      api.getSealOrderDetail(id).then(function(detail) {
        if (detail && detail.status >= 2) { that._afterPay(id); return; }
        throw new Error('pending');
      }).catch(function() {
        if (tries++ < 4) {
          setTimeout(poll, 800);
        } else {
          that._afterPay(id);
        }
      });
    };
    poll();
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
  },

  // 写评价
  goWriteReview: function() {
    var orderId = this.data.order.id;
    if (!orderId) {
      wx.showToast({ title: '订单信息错误', icon: 'none' });
      return;
    }
    wx.navigateTo({ url: '/pages/seal/review-submit/index?orderId=' + orderId });
  },

  // 加载回执列表
  loadReceipts: function(orderId) {
    var that = this;
    api.getOrderReceipts(orderId).then(function(res) {
      var receipts = [];
      if (Array.isArray(res)) receipts = res;
      else if (res && Array.isArray(res.list)) receipts = res.list;
      else if (res && res.data && Array.isArray(res.data.list)) receipts = res.data.list;
      that.setData({ receipts: receipts });
    }).catch(function(e) {
      console.error('loadReceipts error', e);
    });
  },

  // 预览回执图片
  previewReceipt: function(e) {
    var url = e.currentTarget.dataset.url;
    wx.previewImage({ urls: [url], current: url });
  }
});
