// pages/newspaper/order/index.js - 登报订单确认
const common = require('../../../utils/common.js');

Page({
  data: {
    statusBarHeight: 20,
    navHeight: 64,
    
    // 订单数据
    orderData: null,
    
    // 登报内容
    newspaperContent: null,
    businessType: '',
    templateName: '',
    content: '',
    charCount: 0,
    
    // 报纸信息
    selectedPaper: null,
    quantity: 1,
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
    remark: '',
    
    // 提交状态
    isSubmitting: false
  },

  onLoad() {
    const navCalc = common.getNavigationHeight();
    this.setData({
      statusBarHeight: navCalc.statusBarHeight,
      navHeight: navCalc.navHeight
    });
    
    // 读取订单数据
    const orderData = wx.getStorageSync('newspaperOrderData') || {};
    this.setData({
      orderData,
      newspaperContent: {
        content: orderData.content || '',
        businessType: orderData.businessType || '',
        templateName: orderData.templateName || ''
      },
      businessType: orderData.businessType || '',
      templateName: orderData.templateName || '',
      content: orderData.content || '',
      charCount: orderData.charCount || 0,
      selectedPaper: orderData.selectedPaper,
      quantity: orderData.quantity || 1,
      unitPrice: orderData.unitPrice || 0,
      totalPrice: orderData.totalPrice || 0,
      contactName: orderData.contactName || '',
      contactPhone: orderData.contactPhone || '',
      addressDetail: orderData.addressDetail || '',
      needInvoice: orderData.needInvoice || false,
      invoiceType: orderData.invoiceType || 'personal',
      invoiceTitle: orderData.invoiceTitle || '',
      taxNumber: orderData.taxNumber || '',
      remark: orderData.remark || ''
    });
  },

  // 返回修改
  goBack() {
    wx.navigateBack();
  },

  // 跳转到订单详情
  goToDetail() {
    wx.redirectTo({
      url: '/pages/newspaper/order-detail?id=' + (this.data.orderData.orderId || Date.now())
    });
  },

  // 提交订单
  submitOrder() {
    if (this.data.isSubmitting) {
      wx.showToast({ title: '订单提交中...', icon: 'none' });
      return;
    }
    
    this.setData({ isSubmitting: true });
    
    // 生成订单号
    const orderId = 'NP' + Date.now();
    const orderData = {
      ...this.data.orderData,
      orderId,
      status: 'pending',
      createTime: new Date().toISOString()
    };
    
    // 保存订单
    wx.setStorageSync('newspaperOrderData', orderData);
    
    // 模拟提交
    setTimeout(() => {
      wx.showToast({ title: '订单提交成功', icon: 'success' });
      this.setData({ isSubmitting: false });
      
      // 跳转到订单详情
      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/newspaper/order-detail?id=' + orderId
        });
      }, 1000);
    }, 1000);
  }
});
