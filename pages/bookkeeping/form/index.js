// pages/bookkeeping/form/index.js
const api = require('../../../utils/api.js');
const common = require('../../../utils/common.js');

Page({
  data: {
    // 企业类型: small-小规模纳税人, general-一般纳税人
    taxpayerType: 'small',

    // 服务周期: year-全年, half-半年, preorder-9.9预定
    cycle: 'year',

    // 开票: none-不开票, within5-5张内, normal-正常开票
    invoice: 'none',

    // 社保: none-不缴社保, with-缴社保
    social: 'none',

    // 公积金: none-不开户, with-开户（仅一般纳税人）
    fund: 'none',

    // 联系电话
    phone: '',

    // 价格
    price: '--',
    payDisabled: true,

    // 加载状态
    loading: false,
  },

  onLoad() {
    // 初始化时获取用户手机号（如果有）
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo && userInfo.phone) {
      this.setData({ phone: userInfo.phone });
    }
    // 初始化默认价格
    this.fetchPrice();
  },

  goBack() {
    wx.navigateBack({ delta: 1 });
  },

  // 选择纳税人类型
  onTaxpayerSelect(e) {
    const type = e.currentTarget.dataset.type;
    if (this.data.taxpayerType === type) return;

    let resetData = {
      taxpayerType: type,
      // 切换纳税人类型时重置周期和公积金
      cycle: 'year',
      fund: 'none',
    };

    // 小规模纳税人：半年不可用，重置
    if (type === 'small' && this.data.cycle === 'preorder') {
      resetData.cycle = 'year';
    }

    this.setData(resetData);
    this.fetchPrice();
  },

  // 选择服务周期
  onCycleSelect(e) {
    const cycle = e.currentTarget.dataset.cycle;
    if (this.data.cycle === cycle) return;
    this.setData({ cycle });
    this.fetchPrice();
  },

  // 选择开票
  onInvoiceSelect(e) {
    const invoice = e.currentTarget.dataset.invoice;
    if (this.data.invoice === invoice) return;
    this.setData({ invoice });
    this.fetchPrice();
  },

  // 选择社保
  onSocialSelect(e) {
    const social = e.currentTarget.dataset.social;
    if (this.data.social === social) return;
    this.setData({ social });
    this.fetchPrice();
  },

  // 选择公积金（仅一般纳税人）
  onFundSelect(e) {
    const fund = e.currentTarget.dataset.fund;
    if (this.data.fund === fund) return;
    this.setData({ fund });
    this.fetchPrice();
  },

  // 输入手机号
  onPhoneInput(e) {
    this.setData({ phone: e.detail.value });
  },

  // 通讯录选择
  onPickContact() {
    wx.chooseContact({
      success: (res) => {
        let phone = res.phoneNumber || '';
        // 清理非数字字符
        phone = phone.replace(/\D/g, '');
        if (phone.length === 11) {
          this.setData({ phone });
        } else {
          wx.showToast({ title: '请选择有效手机号', icon: 'none' });
        }
      },
      fail: () => {
        // 用户取消或不支持
      }
    });
  },

  // 验证手机号
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

  // 获取价格
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
      } else {
        this.setData({ price: '--', payDisabled: true });
      }
    } catch (e) {
      console.error('获取价格失败:', e);
      this.setData({ price: '--', payDisabled: true });
    }
  },

  // 点击立即付款
  onPay() {
    if (this.data.payDisabled) return;

    // 校验手机号
    if (!this.validatePhone()) return;

    const { taxpayerType, cycle, invoice, social, fund, phone, price } = this.data;

    // 跳转到订单确认页
    wx.navigateTo({
      url: `/pages/bookkeeping/order-confirm/index?taxpayerType=${taxpayerType}&cycle=${cycle}&invoice=${invoice}&social=${social}&fund=${fund}&phone=${phone}&price=${price}`
    });
  },

  // 评价与反馈
  onFeedback() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  // 服务详情
  onShowDetail() {
    wx.showModal({
      title: '服务详情',
      content: '代理记账服务说明：\n\n1. 专业会计团队全程服务\n2. 智能做账报税\n3. 全程合规保障\n4. 实时进度查询\n\n如有疑问请拨打客服电话',
      showCancel: false,
      confirmText: '我知道了'
    });
  }
});
