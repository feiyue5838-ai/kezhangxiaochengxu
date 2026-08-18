// pages/seal-tab/index.js
const _common = require('../../utils/common.js');

Page({
  data: {
    categories: [
      { id: 1, name: '企业刻章', desc: '营业执照 + 法人身份证', iconSvg: '/assets/icons/icon-b64-25.svg', bgColor: 'rgba(74,140,255,0.10)', route: '/pages/seal/form/index?type=company' },
      { id: 2, name: '个人印章', desc: '姓名 + 身份证照片', iconSvg: '/assets/icons/icon-b64-26.svg', bgColor: 'rgba(250,140,22,0.10)', route: '/pages/seal/form/index?type=personal' },
      { id: 3, name: '电子印章', desc: '在线办理 即刻可用', iconSvg: '/assets/icons/icon-b64-27.svg', bgColor: 'rgba(114,46,209,0.10)', route: '/pages/seal/form/index?type=electronic' },
      { id: 4, name: '刻章备案查询', desc: '输入印章编码即可', iconSvg: '/assets/icons/icon-b64-28.svg', bgColor: 'rgba(19,194,194,0.10)', route: '/pages/seal/form/index?type=query' }
    ]
  },

  onLoad() {
    // 无需拆分数据，四宫格直接使用 categories
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 });
    }
  },

  goCategory(e) {
    const id = Number(e.currentTarget.dataset.id);
    const cat = this.data.categories.find(c => c.id === id);
    if (cat && cat.route) {
      wx.removeStorageSync('selectedSealsData');
      wx.removeStorageSync('sealOrderForm');
      wx.removeStorageSync('materialInfo');
      wx.removeStorageSync('deliveryAddress');
      wx.removeStorageSync('invoiceInfo');
      wx.removeStorageSync('orderRemark');
      wx.removeStorageSync('sealOrderPhone');
      wx.navigateTo({ url: cat.route });
    } else {
      wx.showToast({ title: '页面开发中', icon: 'none' });
    }
  }
});
