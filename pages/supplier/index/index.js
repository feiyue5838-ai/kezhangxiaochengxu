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
  },

  onLoad() {
    const outletInfo = wx.getStorageSync('outletInfo');
    this.setData({ outletInfo: outletInfo || null });
    this.loadOrders(true);
  },

  onShow() {
    // 从详情页返回时刷新
    if (this._loaded) {
      this.loadOrders(true);
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

  goLogin() {
    wx.navigateTo({ url: '/pages/outlet-binding/index' });
  },
});
