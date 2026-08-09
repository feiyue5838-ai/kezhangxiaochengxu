// pages/invoice/edit/index.js
const common = require('../../../utils/common.js');

Page({
  data: {
    // 发票类型: normal=普通发票, special=增值税专用发票
    invoiceType: 'normal',

    // 普通发票
    normal: {
      titleType: 'personal',  // personal / company
      title: '',
      taxNumber: '',
      email: ''
    },

    // 专用发票
    special: {
      title: '',
      taxNumber: '',
      address: '',
      phone: '',
      bankName: '',
      bankAccount: ''
    },

    isSaving: false
  },

  onLoad() {
    // 读取已有发票信息
    try {
      const info = wx.getStorageSync('invoiceInfo') || {};
      if (info && info.type) {
        this.setData({ invoiceType: info.type });
        if (info.type === 'normal' && info.title) {
          this.setData({ normal: { titleType: info.titleType || 'personal', title: info.title || '', taxNumber: info.taxNumber || '', email: info.email || '' } });
        } else if (info.type === 'special' && info.title) {
          this.setData({ special: { title: info.title || '', taxNumber: info.taxNumber || '', address: info.address || '', phone: info.phone || '', bankName: info.bankName || '', bankAccount: info.bankAccount || '' } });
        }
      }
    } catch (e) {}
  },

  goBack() {
    wx.navigateBack();
  },

  // 切换发票类型
  switchType(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({ invoiceType: type });
  },

  // 切换普通发票抬头类型
  switchTitleType(e) {
    const titleType = e.currentTarget.dataset.tt;
    this.setData({ ['normal.titleType']: titleType });
  },

  // 输入普通发票字段
  onNormalInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ ['normal.' + field]: e.detail.value });
  },

  // 输入专用发票字段
  onSpecialInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ ['special.' + field]: e.detail.value });
  },

  // 清空发票信息
  clearInvoice() {
    wx.showModal({
      title: '提示',
      content: '确定要清空发票信息吗？',
      confirmText: '清空',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('invoiceInfo');
          wx.showToast({ title: '已清空', icon: 'success' });
          setTimeout(() => this.goBack(), 1200);
        }
      }
    });
  },

  // 保存发票信息
  saveInvoice() {
    if (this.data.isSaving) return;

    const { invoiceType, normal, special } = this.data;

    if (invoiceType === 'normal') {
      if (!normal.title || normal.title.trim().length < 2) {
        wx.showToast({ title: '请填写发票抬头', icon: 'none' }); return;
      }
      if (normal.titleType === 'company' && (!normal.taxNumber || normal.taxNumber.trim().length < 15)) {
        wx.showToast({ title: '请填写正确的税号', icon: 'none' }); return;
      }
    } else {
      if (!special.title || special.title.trim().length < 2) {
        wx.showToast({ title: '请填写企业名称', icon: 'none' }); return;
      }
      if (!special.taxNumber || special.taxNumber.trim().length < 15) {
        wx.showToast({ title: '请填写正确的税号', icon: 'none' }); return;
      }
      if (!special.address) {
        wx.showToast({ title: '请填写注册地址', icon: 'none' }); return;
      }
      if (!special.phone || !/^1\d{10}$/.test(special.phone)) {
        wx.showToast({ title: '请填写正确的电话号码', icon: 'none' }); return;
      }
      if (!special.bankName) {
        wx.showToast({ title: '请填写开户银行', icon: 'none' }); return;
      }
      if (!special.bankAccount || special.bankAccount.length < 8) {
        wx.showToast({ title: '请填写正确的银行账号', icon: 'none' }); return;
      }
    }

    this.setData({ isSaving: true });

    let invoiceData = { type: invoiceType };
    if (invoiceType === 'normal') {
      invoiceData = { ...invoiceData, title: normal.title, titleType: normal.titleType, taxNumber: normal.taxNumber, email: normal.email };
    } else {
      invoiceData = { ...invoiceData, title: special.title, taxNumber: special.taxNumber, address: special.address, phone: special.phone, bankName: special.bankName, bankAccount: special.bankAccount };
    }

    try {
      wx.setStorageSync('invoiceInfo', invoiceData);
      wx.showToast({ title: '保存成功', icon: 'success' });
      this.setData({ isSaving: false });
      setTimeout(() => this.goBack(), 1200);
    } catch (e) {
      this.setData({ isSaving: false });
      wx.showToast({ title: '保存失败', icon: 'none' });
    }
  }
});
