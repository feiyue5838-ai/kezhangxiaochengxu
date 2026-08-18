// pages/newspaper/order-detail/index.js
const api = require('../../../utils/api.js');

Page({
  data: {
    order: null,
    loading: true,
    isSubmitting: false,
    receipts: [],
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

  onPreviewImage(e) {
    const { url, urls } = e.currentTarget.dataset;
    wx.previewImage({ current: url, urls: urls || [url] });
  },

  async loadOrder(id) {
    // V2.0 优先：orderNo 格式（NP/SE/BK 前缀）直接查 V2.0，UUID 先尝试 V1 再降级
    const isV2No = /^(NP|SE|BK)\d{10}/.test(String(id));
    if (isV2No) {
      try {
        const o = await api.v2GetOrderDetail(id);
        this.setData({ order: this._mapV2Order(o), loading: false, orderNo: id, isV2: true });
        return;
      } catch (_e) {
        // V2.0 查询失败降级 V1
        console.warn('v2 detail failed, fallback V1:', _e);
      }
    }
    try {
      const o = await api.getNewspaperOrderDetail(id);
      this.setData({ order: this._mapOrder(o), loading: false, orderNo: o.orderNo || id, isV2: false });
      this.loadReceipts(id);
    } catch (_e) {
      this.setData({ loading: false, order: null });
    }
  },

  // V2.0 详情映射（camelCase 字段）
  _mapV2Order(o) {
    if (!o || !o.order) return null;
    const order = o.order;
    const np = (o.newspaperDetails && o.newspaperDetails[0]) || {};
    const statusClassMap = { pending_payment: 'pending', paid: 'processing', processing: 'processing', delivering: 'processing', completed: 'completed', cancelled: 'cancelled', closed: 'cancelled' };
    const statusTextMap = { pending_payment: '待支付', paid: '已支付', processing: '处理中', delivering: '配送中', completed: '已完成', cancelled: '已取消', closed: '已关闭' };
    const status = order.orderStatus || 'pending_payment';
    return {
      id: order.orderNo,
      orderNo: order.orderNo,
      status: status,
      statusText: statusTextMap[status] || status,
      statusClass: statusClassMap[status] || 'pending',
      statusIconSvg: '/assets/icons/icon-order-doc.svg',
      module: order.module,
      paper: np.newspaperName || '登报订单',
      newspaperName: np.newspaperName || '',
      issueCount: np.issueCount || 0,
      copyCount: np.copies || 1,
      sectionName: np.publicationEdition || '',
      images: [],
      date: order.createdAt ? this._formatDate(order.createdAt) : '',
      price: order.totalAmount,
      desc: np.content || '',
      content: np.content || '',
      remark: order.customerRemark || '',
      address: order.addressSnapshot || null,
      invoice: null,
      events: o.events || [],
    };
  },

  _mapOrder(o) {
    if (!o) return null;
    const item = (o.orderItems && o.orderItems[0]) || {};
    const newspaperName = item.name || o.type || '登报订单';
    const invoice = this._parse(o.invoiceJson, null);
    const address = this._parse(o.addressJson, null);
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
    return {
      id: o.id,
      orderNo: o.orderNo,
      status: o.status,
      statusText: o.statusText || this._statusText(o.status),
      statusClass: statusClassMap[o.status] || 'pending',
      statusIconSvg: statusIconMap[o.status] || '/assets/icons/icon-order-doc.svg',
      type: o.type,
      paper: newspaperName,
      newspaperName,
      issueCount: o.newspaperIssueCount || 0,
      copyCount: o.newspaperCopyCount || 0,
      sectionName: o.newspaperSectionName || '',
      images: this._parseArray(o.newspaperImages),
      date: this._formatDate(o.createdAt),
      price: o.totalPrice,
      desc: o.newspaperContent || '',
      content: o.newspaperContent || '',
      remark: o.remark || '',
      address: address,
      invoice: invoice,
      module: o.module
    };
  },

  _parse(str, fallback) {
    if (!str) return fallback;
    try { return JSON.parse(str); } catch (_e) { return fallback; }
  },

  _parseArray(str) {
    if (!str) return [];
    try { const a = JSON.parse(str); return Array.isArray(a) ? a : []; } catch (_e) { return []; }
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

  // 立即支付（对齐表单下单流程）
  payOrder() {
    if (this.data.isSubmitting) {
      wx.showToast({ title: '请求处理中，请稍候', icon: 'none' });
      return;
    }
    this.setData({ isSubmitting: true });
    const that = this;
    const order = this.data.order || {};
    const id = order.id;
    const orderNo = this.data.orderNo || order.orderNo || id;
    const isV2 = this.data.isV2;
    if (!id) {
      this.setData({ isSubmitting: false });
      return;
    }

    // V2.0 支付
    if (isV2 || /^(NP|SE|BK)\d{10}/.test(String(orderNo))) {
      api.v2GetPayParams(orderNo).then((pay) => {
        if (pay && pay.devMode) {
          wx.showToast({ title: '开发模式支付参数', icon: 'none' });
          this.setData({ isSubmitting: false });
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
            success() { that._afterPayV2(orderNo); },
            fail(err) {
              that.setData({ isSubmitting: false });
              if (err && err.errMsg && err.errMsg.indexOf('cancel') >= 0) {
                wx.showToast({ title: '已取消支付', icon: 'none' });
              } else {
                wx.showToast({ title: '支付失败', icon: 'none' });
              }
            }
          });
        } else {
          wx.showToast({ title: '支付参数异常，请重试', icon: 'none' });
          this.setData({ isSubmitting: false });
        }
      }).catch(() => {
        this.setData({ isSubmitting: false });
        wx.showToast({ title: '获取支付参数失败', icon: 'none' });
      });
      return;
    }

    // V1 支付
    const openid = wx.getStorageSync('openid') || '';
    wx.showLoading({ title: '发起支付' });
    api.getNewspaperPayParams(id, openid).then((data) => {
      const pay = data || {};
      if (pay.type === 'wechat' && pay.payment) {
        wx.hideLoading();
        wx.requestPayment({
          ...pay.payment,
          success() { that._afterPay(id); },
          fail(err) {
            that.setData({ isSubmitting: false });
            if (err && err.errMsg && err.errMsg.indexOf('cancel') >= 0) {
              wx.showToast({ title: '已取消支付', icon: 'none' });
            } else {
              wx.showToast({ title: '支付失败', icon: 'none' });
            }
          }
        });
      } else if (pay.type === 'dev') {
        api.devConfirmPay(id).then(() => that._afterPay(id)).catch(() => { wx.hideLoading(); that.setData({ isSubmitting: false }); });
      } else if (pay.type === 'free') {
        that._afterPay(id);
      } else if (pay.type === 'wechat' && !pay.payment) {
        console.error('[Newspaper] 支付参数异常：type=wechat 但 payment 为空', pay);
        wx.hideLoading();
        wx.showToast({ title: '支付参数异常，请重试', icon: 'none' });
        that.setData({ isSubmitting: false });
      } else {
        console.error('[Newspaper] 未知支付类型:', pay.type, pay);
        wx.hideLoading();
        wx.showToast({ title: '支付失败，请重试', icon: 'none' });
        that.setData({ isSubmitting: false });
      }
    }).catch(() => {
      wx.hideLoading();
      that.setData({ isSubmitting: false });
      wx.showToast({ title: '获取支付参数失败', icon: 'none' });
    });
  },

  _afterPayV2(orderNo) {
    this.setData({ isSubmitting: false });
    wx.showToast({ title: '支付成功', icon: 'success' });
    this.loadOrder(orderNo);
  },

  // 取消订单 / 申请退款
  cancelOrder() {
    const that = this;
    const order = this.data.order || {};
    const id = order.id;
    const orderNo = this.data.orderNo || order.orderNo || id;
    const isV2 = this.data.isV2;
    // 已支付(2)/制作中(3)/已发货(4) 走申请退款；待支付(1) 走取消（V2 按字符串状态）
    const isPaid = isV2
      ? ['paid', 'processing', 'delivering'].includes(order.status)
      : [2, 3, 4].includes(order.status);
    wx.showModal({
      title: isPaid ? '申请退款' : '取消订单',
      content: isPaid ? '确认申请退款？款项将由平台审核处理。' : '确认取消该订单？',
      async success(res) {
        if (!res.confirm) return;
        wx.showLoading({ title: '处理中' });
        try {
          if (isPaid) {
            if (isV2) {
              await api.v2ApplyRefund(orderNo, { reason: '用户主动申请退款' });
            } else {
              await api.refundRequestNewspaperOrder(id);
            }
          } else {
            if (isV2) {
              await api.v2CancelOrder(orderNo);
            } else {
              await api.cancelNewspaperOrder(id);
            }
          }
          wx.hideLoading();
          wx.showToast({ title: isPaid ? '已申请退款' : '已取消', icon: 'success' });
          that.loadOrder(isV2 ? orderNo : id);
        } catch (_e) {
          wx.hideLoading();
          wx.showToast({ title: '操作失败', icon: 'none' });
        }
      }
    });
  },

  _afterPay(id) {
    this.setData({ isSubmitting: false });
    wx.showToast({ title: '支付成功', icon: 'success' });
    this.loadOrder(id);
  },

  // 加载回执列表
  async loadReceipts(orderId) {
    try {
      const res = await api.getOrderReceipts(orderId);
      let receipts = [];
      if (Array.isArray(res)) receipts = res;
      else if (res && Array.isArray(res.list)) receipts = res.list;
      else if (res && res.data && Array.isArray(res.data.list)) receipts = res.data.list;
      this.setData({ receipts });
    } catch (_e) {
      console.error('loadReceipts error', _e);
    }
  },

  // 预览回执图片
  previewReceipt(e) {
    const url = e.currentTarget.dataset.url;
    wx.previewImage({ urls: [url], current: url });
  }
});
