// pages/bookkeeping/order-confirm/index.js
const api = require('../../../utils/api.js');
const common = require('../../../utils/common.js');

Page({
  data: {
    // 从上个页面传来的参数
    taxpayerType: 'small',
    cycle: 'year',
    invoice: 'none',
    social: 'none',
    fund: 'none',
    phone: '',
    price: '0',

    // 展示用文案
    serviceName: '小规模纳税人代理记账',
    cycleName: '全年',
    invoiceName: '不开票',
    socialName: '不缴社保',
    fundName: '不开户',

    submitting: false,
  },

  onLoad(options) {
    const { taxpayerType, cycle, invoice, social, fund, phone, price } = options;

    this.setData({
      taxpayerType,
      cycle,
      invoice,
      social,
      fund,
      phone,
      price,
      // 映射文案
      serviceName: taxpayerType === 'small' ? '小规模纳税人代理记账' : '一般纳税人代理记账',
      cycleName: this._mapCycle(cycle),
      invoiceName: this._mapInvoice(invoice),
      socialName: social === 'with' ? '缴社保' : '不缴社保',
      fundName: taxpayerType === 'general' ? (fund === 'with' ? '开户' : '不开户') : '',
    });
  },

  _mapCycle(cycle) {
    const map = { year: '全年', half: '半年', preorder: '9.9 预定' };
    return map[cycle] || cycle;
  },

  _mapInvoice(invoice) {
    const map = { none: '不开票', within5: '5 张内', normal: '正常开票' };
    return map[invoice] || invoice;
  },

  goBack() {
    wx.navigateBack({ delta: 1 });
  },

  // 提交订单
  async onSubmitOrder() {
    if (this.data.submitting) return;
    this.setData({ submitting: true });

    try {
      // 1. 创建订单
      const order = await api.createBookkeepingOrder({
        taxpayerType: this.data.taxpayerType,
        cycle: this.data.cycle,
        invoice: this.data.invoice,
        social: this.data.social,
        fund: this.data.fund,
        phone: this.data.phone,
        price: this.data.price,
      });

      const orderId = order.id || order.orderId;
      this.setData({ orderId });

      // 2. 获取支付参数
      const openid = wx.getStorageSync('openid') || '';
      const payRes = await api.getBookkeepingPayParams(orderId, openid);

      // 3. 发起微信支付
      await this._wxPay(payRes);

    } catch (e) {
      console.error('提交订单失败:', e);
      wx.showToast({ title: e.message || '提交失败', icon: 'none' });
    } finally {
      this.setData({ submitting: false });
    }
  },

  _wxPay(payRes) {
    return new Promise((resolve, reject) => {
      // 只提取微信支付需要的字段，避免展开多余字段
      const { timeStamp, nonceStr, package: pkg, signType, paySign } = payRes || {};
      wx.requestPayment({
        timeStamp,
        nonceStr,
        'package': pkg,
        signType,
        paySign,
        success: () => {
          wx.showToast({ title: '支付成功', icon: 'success' });
          const orderId = this.data.orderId;
          setTimeout(() => {
            wx.redirectTo({ url: '/pages/bookkeeping/order-detail/index?id=' + orderId });
          }, 1500);
          resolve();
        },
        fail: (err) => {
          if (err.errMsg === 'requestPayment:fail cancel') {
            wx.showToast({ title: '已取消支付', icon: 'none' });
          } else {
            wx.showToast({ title: '支付失败', icon: 'none' });
          }
          reject(new Error(err.errMsg));
        }
      });
    });
  }
});
