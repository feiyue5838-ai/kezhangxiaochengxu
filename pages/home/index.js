// pages/home/index.js
const app = getApp();
const common = require('../../utils/common.js');

// 状态映射
const STATUS_MAP = {
  pending: '待支付',
  processing: '进行中',
  completed: '已完成',
  cancelled: '已取消',
  refunded: '已退款'
};

Page({
  data: {
    statusBarHeight: 0,
    navHeight: 0,
    // 高精度 SVG 图标（base64 内联，兼容 iOS/Android）
    iconSealBg: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MiA1MiI+CiAgPHJlY3QgeD0iNCIgeT0iNCIgd2lkdGg9IjQ0IiBoZWlnaHQ9IjQ0IiByeD0iMTAiIGZpbGw9IiNGNUYwRkYiIHN0cm9rZT0iIzZDNUNFNyIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPHJlY3QgeD0iMTQiIHk9IjE2IiB3aWR0aD0iMjQiIGhlaWdodD0iMjIiIHJ4PSIzIiBmaWxsPSIjNkM1Q0U3Ii8+CiAgPHJlY3QgeD0iMTciIHk9IjIyIiB3aWR0aD0iMTgiIGhlaWdodD0iMTQiIHJ4PSIxLjUiIGZpbGw9IiNGNUYwRkYiIHN0cm9rZT0iIzVCM0ZFMCIgc3Ryb2tlLXdpZHRoPSIwLjYiLz4KICA8cGF0aCBkPSJNMjAgMjUgSDIyLjUgTTIxLjI1IDI1IFYyOSBNMjUgMjUuNSBWMjkgSDI3LjUgTTI1IDI3IEgyNyIgc3Ryb2tlPSIjNkM1Q0U3IiBzdHJva2Utd2lkdGg9IjEuNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CiAgPHBhdGggZD0iTTIyIDE2IFEyNiAxMiAzMCAxNiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNkM1Q0U3IiBzdHJva2Utd2lkdGg9IjIuMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CiAgPGxpbmUgeDE9IjE0IiB5MT0iMzciIHgyPSIzOCIgeTI9IjM3IiBzdHJva2U9IiM1QjNGRTAiIHN0cm9rZS13aWR0aD0iMS4yIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+',
    iconNewsBg: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MiA1MiI+PHJlY3QgeD0iNCIgeT0iNCIgd2lkdGg9IjQ0IiBoZWlnaHQ9IjQ0IiByeD0iMTAiIGZpbGw9IiNGMEY2RkYiIHN0cm9rZT0iIzA5ODRFMyIgc3Ryb2tlLXdpZHRoPSIyIi8+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTEsIDkpIiBmaWxsPSJub25lIiBzdHJva2U9IiMwOTg0RTMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTIgMiBMMjIgMiBMMzAgMTAgTDMwIDM0IEwyIDM0IFoiIHN0cm9rZS13aWR0aD0iMi4yIi8+PHBhdGggZD0iTTIyIDIgTDIyIDEwIEwzMCAxMCIgZmlsbD0iI0YwRjZGRiIgc3Ryb2tlLXdpZHRoPSIxLjIiLz48cmVjdCB4PSI1IiB5PSI2IiB3aWR0aD0iMTQiIGhlaWdodD0iMyIgcng9IjAuOCIgZmlsbD0iIzA5ODRFMyIgc3Ryb2tlPSJub25lIi8+PGxpbmUgeDE9IjIyIiB5MT0iNy41IiB4Mj0iMjYiIHkyPSI3LjUiIHN0cm9rZS13aWR0aD0iMS4zIiBvcGFjaXR5PSIwLjYiLz48bGluZSB4MT0iNiIgeTE9IjEzIiB4Mj0iMjYiIHkyPSIxMyIgc3Ryb2tlLXdpZHRoPSIxLjYiIG9wYWNpdHk9IjAuNyIvPjxsaW5lIHgxPSI2IiB5MT0iMTciIHgyPSIyMiIgeTI9IjE3IiBzdHJva2Utd2lkdGg9IjEuNiIgb3BhY2l0eT0iMC43Ii8+PGxpbmUgeDE9IjYiIHkxPSIyMSIgeDI9IjI2IiB5Mj0iMjEiIHN0cm9rZS13aWR0aD0iMS42IiBvcGFjaXR5PSIwLjciLz48bGluZSB4MT0iNiIgeTE9IjI1IiB4Mj0iMjAiIHkyPSIyNSIgc3Ryb2tlLXdpZHRoPSIxLjYiIG9wYWNpdHk9IjAuNyIvPjxsaW5lIHgxPSI2IiB5MT0iMjkiIHgyPSIyNiIgeTI9IjI5IiBzdHJva2Utd2lkdGg9IjEuNiIgb3BhY2l0eT0iMC43Ii8+PC9nPjwvc3ZnPg==',
    iconTrademarkBg: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MiA1MiI+PHJlY3QgeD0iNCIgeT0iNCIgd2lkdGg9IjQ0IiBoZWlnaHQ9IjQ0IiByeD0iMTAiIGZpbGw9IiNGMEZGRkUiIHN0cm9rZT0iIzAwQ0VDOSIgc3Ryb2tlLXdpZHRoPSIyIi8+PGNpcmNsZSBjeD0iMjYiIGN5PSIyNiIgcj0iMTIiIGZpbGw9IiMwMENFQzkiIHN0cm9rZT0ibm9uZSIvPjxnIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIyLjYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTIxIDE5IFYzMyIvPjxwYXRoIGQ9Ik0yMSAxOSBIMjYgYTMuNSAzLjUgMCAwIDEgMCA3IEgyMSIvPjxwYXRoIGQ9Ik0yNCAyNiBMMzAgMzMiLz48L2c+PC9zdmc+',
    features: [
      { id: 'f1', title: '同城速递', desc: '快速到手', iconSvg: '/assets/icons/icon-b64-3.svg' },
      { id: 'f2', title: '官方认证', desc: '正规合规', iconSvg: '/assets/icons/icon-b64-4.svg' },
      { id: 'f3', title: '全程代办', desc: '省心省力', iconSvg: '/assets/icons/icon-b64-5.svg' },
      { id: 'f4', title: '7×12h', desc: '在线服务', iconSvg: '/assets/icons/icon-b64-6.svg' }
    ],
    orders: [],
    loading: true,
    showPrivacyPopup: false
  },

  onLoad() {
    const app = getApp();
    const globalNav = app.globalData.navigationHeight;
    this.setData({
      statusBarHeight: globalNav.statusBarHeight,
      navHeight: globalNav.statusBarHeight + 64
    });

    // 隐私授权弹窗
    if (wx.getPrivacySetting) {
      wx.getPrivacySetting({
        success: (res) => {
          if (res.needAuthorization) {
            const authorized = wx.getStorageSync('privacyAuthorized');
            this.setData({ showPrivacyPopup: !authorized });
          }
        }
      });
    }
  },

  onShow() {
    this._ensureTabBar();
    this.loadOrders();
  },

  // 确保 tabBar 选中态在冷启动时也能正确设置
  _ensureTabBar() {
    if (typeof this.getTabBar !== 'function') return;
    const tabBar = this.getTabBar();
    if (tabBar) {
      tabBar.setData({ selected: 0 });
    } else {
      // 组件未就绪时延后重试
      setTimeout(() => {
        const tb = this.getTabBar && this.getTabBar();
        if (tb) tb.setData({ selected: 0 });
      }, 100);
    }
  },

  async loadOrders() {
    this.setData({ loading: true });
    const allOrders = [];

    try {
      const sealOrders = wx.getStorageSync('seal_orders') || [];
      allOrders.push(...sealOrders.map(o => ({ ...o, _type: '刻章' })));
    } catch (e) {}

    try {
      const newsOrders = wx.getStorageSync('newspaper_orders') || [];
      allOrders.push(...newsOrders.map(o => ({ ...o, _type: '登报' })));
    } catch (e) {}

    try {
      const licOrders = wx.getStorageSync('license_orders') || [];
      allOrders.push(...licOrders.map(o => ({ ...o, _type: '调档' })));
    } catch (e) {}

    allOrders.sort((a, b) => (b.createTime || b.createAt || 0) - (a.createTime || a.createAt || 0));
    const recent = allOrders.slice(0, 5).map(o => ({
      id: o.id,
      name: o.productName || o.title || o._type + '订单',
      date: o.createTime ? this._formatDate(o.createTime) : (o.date || ''),
      status: STATUS_MAP[o.status] || o.status || '进行中',
      type: o._type,
      statusKey: o.status
    }));

    this.setData({ orders: recent, loading: false });
  },

  _formatDate(timestamp) {
    if (!timestamp) return '';
    const d = new Date(timestamp);
    const m = d.getMonth() + 1;
    const day = d.getDate();
    return `${d.getFullYear()}-${m < 10 ? '0' + m : m}-${day < 10 ? '0' + day : day}`;
  },

  onOrderTap(e) {
    const type = e.currentTarget.dataset.type;
    const id = e.currentTarget.dataset.id;
    if (type === '登报') {
      wx.navigateTo({ url: `/pages/newspaper/order-detail?id=${id}` });
    } else if (type === '刻章') {
      wx.showToast({ title: '刻章订单详情开发中', icon: 'none' });
    } else if (type === '调档') {
      wx.showToast({ title: '调档订单详情开发中', icon: 'none' });
    }
  },

  goToPage(e) {
    const page = e.currentTarget.dataset.page;
    const pageMap = {
      'seal': '/pages/seal/index',
      'newspaper': '/pages/newspaper/index',
      'license': '/pages/license/index'
    };
    const url = pageMap[page];
    if (url) {
      wx.switchTab({ url: url });
    }
  },

  goToOrders() {
    wx.navigateTo({ url: '/pages/order/list/index' });
  }
});
