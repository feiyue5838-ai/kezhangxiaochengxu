const common = require('../../../utils/common.js');

// 将不同模块的订单数据统一格式
const normalize = (orders, module) => {
  if (!Array.isArray(orders)) return [];
  return orders.map(o => {
    // 登报订单
    if (module === 'newspaper') {
      return {
        id: o.id,
        module: 'newspaper',
        type: o.type || '登报',
        desc: o.desc || o.productName || '',
        date: o.date || o.createTime || '',
        status: o.status || 'pending',
        statusText: o.statusText || statusText(o.status),
        url: '/pages/newspaper/order-detail?id=' + o.id
      };
    }
    // 刻章订单
    if (module === 'seal') {
      return {
        id: o.id,
        module: 'seal',
        type: '在线刻章',
        desc: o.productName || o.sealName || '',
        date: o.createTime || '',
        status: o.status || 'pending',
        statusText: statusText(o.status),
        url: '/pages/seal/order-confirm/index?id=' + o.id
      };
    }
    // 证照订单
    if (module === 'license') {
      return {
        id: o.id,
        module: 'license',
        type: '调档服务',
        desc: o.productName || '',
        date: o.createTime || '',
        status: o.status || 'pending',
        statusText: statusText(o.status),
        url: '/pages/license/index?id=' + o.id
      };
    }
    return { ...o, module, statusText: statusText(o.status) };
  });
};

const statusText = (s) => {
  const map = {
    pending: '待支付',
    processing: '进行中',
    completed: '已完成',
    refund: '退款/售后',
    cancelled: '已取消'
  };
  return map[s] || '未知';
};

const statusClass = (s) => {
  const map = {
    pending: 'pending',
    processing: 'processing',
    completed: 'completed',
    refund: 'refund',
    cancelled: 'cancelled'
  };
  return map[s] || 'cancelled';
};

Page({
  data: {
    statusBarHeight: 0,
    navHeight: 0,
    activeTab: 0,  // 0=全部 1=待支付 2=进行中 3=已完成 4=售后
    tabs: ['全部', '待支付', '进行中', '已完成', '售后'],
    orders: [],
    allOrders: []
  },

  onLoad(opt) {
    const statusBarHeight = common.getNavigationHeight().statusBarHeight;
    const navHeight = statusBarHeight + 64;
    this.setData({ statusBarHeight, navHeight });
    // 有status参数时自动切换tab
    if (opt && opt.status !== undefined) {
      const tab = parseInt(opt.status);
      if (tab >= 0 && tab <= 4) this.setData({ activeTab: tab });
    }
    this.loadOrders();
  },

  onShow() {
    this.loadOrders();
  },

  loadOrders() {
    const all = [
      ...normalize(wx.getStorageSync('seal_orders') || [], 'seal'),
      ...normalize(wx.getStorageSync('newspaper_orders') || [], 'newspaper'),
      ...normalize(wx.getStorageSync('license_orders') || [], 'license')
    ];
    // 按时间倒序
    all.sort((a, b) => {
      const ta = new Date(a.date).getTime() || 0;
      const tb = new Date(b.date).getTime() || 0;
      return tb - ta;
    });
    // 加上样式class
    all.forEach(o => { o.statusClass = statusClass(o.status); });
    this.setData({ allOrders: all });
    this.filterOrders();
  },

  switchTab(e) {
    const idx = parseInt(e.currentTarget.dataset.index);
    // 售后Tab → 跳转售后列表页
    if (idx === 4) {
      wx.navigateTo({ url: '/pages/aftersale/list/index' });
      return;
    }
    this.setData({ activeTab: idx });
    this.filterOrders();
  },

  filterOrders() {
    const { activeTab, allOrders } = this.data;
    const statusMap = [null, 'pending', 'processing', 'completed', 'refund'];  // 4=售后（显示退款）
    const targetStatus = statusMap[activeTab];
    const filtered = targetStatus
      ? allOrders.filter(o => o.status === targetStatus)
      : allOrders;
    this.setData({ orders: filtered });
  },

  viewOrder(e) {
    const order = e.currentTarget.dataset.order;
    if (!order) return;
    // 有详情页URL则跳转
    if (order.url) {
      wx.navigateTo({ url: order.url });
    } else {
      wx.showToast({ title: '订单详情开发中', icon: 'none' });
    }
  },

  goReview(e) {
    const order = e.currentTarget.dataset.order;
    if (!order) return;
    wx.navigateTo({ url: '/pages/seal/reviews/index' });
  },

  goAftersale(e) {
    const order = e.currentTarget.dataset.order;
    if (!order) return;
    // 把订单信息存入Storage，表单页读取
    wx.setStorageSync('aftersale_order', order);
    wx.navigateTo({ url: '/pages/aftersale/apply/index' });
  },

  goBack() {
    wx.navigateBack();
  },

  goToHome() {
    wx.switchTab({ url: '/pages/home/index' });
  },

});
