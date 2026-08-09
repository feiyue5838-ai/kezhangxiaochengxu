// pages/newspaper/order/index.js
const api = require('../../../utils/api.js');

Page({
  data: {
    currentTab: 0,
    tabs: ['全部', '待支付', '进行中', '已完成'],
    orders: [],
    filteredOrders: [],
    loading: false
  },

  onShow() {
    if (this._loadingOrders) return;
    this.loadOrders();
  },

  goBack() {
    wx.navigateBack();
  },

  async loadOrders() {
    if (this._loadingOrders) return;
    this._loadingOrders = true;
    this.setData({ loading: true });
    try {
      const res = await api.getNewspaperOrderList({ page: 1, pageSize: 50 });
      const raw = (res && res.list) || [];
      const orders = raw.map(o => this._mapOrder(o));
      this.setData({ orders, loading: false, _loadingOrders: false });
      this._loadingOrders = false;
      this.filterOrders(this.data.currentTab);
    } catch (e) {
      this.setData({ orders: [], filteredOrders: [], loading: false, _loadingOrders: false });
      this._loadingOrders = false;
      wx.showToast({ title: '网络异常，请稍后重试', icon: 'none', duration: 2000 });
    }
  },

  _mapOrder(o) {
    const item = (o.orderItems && o.orderItems[0]) || {};
    const name = item.name || o.type || '登报订单';
    const desc = o.newspaperContent || name;
    return {
      id: o.id,
      orderNo: o.orderNo,
      title: name,
      desc: desc,
      date: this._formatDate(o.createdAt),
      status: o.status,
      statusText: o.statusText || this._statusText(o.status),
      totalPrice: o.totalPrice,
      issueCount: o.newspaperIssueCount || 0
    };
  },

  _statusText(s) {
    const map = { 1: '待支付', 2: '已支付', 3: '制作中', 4: '已发货', 5: '已完成', 6: '已取消', 7: '退款中', 8: '已退款' };
    return map[s] || '待支付';
  },

  _formatDate(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    if (isNaN(d.getTime())) return '';
    const p = n => (n < 10 ? '0' + n : '' + n);
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
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
      case 1: filtered = all.filter(o => o.status === 1); break;
      case 2: filtered = all.filter(o => [2, 3, 4].includes(o.status)); break;
      case 3: filtered = all.filter(o => o.status >= 5); break;
      default: filtered = all;
    }
    this.setData({ filteredOrders: filtered });
  },

  viewOrderDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/newspaper/order-detail/index?id=' + id });
  }
});
