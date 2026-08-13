const common = require('../../../utils/common.js');
const api = require('../../../utils/api.js');
const auth = require('../../../utils/auth.js');

// 刻章订单数字 status �?字符�?status（用�?Tab 过滤，与 localStorage 格式对齐�?const sealStatusMap = {
  1: 'pending',    // 待支�?  2: 'paid',       // 已支付（待发货）
  3: 'paid',       // 制作�?�?待发�?  4: 'shipped',    // 已发货（待收货）
  5: 'completed',  // 已完成（待评价）
  6: 'cancelled',  // 已取�?  7: 'refund',     // 售后�?  8: 'refund',     // 退款中
  9: 'refund',     // 已退�?};

// 状态文本映射（淘宝样式�?const statusText = (status) => {
  const map = {
    pending: '待付�?,
    paid: '待发�?,
    shipped: '待收�?,
    completed: '待评�?,
    cancelled: '已取�?,
    refund: '退�?售后',
    aftersale: '售后�?,
    refunding: '退款中',
    refunded: '已退�?
  };
  return map[status] || '未知';
};

// 将不同模块的订单数据统一格式
const normalize = (orders, module) => {
  if (!Array.isArray(orders)) return [];
  return orders.map(o => {
    if (module === 'newspaper') {
      const strStatus = sealStatusMap[o.status] || 'pending';
      return {
        id: o.id,
        module: 'newspaper',
        type: (o.type && o.type.trim()) ? o.type : '登报服务',
        desc: o.desc || o.productName || '',
        date: o.date || o.createTime || '',
        status: strStatus,
        statusText: o.statusText || statusText(strStatus),
        statusClass: strStatus,
        price: o.price || 0,
        url: '/pages/newspaper/order-detail/index?id=' + o.id
      };
    }
    if (module === 'seal') {
      const strStatus = sealStatusMap[o.status] || 'pending';
      return {
        id: o.id,
        module: 'seal',
        type: '在线刻章',
        desc: o.productName || o.sealName || '',
        date: o.createTime || o.date || '',
        status: strStatus,
        statusText: o.statusText || statusText(strStatus),
        statusClass: strStatus,
        price: o.price || 0,
        url: '/pages/seal/order-detail/index?id=' + o.id
      };
    }
    return o;
  });
};

