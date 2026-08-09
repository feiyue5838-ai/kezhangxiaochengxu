// pages/home/index.js
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
    // 高精度 SVG 图标（base64 内联，兼容 iOS/Android）
    iconSealBg: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MiA1MiI+PHJlY3QgeD0iMiIgeT0iMiIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iMTAiIGZpbGw9IiNGNUYwRkYiIHN0cm9rZT0iIzZDNUNFNyIgc3Ryb2tlLXdpZHRoPSIyIi8+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMiwyKSBzY2FsZSgwLjA0Njg3NSkiIGZpbGw9IiM2QzVDRTciPjxwYXRoIGQ9Ik03OTUuNCA4MzYuN0gyMjguNmMtMjAuMyAwLTM2LjgtMTYuNi0zNi44LTM2LjggMC0yMC4zIDE2LjYtMzYuOCAzNi44LTM2LjhoNTY2LjljMjAuMyAwIDM2LjggMTYuNiAzNi44IDM2LjggMCAyMC4zLTE2LjYgMzYuOC0zNi45IDM2Ljh6Ii8+PHBhdGggZD0iTTgzMS44IDUwOC4zSDY0MC45Yy0wLjctMC4zLTEuNS0wLjUtMi4zLTAuNWgtMC4xYy0yNC45IDAtNDUtMjAuMi00NS00NSAwLTE0LjQgNi43LTI3LjEgMTcuMi0zNS40IDU2LjMtMzMuNiA5My45LTk1LjEgOTMuOS0xNjUuNSAwLTEwNi40LTg2LjMtMTkyLjctMTkyLjctMTkyLjdTMzE5LjMgMTU1LjUgMzE5LjMgMjYyYzAgNzAuMyAzNy43IDEzMS44IDk0IDE2NS41IDExLjIgOC4yIDE4LjUgMjEuNCAxOC41IDM2LjMgMCAyMi42LTE2LjcgNDEuNC0zOC40IDQ0LjVIMTkyLjJjLTE5LjggMC0zNiAxNi4yLTM2IDM2djEwNy44YzAgMTkuOCAxNi4yIDM2IDM2IDM2aDYzOS42YzE5LjggMCAzNi0xNi4yIDM2LTM2VjU0NC4zYzAtMTkuOC0xNi4yLTM2LTM2LTM2eiIvPjwvZz48L3N2Zz4=',
    iconNewsBg: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MiA1MiI+PHJlY3QgeD0iMiIgeT0iMiIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iMTAiIGZpbGw9IiNFRkY1RkYiIHN0cm9rZT0iIzA5ODRFMyIgc3Ryb2tlLXdpZHRoPSIyIi8+PGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDk4NEUzIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cmVjdCB4PSI5IiB5PSI5IiB3aWR0aD0iMzQiIGhlaWdodD0iMzQiIHJ4PSIyIi8+PHJlY3QgeD0iOSIgeT0iOSIgd2lkdGg9IjkiIGhlaWdodD0iMzQiIHJ4PSIxIi8+PHJlY3QgeD0iMjAiIHk9IjkiIHdpZHRoPSIyMyIgaGVpZ2h0PSI1Ii8+PGxpbmUgeDE9IjIwIiB5MT0iMTciIHgyPSI0MyIgeTI9IjE3Ii8+PGxpbmUgeDE9IjIwIiB5MT0iMjIiIHgyPSI0MyIgeTI9IjIyIi8+PGxpbmUgeDE9IjIwIiB5MT0iMjciIHgyPSI0MyIgeTI9IjI3Ii8+PGxpbmUgeDE9IjIwIiB5MT0iMzIiIHgyPSI0MyIgeTI9IjMyIi8+PGxpbmUgeDE9IjIwIiB5MT0iMzciIHgyPSI0MyIgeTI9IjM3Ii8+PC9nPjwvc3ZnPg==',
    iconBookkeepingBg: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MiA1MiI+PHJlY3QgeD0iNCIgeT0iNCIgd2lkdGg9IjQ0IiBoZWlnaHQ9IjQ0IiByeD0iMTAiIGZpbGw9IiNGRkY4RjAiIHN0cm9rZT0iI0ZGQTUwNyIgc3Ryb2tlLXdpZHRoPSIyIi8+PHJlY3QgeD0iMTIiIHk9IjE0IiB3aWR0aD0iMjgiIGhlaWdodD0iMjQiIHJ4PSIyIiBmaWxsPSJub25lIiBzdHJva2U9IiNGRkE1MDciIHN0cm9rZS13aWR0aD0iMiIvPjxsaW5lIHgxPSIxNiIgeTE9IjIwIiB4Mj0iMzYiIHkyPSIyMCIgc3Ryb2tlPSIjRkZBNTA3IiBzdHJva2Utd2lkdGg9IjIiLz48bGluZSB4MT0iMTYiIHkxPSIyNiIgeDI9IjMyIiB5Mj0iMjYiIHN0cm9rZT0iI0ZGQTUwNyIgc3Ryb2tlLXdpZHRoPSIyIi8+PGxpbmUgeDE9IjE2IiB5MT0iMzIiIHgyPSIyOCIgeTI9IjMyIiBzdHJva2U9IiNGRkE1MDciIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==',
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
      wx.navigateTo({ url: `/pages/newspaper/order-detail/index?id=${id}` });
    } else if (type === '刻章') {
      wx.navigateTo({ url: `/pages/seal/order-detail/index?id=${id}` });
    } else if (type === '调档') {
      wx.showToast({ title: '调档订单详情开发中', icon: 'none' });
    }
  },

  goToPage(e) {
    const page = e.currentTarget.dataset.page;
    const pageMap = {
      'seal': '/pages/seal-tab/index',
      'newspaper': '/pages/newspaper-tab/index',
      'bookkeeping': '/pages/bookkeeping-tab/index'
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
