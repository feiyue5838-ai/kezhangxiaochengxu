// pages/payment/result/index.js
Page({
  data: {
    status: 'success', // success | failed
    orderId: '',
    amount: 0,
    payTime: '',
    title: '支付成功',
    description: '您的订单已提交成功，我们将尽快为您处理',
    iconUrl: '/assets/icons/icon-success.svg'
  },

  onLoad(options) {
    const { orderId, amount, status, payTime } = options;

    // 根据 status 设置标题和图标
    const isSuccess = status !== 'failed';

    this.setData({
      status: isSuccess ? 'success' : 'failed',
      orderId: orderId || '',
      amount: amount || 0,
      payTime: payTime || this.formatTime(new Date()),
      title: isSuccess ? '支付成功' : '支付失败',
      description: isSuccess 
        ? '您的订单已提交成功，我们将尽快为您处理' 
        : '支付未能完成，请重新尝试或联系客服',
      iconUrl: isSuccess 
        ? '/assets/icons/icon-success.svg' 
        : '/assets/icons/icon-failed.svg'
    });

    // 设置导航栏标题
    wx.setNavigationBarTitle({
      title: isSuccess ? '支付成功' : '支付失败'
    });

    // 支付成功时震动反馈
    if (isSuccess) {
      wx.vibrateShort({ type: 'medium' });
    }
  },

  // 格式化时间
  formatTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  },

  // 查看订单
  viewOrder() {
    const { orderId } = this.data;

    if (orderId) {
      wx.redirectTo({
        url: `/pages/order/detail/index?id=${orderId}`
      });
    } else {
      wx.switchTab({
        url: '/pages/order/list/index'
      });
    }
  },

  // 返回首页
  goHome() {
    wx.switchTab({
      url: '/pages/home/index'
    });
  },

  // 返回上一页（支付失败时）
  retry() {
    wx.navigateBack({ delta: 1 });
  }
});
