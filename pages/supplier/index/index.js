// pages/supplier/index/index.js — 供应商工作台（订单列表）
const api = require('../../../utils/api.js');

const STATUS_TABS = [
  { key: 'pending', label: '待接单' },
  { key: 'accepted', label: '已接单' },
  { key: 'processing', label: '制作中' },
  { key: 'completed', label: '已完成' },
];

const STATUS_TEXT = {
  assigned: '待接单',
  accepted: '已接单',
  processing: '制作中',
  completed: '已完成',
  cancelled: '已取消',
};

Page({
  data: {
    tabs: STATUS_TABS,
    activeTab: 'pending',
    list: [],
    total: 0,
    page: 1,
    pageSize: 20,
    loading: false,
    finished: false,
    outletInfo: null,
    unreadCount: 0,
    // 订阅设置弹窗
    showSubscribe: false,
    subBound: false,
    subEnabled: true,
  },

  onLoad() {
    const outletInfo = wx.getStorageSync('outletInfo');
    this.setData({ outletInfo: outletInfo || null });
    this.loadOrders(true);
    this.loadUnread();
    this.loadSubscribeStatus();
  },

  onShow() {
    // 从详情页返回时刷新
    if (this._loaded) {
      this.loadOrders(true);
      this.loadUnread();
    }
    this._loaded = true;
  },

  onPullDownRefresh() {
    this.loadOrders(true).finally(() => wx.stopPullDownRefresh());
  },

  onReachBottom() {
    if (!this.data.finished && !this.data.loading) {
      this.loadOrders(false);
    }
  },

  onTabTap(e) {
    const key = e.currentTarget.dataset.key;
    if (key === this.data.activeTab) return;
    this.setData({ activeTab: key });
    this.loadOrders(true);
  },

  loadOrders(reset) {
    if (this.data.loading) return Promise.resolve();
    this.setData({ loading: true });
    const page = reset ? 1 : this.data.page + 1;
    return api.v2SupplierGetOrders({
      status: this.data.activeTab,
      page,
      pageSize: this.data.pageSize,
    })
      .then(res => {
        const list = (res && res.list) || [];
        const mapped = list.map(o => ({
          ...o,
          statusText: STATUS_TEXT[o.status] || o.status || '',
        }));
        this.setData({
          list: reset ? mapped : this.data.list.concat(mapped),
          total: (res && res.total) || 0,
          page,
          finished: mapped.length < this.data.pageSize,
        });
      })
      .catch(err => {
        console.error('加载订单失败', err);
        if (reset) this.setData({ list: [], finished: true });
      })
      .finally(() => this.setData({ loading: false }));
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/supplier/order-detail/index?id=${id}` });
  },

  goSettlements() {
    wx.navigateTo({ url: '/pages/supplier/settlements/index' });
  },

  // ============ 通知入口 ============

  loadUnread() {
    return api
      .v2SupplierGetNotifications({ page: 1, pageSize: 1 })
      .then(res => {
        this.setData({ unreadCount: (res && res.unread) || 0 });
      })
      .catch(() => {});
  },

  goNotifications() {
    wx.navigateTo({ url: '/pages/supplier/notifications/index' });
  },

  // ============ 订阅设置 ============

  loadSubscribeStatus() {
    return api
      .v2SupplierSubscribeStatus()
      .then(res => {
        this.setData({
          subBound: !!(res && res.bound),
          subEnabled: res ? res.enabled !== false : true,
        });
      })
      .catch(() => {});
  },

  onSubscribeTap() {
    this.loadSubscribeStatus().then(() => {
      this.setData({ showSubscribe: true });
    });
  },

  onSubscribeCancel() {
    this.setData({ showSubscribe: false });
  },

  noop() {},

  onBindOpenid() {
    wx.login({
      success: res => {
        if (!res.code) {
          wx.showToast({ title: '获取微信凭证失败', icon: 'none' });
          return;
        }
        api
          .v2SupplierBindOpenid(res.code)
          .then(() => {
            this.setData({ subBound: true, showSubscribe: false });
            wx.showToast({ title: '绑定成功', icon: 'success' });
          })
          .catch(err => {
            wx.showToast({ title: (err && err.message) || '绑定失败', icon: 'none' });
          });
      },
    });
  },

  onToggleSubscribe(e) {
    const enabled = e.detail.value;
    api
      .v2SupplierToggleSubscribe(enabled)
      .then(() => {
        this.setData({ subEnabled: enabled });
        wx.showToast({ title: enabled ? '已开启订阅' : '已关闭订阅', icon: 'none' });
      })
      .catch(() => wx.showToast({ title: '设置失败', icon: 'none' }));
  },

  goLogin() {
    wx.navigateTo({ url: '/pages/outlet-binding/index' });
  },
});
