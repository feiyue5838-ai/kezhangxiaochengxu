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
        taxpayer_type: this.data.taxpayerType,
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
      // ===== V2.0 优先：创建记账订单（返回 orderNo）=====
      const v2dto = {
        packageId: '',
        packageName: this.data.serviceName,
        taxpayerType: this.data.taxpayerType === 'small' ? 'small_scale' : 'general',
        servicePeriod: this.data.cycle,
        startDate: '',
        endDate: '',
        companyName: '',
        businessLicenseNo: '',
        taxAuthority: '',
        accountingScope: '',
        currentPeriod: 1,
        totalAmount: Number(this.data.price) || 0,
        remark: '',
      };
      let orderNo;
      try {
        const v2res = await api.v2CreateBookkeepingOrder(v2dto);
        orderNo = v2res && v2res.orderNo;
        if (!orderNo) throw new Error('V2.0 创建订单无 orderNo');
      } catch (e) {
        // V2.0 失败降级 V1
        const order = await api.createBookkeepingOrder({
          taxpayer_type: this.data.taxpayerType,
          cycle: this.data.cycle,
          invoice: this.data.invoice,
          social: this.data.social,
          fund: this.data.fund,
          phone: this.data.phone,
          price: this.data.price,
        });
        const orderId = order.id || order.orderId;
        this.setData({ orderId });
        return this._wxPayFallback(orderId);
      }

      this.setData({ orderNo });

      // 2. 获取支付参数（V2.0）
      const payRes = await api.v2GetPayParams(orderNo);

      // 3. 发起微信支付
      await this._wxPayV2(payRes, orderNo);

    } catch (e) {
      console.error('提交订单失败:', e);
      wx.showToast({ title: e.message || '提交失败', icon: 'none' });
    } finally {
      this.setData({ submitting: false });
    }
  },

  // V2.0 支付
  _wxPayV2(payRes, orderNo) {
    return new Promise((resolve, reject) => {
      const type = (payRes && payRes.devMode) ? 'dev' : (payRes && payRes.params && payRes.params.package ? 'wechat' : '');
      const payment = (payRes && payRes.params) ? payRes.params : null;

      if (type === 'dev') {
        wx.showToast({ title: '支付成功', icon: 'success' });
        setTimeout(() => { wx.redirectTo({ url: '/pages/bookkeeping/order-detail/index?id=' + orderNo }); }, 1500);
        resolve();
        return;
      }
      if (type !== 'wechat' || !payment) {
        console.error('[Bookkeeping V2] 支付参数异常', payRes);
        wx.showToast({ title: '支付参数异常，请重试', icon: 'none' });
        reject(new Error('invalid pay params'));
        return;
      }
      wx.requestPayment({
        timeStamp: payment.timeStamp,
        nonceStr: payment.nonceStr,
        package: payment.package,
        signType: payment.signType || 'RSA',
        paySign: payment.paySign,
        success: () => {
          wx.showToast({ title: '支付成功', icon: 'success' });
          setTimeout(() => { wx.redirectTo({ url: '/pages/bookkeeping/order-detail/index?id=' + orderNo }); }, 1500);
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
  },

  // V1 支付（降级路径）
  _wxPayFallback(orderId) {
    return new Promise((resolve, reject) => {
      const openid = wx.getStorageSync('openid') || '';
      api.getBookkeepingPayParams(orderId, openid).then(payRes => {
        const type = (payRes && payRes.type) || '';
        const payment = (payRes && payRes.payment) ? payRes.payment : null;
        if (type === 'dev') {
          api.devConfirmPay(orderId).then(() => {
            wx.showToast({ title: '支付成功', icon: 'success' });
            setTimeout(() => { wx.redirectTo({ url: '/pages/bookkeeping/order-detail/index?id=' + orderId }); }, 1500);
            resolve();
          }).catch((e) => { console.error('devConfirmPay error:', e); wx.showToast({ title: '支付处理失败', icon: 'none' }); reject(new Error('devConfirmPay failed')); });
          return;
        }
        if (type === 'free') {
          wx.showToast({ title: '支付成功', icon: 'success' });
          setTimeout(() => { wx.redirectTo({ url: '/pages/bookkeeping/order-detail/index?id=' + orderId }); }, 1500);
          resolve();
          return;
        }
        if (type !== 'wechat' || !payment) {
          wx.showToast({ title: '支付参数异常，请重试', icon: 'none' });
          reject(new Error('invalid pay params'));
          return;
        }
        wx.requestPayment({
          timeStamp: payment.timeStamp, nonceStr: payment.nonceStr, package: payment.package, signType: payment.signType || 'RSA', paySign: payment.paySign,
          success: () => { wx.showToast({ title: '支付成功', icon: 'success' }); setTimeout(() => { wx.redirectTo({ url: '/pages/bookkeeping/order-detail/index?id=' + orderId }); }, 1500); resolve(); },
          fail: (err) => { this.setData({ submitting: false }); if (err.errMsg === 'requestPayment:fail cancel') { wx.showToast({ title: '已取消支付', icon: 'none' }); } else { wx.showToast({ title: '支付失败', icon: 'none' }); } reject(new Error(err.errMsg)); }
        });
      }).catch(e => { console.error('getBookkeepingPayParams error:', e); wx.showToast({ title: '获取支付参数失败', icon: 'none' }); reject(e); });
    });
  },
});