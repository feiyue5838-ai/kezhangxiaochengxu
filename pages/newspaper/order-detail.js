// pages/newspaper/order-detail.js
const api = require('../../utils/api.js');

Page({
  data: {
    order: null,
    loading: true,
    isSubmitting: false,
    receipts: [],
  },

  onLoad(options) {
    if (options.id) {
      this.loadOrder(options.id);
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
    try {
      const o = await api.getNewspaperOrderDetail(id);
      this.setData({ order: this._mapOrder(o), loading: false });
      this.loadReceipts(id);
    } catch (e) {
      this.setData({ loading: false, order: null });
    }
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
    try { return JSON.parse(str); } catch (e) { return fallback; }
  },

  _parseArray(str) {
    if (!str) return [];
    try { const a = JSON.parse(str); return Array.isArray(a) ? a : []; } catch (e) { return []; }
  },

  _statusText(s) {
    const map = { 1: '待支付', 2: '已支付', 3: '制作中', 4: '已发货', 5: '已完成', 6: '已取消', 7: '退款中', 8: '已退款' };
    return map[s] || '待支付';
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
    const id = this.data.order.id;
    const app = getApp();
    const openid = (app && app.globalData && app.globalData.openid) || '';
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
      } else {
        that._afterPay(id);
      }
    }).catch(() => {
      wx.hideLoading();
      that.setData({ isSubmitting: false });
      wx.showToast({ title: '获取支付参数失败', icon: 'none' });
    });
  },

  // 取消订单 / 申请退款
  cancelOrder() {
    const that = this;
    const id = this.data.order.id;
    const isPaid = this.data.order.status === 2;
    wx.showModal({
      title: isPaid ? '申请退款' : '取消订单',
      content: isPaid ? '确认申请退款？款项将由平台处理。' : '确认取消该订单？',
      async success(res) {
        if (!res.confirm) return;
        wx.showLoading({ title: '处理中' });
        try {
          await api.cancelNewspaperOrder(id);
          wx.hideLoading();
          wx.showToast({ title: isPaid ? '已申请退款' : '已取消', icon: 'success' });
          that.loadOrder(id);
        } catch (e) {
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
    } catch (e) {
      console.error('loadReceipts error', e);
    }
  },

  // 预览回执图片
  previewReceipt(e) {
    const url = e.currentTarget.dataset.url;
    wx.previewImage({ urls: [url], current: url });
  }
});
