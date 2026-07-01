// pages/newspaper/form/index.js - 登报订单表单
const common = require('../../../utils/common.js');

Page({
  data: {
    statusBarHeight: 20,
    navHeight: 64,
    
    // 登报内容数据
    newspaperContent: null,
    businessType: '',
    templateName: '',
    content: '',
    charCount: 0,
    
    // 报纸选择
    selectedPaper: null,
    papers: [
      { id: 'p1', name: '成都晚报', price: 50, desc: '市级报纸，覆盖成都市' },
      { id: 'p2', name: '华西都市报', price: 60, desc: '省级报纸，覆盖四川省' },
      { id: 'p3', name: '四川日报', price: 80, desc: '省级党报，权威发布' }
    ],
    
    // 份数
    quantity: 1,
    
    // 价格计算
    unitPrice: 0,
    totalPrice: 0,
    
    // 收件信息
    contactName: '',
    contactPhone: '',
    addressDetail: '',
    
    // 发票信息
    needInvoice: false,
    invoiceType: 'personal',
    invoiceTitle: '',
    taxNumber: '',
    
    // 备注
    remark: ''
  },

  onLoad() {
    const navCalc = common.getNavigationHeight();
    this.setData({
      statusBarHeight: navCalc.statusBarHeight,
      navHeight: navCalc.navHeight
    });
    
    // 从 Storage 读取登报内容
    const newspaperContent = wx.getStorageSync('newspaperContent') || {};
    this.setData({
      newspaperContent,
      businessType: newspaperContent.businessType || '个人证件',
      templateName: newspaperContent.templateName || '',
      content: newspaperContent.content || '',
      charCount: newspaperContent.charCount || 0
    });
    
    // 读取已保存的表单数据
    const savedForm = wx.getStorageSync('newspaperForm') || {};
    if (savedForm.contactName) {
      this.setData(savedForm);
    }
    
    // 计算默认价格
    this.calculatePrice();
  },

  // 选择报纸
  selectPaper(e) {
    const { id } = e.currentTarget.dataset;
    const paper = this.data.papers.find(p => p.id === id);
    this.setData({ selectedPaper: paper });
    this.calculatePrice();
  },

  // 调整份数
  adjustQuantity(e) {
    const { type } = e.currentTarget.dataset;
    let quantity = this.data.quantity;
    if (type === 'add') {
      quantity = Math.min(quantity + 1, 10);
    } else {
      quantity = Math.max(quantity - 1, 1);
    }
    this.setData({ quantity });
    this.calculatePrice();
  },

  // 计算价格
  calculatePrice() {
    const { selectedPaper, quantity, charCount } = this.data;
    if (!selectedPaper) {
      this.setData({ totalPrice: 0 });
      return;
    }
    
    // 基础价格 + 超出字数费用
    const basePrice = selectedPaper.price;
    const extraChars = Math.max(0, charCount - 50);
    const extraFee = Math.ceil(extraChars / 50) * 10;
    const unitPrice = basePrice + extraFee;
    const totalPrice = unitPrice * quantity;
    
    this.setData({ unitPrice, totalPrice });
  },

  // 输入收件人
  onNameInput(e) {
    this.setData({ contactName: e.detail.value });
  },

  // 输入手机号
  onPhoneInput(e) {
    this.setData({ contactPhone: e.detail.value });
  },

  // 输入地址
  onAddressInput(e) {
    this.setData({ addressDetail: e.detail.value });
  },

  // 是否需要发票
  onInvoiceChange(e) {
    this.setData({ needInvoice: !!e.detail.value });
  },

  // 选择发票类型
  selectInvoiceType(e) {
    const { type } = e.currentTarget.dataset;
    this.setData({ invoiceType: type });
  },

  // 输入发票抬头
  onInvoiceTitleInput(e) {
    this.setData({ invoiceTitle: e.detail.value });
  },

  // 输入税号
  onTaxNumberInput(e) {
    this.setData({ taxNumber: e.detail.value });
  },

  // 备注输入
  onRemarkInput(e) {
    this.setData({ remark: e.detail.value });
  },

  // 检查是否可以提交
  canSubmit() {
    const { selectedPaper, contactName, contactPhone, addressDetail } = this.data;
    return selectedPaper && contactName && contactPhone && addressDetail;
  },

  // 返回编辑内容
  goBack() {
    wx.navigateBack();
  },

  // 提交订单
  submitOrder() {
    if (!this.canSubmit()) {
      wx.showToast({ title: '请完善必填信息', icon: 'none' });
      return;
    }
    
    const { contactPhone } = this.data;
    if (!/^1[3-9]\d{9}$/.test(contactPhone)) {
      wx.showToast({ title: '请输入正确手机号', icon: 'none' });
      return;
    }
    
    // 保存表单数据
    const formData = {
      selectedPaper: this.data.selectedPaper,
      quantity: this.data.quantity,
      unitPrice: this.data.unitPrice,
      totalPrice: this.data.totalPrice,
      contactName: this.data.contactName,
      contactPhone: this.data.contactPhone,
      addressDetail: this.data.addressDetail,
      needInvoice: this.data.needInvoice,
      invoiceType: this.data.invoiceType,
      invoiceTitle: this.data.invoiceTitle,
      taxNumber: this.data.taxNumber,
      remark: this.data.remark
    };
    wx.setStorageSync('newspaperForm', formData);
    
    // 保存登报内容
    const newspaperContent = this.data.newspaperContent;
    wx.setStorageSync('newspaperOrderData', {
      ...newspaperContent,
      ...formData,
      _timestamp: Date.now()
    });
    
    // 跳转到订单确认页
    wx.navigateTo({
      url: '/pages/newspaper/order'
    });
  }
});
