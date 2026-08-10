// pages/bookkeeping-tab/index.js
const api = require('../../utils/api.js');
const common = require('../../utils/common.js');

Page({
  data: {
    taxpayerType: '',
    cycle: '',
    invoice: '',
    social: '',
    fund: '',
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
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 });
    }
  },

  onTaxpayerSelect(e) {
    const type = e.currentTarget.dataset.type;
    if (this.data.taxpayerType === type) return;
    // 切换企业类型时，清空所有下游选项让用户完全重新选择
    let resetData = { taxpayerType: type, cycle: '', invoice: '', social: '', fund: '' };
    this.setData(resetData);
    // 清空价格，等待用户选择服务周期后再获取
    this.setData({ price: '--', payDisabled: true });
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

  // 判断必填项是否已全部选齐
  _isAllSelected() {
    const { taxpayerType, cycle, invoice, social, fund } = this.data;
    if (!taxpayerType || !cycle || !invoice || !social) return false;
    // 一般纳税人需额外选择公积金
    if (taxpayerType === 'general' && !fund) return false;
    return true;
  },

  // B-05: 计价请求防竞态
  async fetchPrice() {
    // 只有全部选项选齐才获取并显示价格
    if (!this._isAllSelected()) {
      this.setData({ price: '--', payDisabled: true });
      return;
    }
    this.setData({ price: '--', payDisabled: true });
    
    // B-05: 请求序号，丢弃过期响应
    const seq = ++this._priceSeq;
    
    try {
      const res = await api.getBookkeepingPrice({
        taxpayerType: this.data.taxpayerType,
        cycle: this.data.cycle,
        invoice: this.data.invoice,
        social: this.data.social,
        fund: this.data.fund,
      });
      // B-05: 丢弃过期响应
      if (seq !== this._priceSeq) return;
      
      const price = Number(res.price || res.amount || 0);
      if (price > 0) {
        this.setData({ price: price.toFixed(2), payDisabled: false });
      } else {
        // B-04: 价格<=0时提示用户
        this.setData({ price: '--', payDisabled: true });
        wx.showToast({ title: '该组合暂不支持，请调整选项', icon: 'none' });
      }
    } catch (e) {
      // B-05: 丢弃过期响应
      if (seq !== this._priceSeq) return;
      
      console.error('获取价格失败:', e);
      // B-04: 价格获取失败时提示用户
      this.setData({ price: '--', payDisabled: true });
      wx.showToast({ title: '价格获取失败，请重试', icon: 'none' });
    }
  },

  // B-02/B-06: 不在 URL 中传递价格和手机号
  onPay() {
    if (this.data.payDisabled) return;
    const { taxpayerType, cycle, invoice, social, fund } = this.data;
    if (!taxpayerType) { wx.showToast({ title: '请选择企业类型', icon: 'none' }); return; }
    if (!cycle) { wx.showToast({ title: '请选择服务周期', icon: 'none' }); return; }
    if (!invoice) { wx.showToast({ title: '请选择开票需求', icon: 'none' }); return; }
    if (!social) { wx.showToast({ title: '请选择社保缴纳', icon: 'none' }); return; }
    if (!this.validatePhone()) return;
    const { phone } = this.data;
    // B-06: 手机号通过 Storage 传递，不暴露在 URL
    wx.setStorageSync('bookkeepingPhone', phone);
    wx.navigateTo({
      url: `/pages/bookkeeping/order-confirm/index?taxpayerType=${taxpayerType}&cycle=${cycle}&invoice=${invoice}&social=${social}&fund=${fund}`
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
