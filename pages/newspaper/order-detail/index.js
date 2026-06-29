// pages/newspaper/order-detail/index.js - 登报订单详情
const common = require('../../../utils/common.js');

Page({
  data: {
    statusBarHeight: 20,
    navHeight: 64,
    
    // 订单数据
    orderId: '',
    status: 'pending',
    statusText: '待审核',
    statusColor: '#FFB020',
    createTime: '',
    
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
    remark: ''
  },

  onLoad(options) {
    const navCalc = common.getNavigationHeight();
    this.setData({
      statusBarHeight: navCalc.statusBarHeight,
      navHeight: navCalc.navHeight,
      orderId: options.id || ''
    });
    
    // 读取订单数据
    const orderData = wx.getStorageSync('newspaperOrderData') || {};
    this.setData({
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
      remark: orderData.remark || '',
      status: orderData.status || 'pending',
      createTime: orderData.createTime || ''
    });
    
    // 更新状态显示
    this.updateStatusDisplay();
  },

  // 更新状态显示
  updateStatusDisplay() {
    const statusMap = {
      'pending': { text: '待审核', color: '#FFB020' },
      'approved': { text: '审核通过', color: '#52C41A' },
      'processing': { text: '处理中', color: '#1890FF' },
      'completed': { text: '已完成', color: '#52C41A' },
      'cancelled': { text: '已取消', color: '#8C97A6' }
    };
    
    const status = this.data.status;
    const statusInfo = statusMap[status] || statusMap['pending'];
    
    this.setData({
      statusText: statusInfo.text,
      statusColor: statusInfo.color
    });
  },

  // 返回首页
  goHome() {
    wx.switchTab({ url: '/pages/home/index' });
  },

  // 联系客服
  contactService() {
    wx.showToast({ title: '客服电话: 400-xxx-xxxx', icon: 'none' });
  },

  // 查看报纸样式（模拟）
  viewNewspaperStyle() {
    wx.showToast({ title: '报纸样式查看功能开发中', icon: 'none' });
  }
});
