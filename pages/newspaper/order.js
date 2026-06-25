// pages/newspaper/order.js
const common = require('../../utils/common.js');
const STORAGE_KEY = 'newspaper_orders';

Page({
  data: {
    currentTab: 0,
    tabs: ['全部', '待支付', '进行中', '已完成'],
    orders: [],
    filteredOrders: [],
    emptyText: '暂无订单',
    statusBarHeight: 20,
    navHeight: 64
  },

  onLoad() {
    const { statusBarHeight, navHeight } = common.getNavigationHeight();
    this.setData({ statusBarHeight, navHeight });
  },

  onShow() {
    this.loadOrders();
  },

  goBack() {
    wx.navigateBack();
  },

  loadOrders() {
    try {
      const orders = wx.getStorageSync(STORAGE_KEY) || [];
      this.setData({ orders });
      this.filterOrders(this.data.currentTab);
    } catch (e) {
      this.setData({ orders: [], filteredOrders: [] });
    }
  },

  switchTab(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({ currentTab: index });
    this.filterOrders(index);
  },

  filterOrders(tabIndex) {
    const all = this.data.orders;
    let filtered = [];
    switch (tabIndex) {
      case 0: filtered = all; break;
      case 1: filtered = all.filter(o => o.status === 'pending'); break;
      case 2: filtered = all.filter(o => o.status === 'processing'); break;
      case 3: filtered = all.filter(o => o.status === 'completed'); break;
    }
    this.setData({ filteredOrders: filtered });
  },

  viewOrderDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/newspaper/order-detail?id=' + id });
  }
});
