const common = require('../../../utils/common.js');

Page({
  data: {
    statusBarHeight: 0,
    navHeight: 0,
    order: null,
    categories: [
      { value: 'quality',    name: '质量问题',    icon: '⚠️' },
      { value: 'missing',    name: '漏刻/缺失',    icon: '📋' },
      { value: 'wrong',      name: '信息错误',    icon: '✏️' },
      { value: 'receipt',    name: '补开收据',    icon: '🧾' },
      { value: 'other',      name: '其他',        icon: '📌' },
    ],
    form: {
      category: '',
      reason: '',
      images: [],
      phone: ''
    }
  },

  onLoad(opt) {
    const { statusBarHeight, navHeight } = common.getNavigationHeight();
    this.setData({ statusBarHeight, navHeight });
    // 从 Storage 或 URL 参数读取订单
    const storageOrder = wx.getStorageSync('aftersale_order');
    if (storageOrder) {
      this.setData({
        order: {
          id: storageOrder.id || '',
          type: storageOrder.type || storageOrder.productName || '订单',
          desc: storageOrder.desc || storageOrder.productName || '',
          date: storageOrder.createTime || storageOrder.date || '',
          module: storageOrder.module || ''
        }
      });
      wx.removeStorageSync('aftersale_order');
    } else if (opt.orderId) {
      this.loadOrder(opt.orderId);
    }
  },

  loadOrder(orderId) {
    const findOrder = (list) => {
      const raw = wx.getStorageSync(list) || [];
      return raw.find(o => String(o.id) === String(orderId));
    };
    const order = findOrder('seal_orders') || findOrder('newspaper_orders') || findOrder('license_orders');
    if (order) {
      this.setData({ order: { type: order.type || order.productName || '订单', desc: order.desc || order.productName, date: order.createTime || order.date || '', module: order.module || '' } });
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
    const { form, order } = this.data;
    const record = {
      id: 'AS' + Date.now(),
      orderId: order ? (order.id || '') : '',
      module: order ? (order.module || '') : '',
      productName: order ? (order.desc || order.type || '') : '',
      createTime: new Date().toLocaleString('zh-CN'),
      category: form.category,
      reason: form.reason,
      images: form.images,
      phone: form.phone,
      status: 'pending',
      timeline: [
        { time: new Date().toLocaleString('zh-CN'), title: '已提交', desc: '您的售后申请已提交，客服将在1-3个工作日内处理' },
        { time: '', title: '处理中', desc: '客服正在核实处理中，请耐心等待' },
        { time: '', title: '处理完成', desc: '' },
      ]
    };
    const records = wx.getStorageSync('aftersale_records') || [];
    records.unshift(record);
    wx.setStorageSync('aftersale_records', records);
    wx.showToast({ title: '提交成功', icon: 'success' });
    setTimeout(() => {
      wx.redirectTo({ url: '/pages/aftersale/list/index' });
    }, 1500);
  },

  goBack() {
    wx.navigateBack();
  },
});