Page({
  data: {
    tabs: [
      { name: '全部', status: 'all' },
      { name: '待付�?, status: 'pending' },
      { name: '待发�?, status: 'paid' },
      { name: '待收�?, status: 'shipped' },
      { name: '待评�?, status: 'completed' },
      { name: '退�?售后', status: 'refund' }
    ],
    currentTab: 0,
    _version: '6tabs-fix',
    list: [],       // 当前显示的列�?    allList: [],    // 全部订单
    loading: false,
    needLogin: false,
  },

  onLoad(opt) {
    if (opt.status) {
      const idx = this.data.tabs.findIndex(t => t.status === opt.status);
      if (idx >= 0) this.setData({ currentTab: idx });
    }
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 4 });
    }
    this.loadOrders();
  },

  // 切换 Tab
  switchTab(e) {
    const idx = e.currentTarget.dataset.idx;
    this.setData({ currentTab: idx });
    this.filterList();
  },

  // 加载全部订单
  async loadOrders() {
    if (this._loadingOrders) return;
    this._loadingOrders = true;
    if (!auth.isLogin()) {
      this.setData({ loading: false, needLogin: true, allList: [], list: [] });
      this._loadingOrders = false;
      return;
    }
    this.setData({ loading: true, needLogin: false });

    const newspaperOrders = wx.getStorageSync('newspaper_orders') || [];
    const localSealOrders = wx.getStorageSync('seal_orders') || [];
    let all = [];
    let apiFailed = false;

    // 拉取刻章订单
    try {
      const res = await api.getSealOrderList({ pageSize: 200 });
      const apiOrders = (res && res.list) ? res.list.map(o => {
        const strStatus = sealStatusMap[o.status] || 'pending';
        return {
          id: o.id,
          module: 'seal',
          type: '在线刻章',
          desc: o.orderItems && o.orderItems.length > 0
            ? o.orderItems.map(i => i.seal ? i.seal.name : '').filter(Boolean).join('�?)
            : (o.companyName || ''),
          date: o.createdAt ? o.createdAt.split('T')[0] : '',
          createTime: o.createdAt ? o.createdAt.replace('T', ' ').substring(0, 16) : '',
          status: strStatus,
          statusText: o.statusText || statusText(strStatus),
          statusClass: strStatus,
          price: Number(o.totalPrice) || 0,
          expressNo: o.expressNo || '',
          expressCompany: o.expressCompany || '',
          url: '/pages/seal/order-detail/index?id=' + o.id
        };
      }) : [];
      const localPendingSeal = localSealOrders.filter(o => String(o.id).startsWith('SEAL_'));
      const seen = new Set(apiOrders.map(o => o.id));
      const merged = [
        ...localPendingSeal,
        ...apiOrders,
        ...localSealOrders.filter(o => !seen.has(o.id) && !String(o.id).startsWith('SEAL_'))
      ];
      all = [...normalize(newspaperOrders, 'newspaper'), ...normalize(merged, 'seal')];
    } catch (e) {
      apiFailed = true;
      all = [...normalize(newspaperOrders, 'newspaper'), ...normalize(localSealOrders, 'seal')];
    }

    // 拉取代理记账订单
    try {
      const bkRes = await api.getBookkeepingOrderList({ pageSize: 200 });
      const bkOrders = (bkRes && bkRes.list) ? bkRes.list.map(o => {
        const strStatus = sealStatusMap[o.status] || 'pending';
        return {
          id: o.id,
          module: 'bookkeeping',
          type: '代理记账',
          desc: '专业财税服务',
          date: o.createdAt ? o.createdAt.split('T')[0] : '',
          createTime: o.createdAt ? o.createdAt.replace('T', ' ').substring(0, 16) : '',
          status: strStatus,
          statusText: o.statusText || statusText(strStatus),
          statusClass: strStatus,
          price: Number(o.totalPrice) || 0,
          url: '/pages/bookkeeping/order-detail/index?id=' + o.id
        };
      }) : [];
      all.push(...bkOrders);
    } catch (e) { /* 忽略 */ }

    all.sort((a, b) => (b.createTime || b.date || '').localeCompare(a.createTime || a.date || ''));
    this.setData({ allList: all });
    this.filterList();
    this.setData({ loading: false });
    this._loadingOrders = false;
    if (apiFailed) wx.showToast({ title: '网络异常，已显示本地数据', icon: 'none', duration: 2000 });
  },

  // 根据 Tab 过滤
  filterList() {
    const { allList, currentTab, tabs } = this.data;
    const status = tabs[currentTab].status;
    if (status === 'all') {
      this.setData({ list: allList });
    } else if (status === 'refund') {
      // 退�?售后 Tab：显示所有售后相关状�?      this.setData({ list: allList.filter(o => ['refund', 'refunded', 'cancelled'].includes(o.status)) });
    } else {
      this.setData({ list: allList.filter(o => o.status === status) });
    }
  },

  // 跳转详情
  goToDetail(e) {
    const { id, module } = e.currentTarget.dataset;
    const urls = { seal: '/pages/seal/order-detail/index', newspaper: '/pages/newspaper/order-detail/index', bookkeeping: '/pages/bookkeeping/order-detail/index' };
    wx.navigateTo({ url: (urls[module] || urls.newspaper) + '?id=' + id });
  },

  // 取消订单
  onCancelOrder(e) {
    const { id, module } = e.currentTarget.dataset;
    wx.showModal({
      title: '提示', content: '确定取消此订单吗�?,
      success: (res) => {
        if (!res.confirm) return;
        wx.showLoading({ title: '取消�? });
        const cancelApi = module === 'seal' ? api.cancelSealOrder : module === 'bookkeeping' ? api.cancelBookkeepingOrder : api.cancelNewspaperOrder;
        cancelApi(id).then(() => {
          wx.hideLoading();
          wx.showToast({ title: '已取�?, icon: 'success' });
          this.updateLocalOrder(id, module, 'cancelled', '已取�?, 'cancelled');
        }).catch(() => { wx.hideLoading(); wx.showToast({ title: '取消失败', icon: 'none' }); });
      }
    });
  },

  // 查看物流（跳物流详情页）
  onViewLogistics(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: '/pages/order/logistics/index?id=' + id });
  },

  // 确认收货（调用后�?4�?�?  onConfirmReceive(e) {
    const { id, module } = e.currentTarget.dataset;
    wx.showModal({
      title: '确认收货', content: '请确认您已收到货物且无异议？',
      confirmColor: '#52C41A',
      success: (res) => {
        if (!res.confirm) return;
        wx.showLoading({ title: '确认�?..' });
        const api = require('../../../utils/api');
        api.confirmReceive(id).then(() => {
          wx.hideLoading();
          wx.showToast({ title: '已确认收�?, icon: 'success' });
          this.updateLocalOrder(id, module, 'completed', '待评�?, 'completed');
        }).catch(() => {
          wx.hideLoading();
          wx.showToast({ title: '确认失败，请重试', icon: 'none' });
        });
      }
    });
  },

  // 去评价（按模块跳转）
  onRateOrder(e) {
    const { id, module } = e.currentTarget.dataset;
    const order = this.data.allList.find(o => o.id === id);
    if (order) wx.setStorageSync('orderToRate', order);
    if (module === 'seal') {
      wx.navigateTo({ url: '/pages/seal/review-submit/index?orderId=' + id });
    } else {
      wx.navigateTo({ url: '/pages/order/rate/index?id=' + id + '&module=' + module });
    }
  },

  // 申请售后
  onApplyAftersale(e) {
    const { id, module } = e.currentTarget.dataset;
    const key = module === 'seal' ? 'seal_orders' : (module === 'newspaper' ? 'newspaper_orders' : null);
    if (key) {
      const orders = wx.getStorageSync(key) || [];
      const order = orders.find(o => o.id === id);
      if (order) wx.setStorageSync('aftersaleCurrent', order);
    }
    wx.navigateTo({ url: '/pages/aftersale/apply/index?orderId=' + id + '&module=' + module });
  },

  // 删除订单
  onDeleteOrder(e) {
    const { id, module } = e.currentTarget.dataset;
    wx.showModal({
      title: '删除订单', content: '确定删除？删除后不可恢复',
      confirmColor: '#FF4D4F',
      success: (res) => {
        if (res.confirm) {
          const key = module === 'seal' ? 'seal_orders' : (module === 'newspaper' ? 'newspaper_orders' : null);
          if (key) {
            const orders = wx.getStorageSync(key) || [];
            wx.setStorageSync(key, orders.filter(o => o.id !== id));
          }
          this.loadOrders();
          wx.showToast({ title: '已删�?, icon: 'success' });
        }
      }
    });
  },

  // 本地更新订单状态并刷新列表
  updateLocalOrder(id, module, status, statusText, statusClass) {
    const key = module === 'seal' ? 'seal_orders' : (module === 'newspaper' ? 'newspaper_orders' : null);
    if (key) {
      const orders = wx.getStorageSync(key) || [];
      orders.forEach(o => { if (o.id === id) { o.status = status; o.statusText = statusText; o.statusClass = statusClass; } });
      wx.setStorageSync(key, orders);
    }
    this.loadOrders();
  },

  goLogin() {
    wx.navigateTo({ url: '/pages/auth/index' });
  },

  goBack() {
    wx.navigateBack();
  },
});

