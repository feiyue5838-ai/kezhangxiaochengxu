// pages/bookkeeping/order-detail/index.js
const api = require('../../../utils/api.js');

const TAXPAYER_MAP = { small: '小规模纳税人', general: '一般纳税人' };
const CYCLE_MAP = { year: '全年', half: '半年', preorder: '9.9 预定' };
const INVOICE_MAP = { none: '不开票', within5: '5 张内', normal: '正常开票' };

Page({
  data: {
    order: null,
    loading: true,
    submitting: false,
  },

  onLoad(options) {
    const id = options.id || options.orderNo || '';
    if (id) {
      this.loadOrder(id);
    } else {
      this.setData({ loading: false });
      wx.showToast({ title: '订单ID缺失', icon: 'none' });
    }
  },

  goBack() {
    wx.navigateBack({ delta: 1 });
  },

  async loadOrder(id) {
    // V2.0 优先：orderNo 格式（NP/SE/BK 前缀）直接查 V2.0
    const isV2No = /^(NP|SE|BK)\d{10}/.test(String(id));
    if (isV2No) {
      try {
        const o = await api.v2GetOrderDetail(id);
        this.setData({ order: this._mapV2Order(o), loading: false, orderNo: id, isV2: true });
        return;
      } catch (e) {
        console.warn('v2 detail failed, fallback V1:', e);
      }
    }
    try {
      const o = await api.getBookkeepingOrderDetail(id);
      this.setData({ order: this._mapOrder(o), loading: false, orderNo: o.orderNo || id, isV2: false });
    } catch (e) {
      this.setData({ loading: false, order: null });
    }
  },

  // V2.0 详情映射（camelCase 字段）
  _mapV2Order(o) {
    if (!o || !o.order) return null;
    const order = o.order;
    const bk = (o.bookkeepingDetails && o.bookkeepingDetails[0]) || {};
    const statusClassMap = { pending_payment: 'pending', paid: 'processing', processing: 'processing', delivering: 'processing', completed: 'completed', cancelled: 'cancelled', closed: 'cancelled' };
    const statusTextMap = { pending_payment: '待支付', paid: '已支付', processing: '处理中', delivering: '配送中', completed: '已完成', cancelled: '已取消', closed: '已关闭' };
    const status = order.orderStatus || 'pending_payment';
    const taxpayerType = bk.taxpayerType === 'small_scale' ? '小规模纳税人' : (bk.taxpayerType === 'general' ? '一般纳税人' : (bk.taxpayerType || ''));
    return {
      id: order.orderNo,
      orderNo: order.orderNo,
      status: status,
      statusText: statusTextMap[status] || status,
      statusClass: statusClassMap[status] || 'pending',
      statusIconSvg: '/assets/icons/icon-order-doc.svg',
      module: order.module,
      taxpayerType: taxpayerType,
      cycle: bk.servicePeriod ? ({ year: '全年', half: '半年', preorder: '9.9 预定' }[bk.servicePeriod] || bk.servicePeriod) : '',
      invoice: '',
      social: '',
      fund: '—',
      phone: order.customerRemark && order.customerRemark.phone ? order.customerRemark.phone : '',
      date: order.createdAt ? this._formatDate(order.createdAt) : '',
      price: order.totalAmount,
      events: o.events || [],
    };
  },

  _mapOrder(o) {
    if (!o) return null;
    const remark = this._parse(o.remark, {});
    const statusClassMap = { 1: 'pending', 2: 'processing', 3: 'processing', 4: 'processing', 5: 'completed', 6: 'cancelled', 7: 'cancelled', 8: 'cancelled' };
    const statusIconMap = {
      1: '/assets/icons/icon-order-doc.svg',
      2: '/assets/icons/icon-order-hourglass.svg',
      3: '/assets/icons/icon-order-hourglass.svg',
      4: '/assets/icons/icon-order-hourglass.svg',
      5: '/assets/icons/icon-order-check.svg',
      6: '/assets/icons/icon-order-cancelled.svg',
      7: '/assets/icons/icon-order-cancelled.svg',
      8: '/assets/icons/icon-order-cancelled.svg'
    };
    const taxpayerType = remark.taxpayerType || '';
    return {
      id: o.id,
      orderNo: o.orderNo,
      status: o.status,
      statusText: o.statusText || this._statusText(o.status),
      statusClass: statusClassMap[o.status] || 'pending',
      statusIconSvg: statusIconMap[o.status] || '/assets/icons/icon-order-doc.svg',
      module: o.module,
      taxpayerType: TAXPAYER_MAP[taxpayerType] || taxpayerType,
      cycle: CYCLE_MAP[remark.cycle] || remark.cycle || '',
      invoice: INVOICE_MAP[remark.invoice] || remark.invoice || '',
      social: remark.social === 'with' ? '缴社保' : '不缴社保',
      fund: taxpayerType === 'general' ? (remark.fund === 'with' ? '公积金开户' : '不开户') : '—',
      phone: remark.phone || '',
      date: this._formatDate(o.createdAt),
      price: o.totalPrice,
    };
  },

  _parse(str, fallback) {
    if (!str) return fallback;
    try { return JSON.parse(str); } catch (e) { return fallback; }
  },

  _statusText(s) {
    const { ORDER_STATUS_TEXT } = require('../../../utils/order-status.js');
    return ORDER_STATUS_TEXT[s] || '待支付';
  },

  _formatDate(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    if (isNaN(d.getTime())) return '';
    const p = n => (n < 10 ? '0' + n : '' + n);
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
  },

  // 立即支付（对齐 order-confirm 展平逻辑）
  payOrder() {
    if (this.data.submitting) {
      wx.showToast({ title: '请求处理中，请稍候', icon: 'none' });
      return;
    }
    this.setData({ submitting: true });
    const that = this;
    const order = this.data.order || {};
    const id = order.id;
    const orderNo = this.data.orderNo || order.orderNo || id;
    const isV2 = this.data.isV2;
    if (!id) {
      this.setData({ submitting: false });
      return;
    }

    // V2.0 支付
    if (isV2 || /^(NP|SE|BK)\d{10}/.test(String(orderNo))) {
      api.v2GetPayParams(orderNo).then((pay) => {
        if (pay && pay.devMode) {
          wx.showToast({ title: '开发模式支付参数', icon: 'none' });
          this.setData({ submitting: false });
          return;
        }
        if (pay && pay.params && pay.params.package) {
          wx.hideLoading();
          wx.requestPayment({
            timeStamp: pay.params.timeStamp,
            nonceStr: pay.params.nonceStr,
            package: pay.params.package,
            signType: pay.params.signType || 'RSA',
            paySign: pay.params.paySign,
            success() {
              that.setData({ submitting: false });
              wx.showToast({ title: '支付成功', icon: 'success' });
              that.loadOrder(orderNo);
            },
            fail(err) {
              that.setData({ submitting: false });
              if (err && err.errMsg && err.errMsg.indexOf('cancel') >= 0) {
                wx.showToast({ title: '已取消支付', icon: 'none' });
              } else {
                wx.showToast({ title: '支付失败，请重试', icon: 'none' });
              }
            }
          });
        } else {
          wx.showToast({ title: '支付参数异常，请重试', icon: 'none' });
          this.setData({ submitting: false });
        }
      }).catch(() => {
        this.setData({ submitting: false });
        wx.showToast({ title: '获取支付参数失败', icon: 'none' });
      });
      return;
    }

    // V1 支付
    const openid = wx.getStorageSync('openid') || '';
    wx.showLoading({ title: '发起支付' });
    api.getBookkeepingPayParams(id, openid).then((payRes) => {
      wx.hideLoading();
      const { type, payment } = payRes || {};

      if (type === 'wechat' && payment) {
        wx.requestPayment({
          timeStamp: payment.timeStamp,
          nonceStr: payment.nonceStr,
          package: payment.package,
          signType: payment.signType || 'RSA',
          paySign: payment.paySign,
          success() {
            that.setData({ submitting: false });
            wx.showToast({ title: '支付成功', icon: 'success' });
            that.loadOrder(id);
          },
          fail(err) {
            that.setData({ submitting: false });
            if (err && err.errMsg && err.errMsg.indexOf('cancel') >= 0) {
              wx.showToast({ title: '已取消支付', icon: 'none' });
            } else {
              wx.showToast({ title: '支付失败，请重试', icon: 'none' });
            }
          }
        });
      } else if (type === 'dev') {
        api.devConfirmPay(id).then(function() {
          that.setData({ submitting: false });
          wx.showToast({ title: '支付成功', icon: 'success' });
          that.loadOrder(id);
        }).catch(function() {
          that.setData({ submitting: false });
          wx.showToast({ title: '支付处理失败', icon: 'none' });
        });
        return;
      }
      // B-03: 增加 free 分支
      if (type === 'free') {
        that.setData({ submitting: false });
        wx.showToast({ title: '支付成功', icon: 'success' });
        that.loadOrder(id);
        return;
      }
      // 兜底：未知类型报错
      console.error('[Bookkeeping order-detail] 未知支付类型:', type);
      that.setData({ submitting: false });
      wx.showToast({ title: '支付失败，请重试', icon: 'none' });
    }).catch(function() {
      wx.hideLoading();
      that.setData({ submitting: false });
      wx.showToast({ title: '获取支付参数失败', icon: 'none' });
    });
  },

  // 取消订单 / 申请退款
  cancelOrder() {
    const that = this;
    const order = this.data.order || {};
    const id = order.id;
    const orderNo = this.data.orderNo || order.orderNo || id;
    const isV2 = this.data.isV2;
    const isPaid = isV2 ? ['paid', 'processing', 'delivering'].includes(order.status) : order.status === 2;
    wx.showModal({
      title: isPaid ? '申请退款' : '取消订单',
      content: isPaid ? '确认申请退款？款项将由平台处理。' : '确认取消该订单？',
      async success(res) {
        if (!res.confirm) return;
        wx.showLoading({ title: '处理中' });
        try {
          if (isPaid) {
            if (isV2) {
              await api.v2ApplyRefund(orderNo, { reason: '用户主动申请退款' });
            } else {
              await api.refundRequestBookkeepingOrder(id);
            }
          } else {
            if (isV2) {
              await api.v2CancelOrder(orderNo);
            } else {
              await api.cancelBookkeepingOrder(id);
            }
          }
          wx.hideLoading();
          wx.showToast({ title: isPaid ? '已申请退款' : '已取消', icon: 'success' });
          that.loadOrder(isV2 ? orderNo : id);
        } catch (e) {
          wx.hideLoading();
          wx.showToast({ title: '操作失败', icon: 'none' });
        }
      }
    });
  }
});
