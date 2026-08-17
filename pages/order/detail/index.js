// pages/order/detail/index.js — V2.0 统一订单详情页（三业务通用）
const api = require('../../../utils/api.js');
const { orderStatusV2, ORDER_STEPS } = require('../../../utils/order-status-v2.js');

Page({
  data: {
    orderNo: '',
    loading: true,
    order: null,          // 后端 order 字段
    display: null,        // 前端归一化展示对象
    details: null,        // sealDetails / newspaperDetails
    events: [],
    steps: ORDER_STEPS,
    currentStep: -1,
    address: null,
    isSubmitting: false,
  },

  onLoad(options) {
    if (options.orderNo) {
      this.setData({ orderNo: options.orderNo });
      this.loadOrder(options.orderNo);
    } else {
      this.setData({ loading: false });
    }
  },

  goBack() {
    wx.navigateBack({ delta: 1 });
  },

  loadOrder(orderNo) {
    this.setData({ loading: true });
    api.v2GetOrderDetail(orderNo).then((res) => {
      const order = res && res.order;
      if (!order) {
        this.setData({ loading: false });
        return;
      }
      const st = orderStatusV2({
        order_status: order.orderStatus,
        payment_status: order.paymentStatus,
        fulfillment_status: order.fulfillmentStatus,
        refund_status: order.refundStatus,
      });

      // 地址快照解析
      let address = null;
      if (order.addressSnapshot) {
        try {
          address = typeof order.addressSnapshot === 'string' ? JSON.parse(order.addressSnapshot) : order.addressSnapshot;
        } catch (e) { /* 忽略 */ }
      }

      // 业务明细摘要
      const details = res.sealDetails || res.newspaperDetails || null;
      let desc = '';
      if (res.sealDetails) {
        desc = [res.sealDetails.sealPackageName, (res.sealDetails.sealTypes || []).join('、')].filter(Boolean).join(' ');
      } else if (res.newspaperDetails) {
        desc = (res.newspaperDetails.newspaperName || '登报') + (res.newspaperDetails.content ? '：' + (res.newspaperDetails.content || '').slice(0, 30) : '');
      }
      if (!desc) desc = order.customerRemark || (order.module === 'seal' ? '刻章服务' : order.module === 'newspaper' ? '登报服务' : '代理记账');

      const moduleText = order.module === 'seal' ? '在线刻章' : order.module === 'newspaper' ? '登报服务' : '代理记账';

      const display = {
        orderNo: order.orderNo,
        module: order.module,
        moduleText,
        type: moduleText,
        desc,
        statusText: st.label,
        statusColor: st.color,
        statusKey: st.key,
        totalAmount: Number(order.totalAmount) || 0,
        payAmount: Number(order.payAmount) || 0,
        paidAmount: Number(order.paidAmount) || 0,
        createTime: (order.createdAt || '').replace('T', ' ').substring(0, 16),
        paidTime: (order.paidAt || '').replace('T', ' ').substring(0, 16),
        completedTime: (order.completedAt || '').replace('T', ' ').substring(0, 16),
        remark: order.customerRemark || '',
        canPay: st.key === 'pending_payment',
        canConfirm: st.action === 'confirm',
        canCancel: st.key === 'pending_payment',
        canRefund: ['paid', 'pending_assign', 'assigned', 'accepted', 'processing', 'delivering', 'signed'].indexOf(st.key) >= 0,
      };

      this.setData({
        order: order,
        display,
        details,
        events: (res.events || []),
        currentStep: st.step,
        address,
        loading: false,
      });
    }).catch(() => {
      this.setData({ loading: false });
    });
  },

  // ============ 操作 ============

  onPay() {
    if (this.data.isSubmitting) return;
    this.setData({ isSubmitting: true });
    wx.showLoading({ title: '获取支付参数...' });
    api.v2GetPayParams(this.data.orderNo, {}).then((res) => {
      wx.hideLoading();
      this.setData({ isSubmitting: false });
      if (!res || !res.params || res.params.devMode) {
        // 开发模式：直接模拟支付成功（后端 dev 回调）
        wx.showModal({
          title: '支付',
          content: '当前为开发模式（未配置微信支付），是否模拟支付成功？',
          success: (m) => {
            if (m.confirm) {
              wx.showLoading({ title: '支付中...' });
              api.v2Request ? null : null;
              // 开发模式走后端 dev 确认接口或直接刷新
              this.loadOrder(this.data.orderNo);
              wx.hideLoading();
              wx.showToast({ title: '已刷新', icon: 'success' });
            }
          },
        });
        return;
      }
      // 真实微信支付
      const p = res.params;
      wx.requestPayment({
        timeStamp: p.timeStamp,
        nonceStr: p.nonceStr,
        package: p.package,
        signType: p.signType || 'RSA',
        paySign: p.paySign,
        success: () => {
          wx.showToast({ title: '支付成功', icon: 'success' });
          setTimeout(() => this.loadOrder(this.data.orderNo), 800);
        },
        fail: (err) => {
          if (err && err.errMsg && err.errMsg.indexOf('cancel') >= 0) {
            wx.showToast({ title: '已取消支付', icon: 'none' });
          } else {
            wx.showToast({ title: '支付失败：' + (err.errMsg || ''), icon: 'none' });
          }
        },
      });
    }).catch(() => {
      wx.hideLoading();
      this.setData({ isSubmitting: false });
    });
  },

  onCancel() {
    wx.showModal({
      title: '取消订单',
      content: '确定取消此订单吗？',
      success: (m) => {
        if (!m.confirm) return;
        wx.showLoading({ title: '取消中...' });
        api.v2CancelOrder(this.data.orderNo).then(() => {
          wx.hideLoading();
          wx.showToast({ title: '已取消', icon: 'success' });
          this.loadOrder(this.data.orderNo);
        }).catch(() => {
          wx.hideLoading();
          wx.showToast({ title: '取消失败', icon: 'none' });
        });
      },
    });
  },

  onConfirmReceive() {
    wx.showModal({
      title: '确认收货',
      content: '请确认您已收到货物且无异议？',
      confirmColor: '#52C41A',
      success: (m) => {
        if (!m.confirm) return;
        wx.showLoading({ title: '确认中...' });
        api.v2ConfirmReceive(this.data.orderNo).then(() => {
          wx.hideLoading();
          wx.showToast({ title: '已确认收货', icon: 'success' });
          this.loadOrder(this.data.orderNo);
        }).catch(() => {
          wx.hideLoading();
          wx.showToast({ title: '确认失败', icon: 'none' });
        });
      },
    });
  },

  onApplyRefund() {
    if (this.data.isSubmitting) return;
    wx.showModal({
      title: '申请退款',
      content: '确定申请退款吗？',
      success: (m) => {
        if (!m.confirm) return;
        this.setData({ isSubmitting: true });
        wx.showLoading({ title: '提交中...' });
        api.v2ApplyRefund(this.data.orderNo, { reason: '用户申请退款' }).then(() => {
          wx.hideLoading();
          this.setData({ isSubmitting: false });
          wx.showToast({ title: '已提交申请', icon: 'success' });
          this.loadOrder(this.data.orderNo);
        }).catch(() => {
          wx.hideLoading();
          this.setData({ isSubmitting: false });
          wx.showToast({ title: '申请失败', icon: 'none' });
        });
      },
    });
  },

  previewImage(e) {
    const url = e.currentTarget.dataset.url;
    if (url) wx.previewImage({ urls: [url] });
  },
});
