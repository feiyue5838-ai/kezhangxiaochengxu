// pages/supplier/notifications/index.js — 供应商通知中心
const api = require('../../../utils/api.js');

Page({
  data: {
    list: [],
    total: 0,
    page: 1,
    pageSize: 20,
    loading: false,
    finished: false,
    unreadOnly: false,
    outletInfo: null,
  },

  onLoad() {
    const outletInfo = wx.getStorageSync('outletInfo');
    this.setData({ outletInfo: outletInfo || null });
    this.loadNotifications(true);
  },

  onShow() {
    this.loadNotifications(true);
  },

  onPullDownRefresh() {
    this.loadNotifications(true).finally(() => wx.stopPullDownRefresh());
  },

  onReachBottom() {
    if (!this.data.finished && !this.data.loading) {
      this.loadNotifications(false);
    }
  },

  onUnreadToggle() {
    this.setData({ unreadOnly: !this.data.unreadOnly });
    this.loadNotifications(true);
  },

  loadNotifications(reset) {
    if (this.data.loading) return Promise.resolve();
    this.setData({ loading: true });
    const page = reset ? 1 : this.data.page + 1;
    return api
      .v2SupplierGetNotifications({
        page,
        pageSize: this.data.pageSize,
        unreadOnly: this.data.unreadOnly,
      })
      .then(res => {
        const list = (res && res.list) || [];
        this.setData({
          list: reset ? list : this.data.list.concat(list),
          total: (res && res.total) || 0,
          page,
          finished: list.length < this.data.pageSize,
        });
      })
      .catch(err => {
        console.error('加载通知失败', err);
        if (reset) this.setData({ list: [], finished: true });
      })
      .finally(() => this.setData({ loading: false }));
  },

  onItemTap(e) {
    const id = e.currentTarget.dataset.id;
    const item = this.data.list.find(n => n.id === id);
    if (!item || item.isRead) return;
    api
      .v2SupplierMarkNotificationRead(id)
      .then(() => {
        const list = this.data.list.map(n =>
          n.id === id ? { ...n, isRead: true } : n
        );
        this.setData({ list });
      })
      .catch(() => {});
  },

  onMarkAllRead() {
    api
      .v2SupplierMarkAllNotificationsRead()
      .then(() => {
        const list = this.data.list.map(n => ({ ...n, isRead: true }));
        this.setData({ list });
        wx.showToast({ title: '已全部标记为已读', icon: 'none' });
      })
      .catch(() => wx.showToast({ title: '操作失败', icon: 'none' }));
  },

  onDelete(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '删除通知',
      content: '确定删除这条通知吗？',
      success: res => {
        if (!res.confirm) return;
        api
          .v2SupplierDeleteNotification(id)
          .then(() => {
            this.setData({
              list: this.data.list.filter(n => n.id !== id),
              total: Math.max(0, this.data.total - 1),
            });
            wx.showToast({ title: '已删除', icon: 'none' });
          })
          .catch(() => wx.showToast({ title: '删除失败', icon: 'none' }));
      },
    });
  },

  goBack() {
    wx.navigateBack();
  },
});
