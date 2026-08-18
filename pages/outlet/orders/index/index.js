// pages/outlet/orders/index.js
const api = require('../../../../utils/api');

Page({
  data: {
    list: [],
    loading: true,
    empty: false,
    unreadCount: 0,
  },

  onLoad() {
    this.checkLoginAndFetch();
  },

  onShow() {
    this.checkLoginAndFetch();
  },

  async checkLoginAndFetch() {
    const outletToken = wx.getStorageSync('outletToken');
    const outletInfo = wx.getStorageSync('outletInfo');
    if (!outletToken || !outletInfo) {
      wx.redirectTo({ url: '/pages/outlet-binding/index' });
      return;
    }
    await Promise.all([
      this.fetchOrders(),
      this.fetchUnreadCount()
    ]);
  },

  async fetchOrders() {
    this.setData({ loading: true });
    try {
      const res = await api.getStoreOrders({});
      console.log('getStoreOrders', res);
      let list = [];
      if (Array.isArray(res)) {
        list = res;
      } else if (res && Array.isArray(res.list)) {
        list = res.list;
      } else if (res && res.data && Array.isArray(res.data.list)) {
        list = res.data.list;
      } else if (res && res.data && Array.isArray(res.data)) {
        list = res.data;
      }
      this.setData({ list, loading: false, empty: list.length === 0 });
    } catch (e) {
      console.error(e);
      wx.showToast({ title: e.message || '加载失败', icon: 'none' });
      this.setData({ loading: false, empty: true });
    }
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/outlet/order-detail/index/index?id=${id}` });
  },

  async fetchUnreadCount() {
    try {
      const res = await api.outletRequest({
        url: '/outlets/me/notifications',
        method: 'GET',
        data: { unreadOnly: true, pageSize: 1 },
      });
      this.setData({ unreadCount: res.pagination?.total || 0 });
    } catch (e) {
      console.error('获取未读数失败:', e);
    }
  },

  goToNotifications() {
    wx.navigateTo({ url: '/pages/outlet/notifications/index' });
  },

  onPullDownRefresh() {
    this.fetchOrders().then(() => wx.stopPullDownRefresh());
  },
});
