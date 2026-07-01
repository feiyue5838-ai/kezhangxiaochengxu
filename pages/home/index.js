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
    iconSealBg: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MiA1MiI+PHJlY3QgeD0iOSIgeT0iMTQiIHdpZHRoPSIzNCIgaGVpZ2h0PSIyNCIgcng9IjYiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzVCNkZFOCIgc3Ryb2tlLXdpZHRoPSIyLjIiLz48cmVjdCB4PSIxMyIgeT0iMTgiIHdpZHRoPSIyNiIgaGVpZ2h0PSIxNiIgcng9IjQiIGZpbGw9IiNFRUYxRkYiIHN0cm9rZT0iIzVCNkZFOCIgc3Ryb2tlLXdpZHRoPSIxLjIiLz48cG9seWdvbiBwb2ludHM9IjI2LDIwIDI4LDIzLjUgMzIsMjMuNSAyOSwyNiAzMCwzMCAyNiwyNy41IDIyLDMwIDIzLDI2IDIwLDIzLjUgMjQsMjMuNSIgZmlsbD0iIzVCNkZFOCIvPjxwYXRoIGQ9Ik0xOCAzMCBDMjIgMzMgMzAgMzMgMzQgMzAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzVCNkZFOCIgc3Ryb2tlLXdpZHRoPSIxLjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjwvc3ZnPg==',
    iconNewsBg: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MiA1MiI+PHBhdGggZD0iTTEyIDEwIEwzMCAxMCBMNDAgMjAgTDQwIDQyIEwxMiA0MiBaIiBmaWxsPSJub25lIiBzdHJva2U9IiM1QjZGRTgiIHN0cm9rZS13aWR0aD0iMi4yIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTMwIDEwIEwzMCAyMCBMNDAgMjAiIGZpbGw9IiNFRUYxRkYiIHN0cm9rZT0iIzVCNkZFOCIgc3Ryb2tlLXdpZHRoPSIxLjIiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48bGluZSB4MT0iMTciIHkxPSIyNCIgeDI9IjM0IiB5Mj0iMjQiIHN0cm9rZT0iIzVCNkZFOCIgc3Ryb2tlLXdpZHRoPSIyLjgiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxsaW5lIHgxPSIxNyIgeTE9IjMwIiB4Mj0iMzQiIHkyPSIzMCIgc3Ryb2tlPSIjNUI2RkU4IiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBvcGFjaXR5PSIwLjYiLz48bGluZSB4MT0iMTciIHkxPSIzNCIgeDI9IjMwIiB5Mj0iMzQiIHN0cm9rZT0iIzVCNkZFOCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgb3BhY2l0eT0iMC42Ii8+PGxpbmUgeDE9IjE3IiB5MT0iMzgiIHgyPSIyNiIgeTI9IjM4IiBzdHJva2U9IiM1QjZGRTgiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIG9wYWNpdHk9IjAuNiIvPjwvc3ZnPg==',
    iconTrademarkBg: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MiA1MiI+PHBhdGggZD0iTTI2IDcgTDQ0IDE3IEw0NCAzMCBDNDQgMzggMjYgNDYgMjYgNDYgQzI2IDQ2IDggMzggOCAzMCBMOCAxNyBaIiBmaWxsPSJub25lIiBzdHJva2U9IiM1QjZGRTgiIHN0cm9rZS13aWR0aD0iMi4yIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTI2IDEyIEwzOSAxOSBMMzkgMjkgQzM5IDM1IDI2IDQxIDI2IDQxIEMyNiA0MSAxMyAzNSAxMyAyOSBMMTMgMTkgWiIgZmlsbD0iI0VFRjFGRiIgc3Ryb2tlPSIjNUI2RkU4IiBzdHJva2Utd2lkdGg9IjEuMCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwb2x5Z29uIHBvaW50cz0iMjYsMTkgMjcuOCwyMi41IDMxLjUsMjIuNSAyOC44LDI1IDI5LjgsMjguNSAyNiwyNiAyMi4yLDI4LjUgMjMuMiwyNSAyMC41LDIyLjUgMjQuMiwyMi41IiBmaWxsPSIjNUI2RkU4Ii8+PC9zdmc+',
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
