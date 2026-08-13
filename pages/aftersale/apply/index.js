const api = require('../../../utils/api.js');

Page({
  data: {
    order: null,
    categories: [
      { value: 'quality',  name: '质量问题',   icon: '⚠️' },
      { value: 'missing',  name: '漏刻/缺失',  icon: '📋' },
      { value: 'wrong',    name: '信息错误',   icon: '✏️' },
      { value: 'receipt',  name: '补开收据',   icon: '🧾' },
      { value: 'other',    name: '其他',       icon: '📌' },
    ],
    form: {
      category: '',
      reason: '',
      images: [],
      phone: ''
    },
    canSubmit: false
  },

  onLoad(opt) {
    const storageOrder = wx.getStorageSync('aftersale_order');
    if (storageOrder) {
      this.setData({ order: {
        id: storageOrder.id || '',
        type: storageOrder.type || storageOrder.productName || '订单',
        desc: storageOrder.desc || storageOrder.productName || '',
        date: storageOrder.createTime || storageOrder.date || '',
        module: storageOrder.module || ''
      }});
      wx.removeStorageSync('aftersale_order');
    } else if (opt.orderId) {
      this.setData({ order: { id: opt.orderId, type: '订单', module: opt.module || '' } });
    }
  },

  selectCategory(e) {
    const val = e.currentTarget.dataset.value;
    this.setData({ 'form.category': val });
    this.checkCanSubmit();
  },

  onReasonInput(e) {
    this.setData({ 'form.reason': e.detail.value });
    this.checkCanSubmit();
  },

  onPhoneInput(e) {
    this.setData({ 'form.phone': e.detail.value });
    this.checkCanSubmit();
  },

  chooseImage() {
    if (this.data.form.images.length >= 3) return;
    wx.chooseMedia({
      count: 3 - this.data.form.images.length,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const paths = res.tempFiles.map(f => f.tempFilePath);
        this.setData({ 'form.images': [...this.data.form.images, ...paths] });
      }
    });
  },

  removeImage(e) {
    const idx = e.currentTarget.dataset.index;
    const images = this.data.form.images.filter((_, i) => i !== idx);
    this.setData({ 'form.images': images });
  },

  checkCanSubmit() {
    const { category, reason, phone } = this.data.form;
    const ok = category && reason.trim() && /^1\d{10}$/.test(phone);
    this.setData({ canSubmit: !!ok });
  },

  submitApply() {
    if (!this.data.canSubmit) return;
    if (!this.data.order?.id) {
      wx.showToast({ title: '请先选择订单', icon: 'none' });
      return;
    }
    wx.showLoading({ title: '提交中...' });
    api.refundRequest(this.data.order.id, this.data.form.reason).then(() => {
      wx.hideLoading();
      wx.showToast({ title: '提交成功', icon: 'success' });
      setTimeout(() => wx.redirectTo({ url: '/pages/aftersale/list/index' }), 1500);
    }).catch(err => {
      wx.hideLoading();
      wx.showToast({ title: (err.message || '提交失败'), icon: 'none' });
    });
  },

  goBack() {
    wx.navigateBack();
  },
});
