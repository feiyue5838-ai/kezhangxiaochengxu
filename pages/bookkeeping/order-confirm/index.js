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

  // B-02/B-06: 价格由后端计算，手机号通过 Storage 传递（不暴露在 URL）
  onLoad(options) {
    // 未登录先跳登录页
    if (!wx.getStorageSync('token')) {
      wx.navigateTo({ url: '/pages/auth/index' });
      return;
    }

    const { taxpayerType, cycle, invoice, social, fund } = options;
    // B-06: 手机号从 Storage 读取，不通过 URL 传递
    const phone = wx.getStorageSync('bookkeepingPhone') || options.phone || '';

    // B-02: 从后端重新获取价格
    this.setData({
      taxpayerType,
      cycle,
      invoice,
      social,
      fund,
      phone,
      price: '--',
      // 映射文案
      serviceName: taxpayerType === 'small' ? '小规模纳税人代理记账' : '一般纳税人代理记账',
      cycleName: this._mapCycle(cycle),
      invoiceName: this._mapInvoice(invoice),
      socialName: social === 'with' ? '缴社保' : '不缴社保',
      fundName: taxpayerType === 'general' ? (fund === 'with' ? '开户' : '不开户') : '',
    });

    // B-02: 重新获取价格
    this._fetchPrice();
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

  // B-02: 重新获取价格
  async _fetchPrice() {
    try {
      const res = await api.getBookkeepingPrice({
        taxpayerType: this.data.taxpayerType,
        cycle: this.data.cycle,
        invoice: this.data.invoice,
        social: this.data.social,
        fund: this.data.fund,
      });
      const price = Number(res.price || res.amount || 0);
      if (price > 0) {
        this.setData({ price: price.toFixed(2) });
      } else {
        // B-04: 价格获取失败时提示用户
        wx.showToast({ title: '该组合暂不支持，请调整选项', icon: 'none' });
      }
    } catch (e) {
      // B-04: 价格获取失败时提示用户
      console.error('获取价格失败:', e);
      wx.showToast({ title: '价格获取失败，请重试', icon: 'none' });
    }
  },

  // 提交订单
  async onSubmitOrder() {
    if (this.data.submitting) return;
    this.setData({ submitting: true });

    try {
      // B-02: 价格由后端计算，不传前端价格
      const order = await api.createBookkeepingOrder({
        taxpayerType: this.data.taxpayerType,
        cycle: this.data.cycle,
        invoice: this.data.invoice,
        social: this.data.social,
        fund: this.data.fund,
        phone: this.data.phone,
        // price: this.data.price, // B-02: 不传价格
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
      // payRes 结构：{ type, payment: { timeStamp, nonceStr, package, signType, paySign } }
      const type = (payRes && payRes.type) || '';
      const payment = (payRes && payRes.payment) ? payRes.payment : null;

      if (type === 'dev') {
        // 开发模式：服务端模拟微信回调
        const orderId = this.data.orderId;
        api.devConfirmPay(orderId).then(() => {
          // B-07: 支付成功后不解锁 submitting
          wx.showToast({ title: '支付成功', icon: 'success' });
          setTimeout(() => { wx.redirectTo({ url: '/pages/bookkeeping/order-detail/index?id=' + orderId }); }, 1500);
          resolve();
        }).catch((e) => {
          console.error('devConfirmPay error:', e);
          this.setData({ submitting: false });
          wx.showToast({ title: '支付处理失败', icon: 'none' });
          reject(new Error('devConfirmPay failed'));
        });
        return;
      }

      // B-03: 增加 free 分支
      if (type === 'free') {
        const orderId = this.data.orderId;
        // B-07: 支付成功后不解锁 submitting
        wx.showToast({ title: '支付成功', icon: 'success' });
        setTimeout(() => { wx.redirectTo({ url: '/pages/bookkeeping/order-detail/index?id=' + orderId }); }, 1500);
        resolve();
        return;
      }

      if (type !== 'wechat' || !payment) {
        console.error('[Bookkeeping] 支付参数异常：type=' + type + ', payment=' + JSON.stringify(payment));
        this.setData({ submitting: false });
        wx.showToast({ title: '支付参数异常，请重试', icon: 'none' });
        reject(new Error('invalid pay params'));
        return;
      }

      // 正式微信支付
      wx.requestPayment({
        timeStamp: payment.timeStamp,
        nonceStr: payment.nonceStr,
        package: payment.package,
        signType: payment.signType || 'RSA',
        paySign: payment.paySign,
        success: () => {
          // B-07: 支付成功后不解锁 submitting
          wx.showToast({ title: '支付成功', icon: 'success' });
          const orderId = this.data.orderId;
          setTimeout(() => {
            wx.redirectTo({ url: '/pages/bookkeeping/order-detail/index?id=' + orderId });
          }, 1500);
          resolve();
        },
        fail: (err) => {
          this.setData({ submitting: false });
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
