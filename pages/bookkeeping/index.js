// pages/bookkeeping/index.js
const api = require('../../utils/api.js');
const common = require('../../utils/common.js');

Page({
  data: {
    taxpayerType: 'small',
    cycle: 'year',
    invoice: 'none',
    social: 'none',
    fund: 'none',
    phone: '',
    price: '--',
    payDisabled: true,
    loading: false,
  },

  onLoad() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo && userInfo.phone) {
      this.setData({ phone: userInfo.phone });
    }
    this.fetchPrice();
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 });
    }
  },

  onTaxpayerSelect(e) {
    const type = e.currentTarget.dataset.type;
    if (this.data.taxpayerType === type) return;
    let resetData = { taxpayerType: type, cycle: 'year', fund: 'none' };
    if (type === 'small' && this.data.cycle === 'preorder') {
      resetData.cycle = 'year';
    }
    this.setData(resetData);
    this.fetchPrice();
  },

  onCycleSelect(e) {
    const cycle = e.currentTarget.dataset.cycle;
    if (this.data.cycle === cycle) return;
    this.setData({ cycle });
    this.fetchPrice();
  },

  onInvoiceSelect(e) {
    const invoice = e.currentTarget.dataset.invoice;
    if (this.data.invoice === invoice) return;
    this.setData({ invoice });
    this.fetchPrice();
  },

  onSocialSelect(e) {
    const social = e.currentTarget.dataset.social;
    if (this.data.social === social) return;
    this.setData({ social });
    this.fetchPrice();
  },

  onFundSelect(e) {
    const fund = e.currentTarget.dataset.fund;
    if (this.data.fund === fund) return;
    this.setData({ fund });
    this.fetchPrice();
  },

  onPhoneInput(e) {
    this.setData({ phone: e.detail.value });
  },

  onPickContact() {
    wx.chooseContact({
      success: (res) => {
        let phone = (res.phoneNumber || '').replace(/\D/g, '');
        if (phone.length === 11) {
          this.setData({ phone });
        } else {
          wx.showToast({ title: '请选择有效手机号', icon: 'none' });
        }
      }
    });
  },

  validatePhone() {
    const phone = this.data.phone.trim();
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      wx.vibrateShort({ type: 'heavy' });
      wx.showToast({ title: '请输入正确手机号', icon: 'none' });
      return false;
    }
    return true;
  },

  async fetchPrice() {
    this.setData({ price: '--', payDisabled: true });
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
        this.setData({ price: price.toFixed(2), payDisabled: false });
      }
    } catch (e) {
      console.error('获取价格失败:', e);
    }
  },

  onPay() {
    if (this.data.payDisabled) return;
    if (!this.validatePhone()) return;
    const { taxpayerType, cycle, invoice, social, fund, phone, price } = this.data;
    wx.navigateTo({
      url: `/pages/bookkeeping/order-confirm/index?taxpayerType=${taxpayerType}&cycle=${cycle}&invoice=${invoice}&social=${social}&fund=${fund}&phone=${phone}&price=${price}`
    });
  },

  onShowDetail() {
    wx.showModal({
      title: '服务详情',
      content: '代理记账服务说明：\n\n1. 专业会计团队全程服务\n2. 智能做账报税\n3. 全程合规保障\n4. 实时进度查询\n\n如有疑问请拨打客服电话',
      showCancel: false,
      confirmText: '我知道了'
    });
  }
});
