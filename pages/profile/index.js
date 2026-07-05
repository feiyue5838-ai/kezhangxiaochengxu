const common = require('../../utils/common.js');

Page({
  data: {
    userInfo: { nickName: '', phone: '' },
    orderTypes: [
      { id: 'pending',    name: '待支付',   iconSvg: '/assets/icons/icon-b64-13.svg', bgColor: '#FFF7E6', color: '#FAAD14', count: 0 },
      { id: 'processing', name: '进行中',   iconSvg: '/assets/icons/icon-b64-14.svg', bgColor: '#F0EBFF', color: '#7B5CFA', count: 0 },
      { id: 'completed',  name: '已完成',   iconSvg: '/assets/icons/icon-b64-15.svg', bgColor: '#F0FFF0', color: '#52C41A', count: 0 },
      { id: 'refund',     name: '退款/售后', iconSvg: '/assets/icons/icon-b64-16.svg', bgColor: '#FFF0E6', color: '#FA8C16', count: 0 }
    ],
    functions: [
      { id: 1, iconSvg: '/assets/icons/icon-b64-17.svg', name: '电子印章管理', bgColor: '#fff0e6' },
      { id: 2, iconSvg: '/assets/icons/icon-b64-18.svg', name: '发票管理', bgColor: 'rgba(74,140,255,0.08)' },
      { id: 3, iconSvg: '/assets/icons/icon-b64-19.svg', name: '地址管理', bgColor: '#fff7e6' },
      { id: 4, iconSvg: '/assets/icons/icon-b64-20.svg', name: '实名认证', bgColor: '#f6ffed' },
      { id: 5, iconSvg: '/assets/icons/icon-b64-21.svg', name: '消息通知', bgColor: '#f0e6ff' },
      { id: 6, iconSvg: '/assets/icons/icon-b64-22.svg', name: '帮助中心', bgColor: '#e6f0ff' },
      { id: 7, iconSvg: '/assets/icons/icon-b64-7.svg', name: '联系客服', bgColor: '#ffe6e6' },
      { id: 8, iconSvg: '/assets/icons/icon-b64-24.svg', name: '关于我们', bgColor: '#e6ffe6' }
    ]
  },

  onLoad() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) this.setData({ userInfo });
    this.refreshOrderCounts();
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 4 });
    }
    this.refreshOrderCounts();
  },

  // 从Storage统计各状态订单数
  refreshOrderCounts() {
    const statusIdx = { pending: 0, processing: 1, completed: 2, refund: 3 };
    const counts = [0, 0, 0, 0];
    const collect = (orders) => {
      if (!Array.isArray(orders)) return;
      orders.forEach(o => {
        const idx = statusIdx[o.status];
        if (idx !== undefined) counts[idx]++;
      });
    };
    collect(wx.getStorageSync('seal_orders'));
    collect(wx.getStorageSync('newspaper_orders'));
    collect(wx.getStorageSync('license_orders'));
    this.setData({
      'orderTypes[0].count': counts[0],
      'orderTypes[1].count': counts[1],
      'orderTypes[2].count': counts[2],
      'orderTypes[3].count': counts[3]
    });
  },

  // 点击订单统计 → 跳转到订单列表并筛选对应状态
  goToOrderList(e) {
    const type = e.currentTarget.dataset.type;
    const statusMap = { pending: 1, processing: 2, completed: 3, refund: 4 };
    const status = statusMap[type];
    wx.navigateTo({ url: '/pages/order/list/index?status=' + status });
  },

  // 全部订单
  goToOrders() {
    wx.navigateTo({ url: '/pages/order/list/index' });
  },

  onFuncTap(e) {
    const id = e.currentTarget.dataset.id;
    const map = {
      1: { title: '电子印章管理', url: '/pages/seal/index' },
      2: { title: '发票管理', url: '/pages/invoice/edit/index' },
      3: { title: '地址管理', url: '/pages/address/edit/index' },
      4: { title: '实名认证', url: '/pages/realname/index' },
      5: { title: '消息通知', url: '/pages/notification/index' },
      6: { title: '帮助中心', url: '/pages/help/index' },
      7: { title: '联系客服', url: '' },
      8: { title: '关于我们', url: '/pages/about/index' }
    };
    const item = map[id];
    if (!item) return;
    if (item.url) {
      wx.navigateTo({ url: item.url });
    } else {
      wx.showToast({ title: item.title + ' 暂未开放', icon: 'none' });
    }
  },

  onLoginTap() {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        const userInfo = res.userInfo;
        wx.setStorageSync('userInfo', userInfo);
        this.setData({ userInfo });
        wx.showToast({ title: '登录成功', icon: 'success' });
      },
      fail: () => { wx.showToast({ title: '已取消登录', icon: 'none' }); }
    });
  },

  callService() {
    wx.makePhoneCall({ phoneNumber: '4008886666', fail: () => { wx.showToast({ title: '拨打失败', icon: 'none' }); } });
  },

  onViewPrivacy() {
    wx.navigateTo({ url: '/pages/agreement/privacy/index' });
  },

  onViewTerms() {
    wx.navigateTo({ url: '/pages/agreement/terms/index' });
  },

  onContactService() {
    wx.makePhoneCall({ phoneNumber: '4008886666', fail: () => { wx.showToast({ title: '拨打失败', icon: 'none' }); } });
  },
});
