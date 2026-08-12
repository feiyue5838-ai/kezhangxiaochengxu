const common = require('../../../utils/common.js');
const api = require('../../../utils/api.js');
const auth = require('../../../utils/auth.js');

// 刻章订单数字 status → 字符串 status（用于 Tab 过滤，与 localStorage 格式对齐）
const sealStatusMap = {
  1: 'pending',    // 待支付
  2: 'processing', // 已支付（制作中）
  3: 'processing', // 制作中
  4: 'completed',  // 已发货 → 并入已完成
  5: 'completed',  // 已完成
  6: 'cancelled',  // 已取消
  7: 'cancelled',  // 退款中 → 并入已取消
  8: 'cancelled',  // 已退款 → 并入已取消
};

// 状态文本映射
const statusText = (status) => {
  const map = {
    pending: '待支付',
    processing: '进行中',
    completed: '已完成',
    cancelled: '已取消',
    refund: '退款',
    aftersale: '售后中',
    refunding: '退款中',
    refunded: '已退款'
  };
  return map[status] || '未知';
};

// 将不同模块的订单数据统一格式
const normalize = (orders, module) => {
  if (!Array.isArray(orders)) return [];
  return orders.map(o => {
    // 登报订单
    if (module === 'newspaper') {
      return {
        id: o.id,
        module: 'newspaper',
        type: (o.type && o.type.trim()) ? o.type : '登报服务',
        desc: o.desc || o.productName || '',
        date: o.date || o.createTime || '',
        status: o.status || 'pending',
        statusText: o.statusText || statusText(o.status),
        statusClass: o.statusClass || o.status,
        price: o.price || 0,
        url: '/pages/newspaper/order-detail/index?id=' + o.id
      };
    }
    // 刻章订单
    if (module === 'seal') {
      return {
        id: o.id,
        module: 'seal',
        type: '在线刻章',
        desc: o.productName || o.sealName || '',
        date: o.createTime || o.date || '',
        status: o.status || 'pending',
        statusText: o.statusText || statusText(o.status),
        statusClass: o.statusClass || o.status,
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
      { name: '待支付', status: 'pending' },
      { name: '进行中', status: 'processing' },
      { name: '已完成', status: 'completed' },
      { name: '已取消/退款', status: 'cancelled' }  // 包含 cancelled + refunded
    ],
    currentTab: 0,
    list: [],      // 当前显示的列表
    allList: [],   // 全部订单
    loading: true,
    needLogin: false  // 未登录时显示登录引导
  },

  onLoad: function (options) {
    const tab = parseInt(options.status) || 0;
    this.setData({ currentTab: tab });
  },

  goBack: function () {
    wx.navigateBack({ delta: 1, fail: () => {
      // 页面栈为空（直接打开），跳到首页
      wx.switchTab({ url: '/pages/home/index' });
    }});
  },

  onShow: function () {
    // 防止页面未就绪或正在加载时重复触发
    if (this._loadingOrders) return;
    this.loadOrders();
  },

  goLogin: function () {
    wx.navigateTo({ url: '/pages/auth/index' });
  },

  // 切换 Tab
  switchTab: function (e) {
    const idx = e.currentTarget.dataset.idx;
    this.setData({ currentTab: idx });
    this.filterList();
  },

  // 加载订单：本地登报/刻章兜底 + 后端真实订单（含代理记账）
  loadOrders: async function () {
    if (this._loadingOrders) return;
    this._loadingOrders = true;
    // 登录态检查：未登录不调用需鉴权的订单接口，避免触发全局 401 跳转
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
    try {
      const res = await api.getSealOrderList({ pageSize: 200 });
      const apiOrders = (res && res.list) ? res.list.map(o => {
        const strStatus = sealStatusMap[o.status] || 'pending';
        return {
          id: o.id,
          module: 'seal',
          type: '在线刻章',
          desc: o.orderItems && o.orderItems.length > 0
            ? o.orderItems.map(i => i.seal ? i.seal.name : '').filter(Boolean).join('、')
            : (o.companyName || ''),
          date: o.createdAt ? o.createdAt.split('T')[0] : '',
          createTime: o.createdAt ? o.createdAt.replace('T', ' ').substring(0, 16) : '',
          status: strStatus,
          statusText: o.statusText || statusText(strStatus),
          statusClass: strStatus,
          price: Number(o.totalPrice) || 0,
          url: '/pages/seal/order-detail/index?id=' + o.id
        };
      }) : [];
      const localPendingSeal = localSealOrders.filter(o => String(o.id).startsWith('SEAL_'));
      const seen = new Set(apiOrders.map(o => o.id));
      const mergedSealOrders = [
        ...localPendingSeal,
        ...apiOrders,
        ...localSealOrders.filter(o => !seen.has(o.id) && !String(o.id).startsWith('SEAL_'))
      ];
      all = [
        ...normalize(newspaperOrders, 'newspaper'),
        ...mergedSealOrders
      ];
    } catch (e) {
      apiFailed = true;
      console.warn('[order-list] getSealOrderList failed, using local storage:', e);
      all = [
        ...normalize(newspaperOrders, 'newspaper'),
        ...normalize(localSealOrders, 'seal')
      ];
    }
    // 拉取代理记账订单（后端，module=bookkeeping）
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
    } catch (e) {
      console.warn('[order-list] getBookkeepingOrderList failed:', e);
    }
    all.sort((a, b) => {
      // U-07: 使用 createTime（含时分）排序，没有则用 date
      const da = a.createTime || a.date || '';
      const db = b.createTime || b.date || '';
      return db.localeCompare(da);
    });
    this.setData({ allList: all });
    this.filterList();
    this.setData({ loading: false, _loadingOrders: false });
    this._loadingOrders = false;
    if (apiFailed) {
      wx.showToast({ title: '网络异常，已显示本地数据', icon: 'none', duration: 2000 });
    }
  },

  // 根据当前 Tab 过滤列表
  filterList: function () {
    const { allList, currentTab, tabs } = this.data;
    const status = tabs[currentTab].status;

    if (status === 'all') {
      this.setData({ list: allList });
    } else if (status === 'cancelled') {
      // 已取消 Tab 同时匹配 cancelled 和 refunded
      this.setData({
        list: allList.filter(o => o.status === 'cancelled' || o.status === 'refunded')
      });
    } else {
      this.setData({
        list: allList.filter(o => o.status === status)
      });
    }
  },

  // 跳转到订单详情
  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    const module = e.currentTarget.dataset.module || 'newspaper';
    if (module === 'seal') {
      wx.navigateTo({ url: '/pages/seal/order-detail/index?id=' + id });
    } else if (module === 'bookkeeping') {
      wx.navigateTo({ url: '/pages/bookkeeping/order-detail/index?id=' + id });
    } else {
      wx.navigateTo({ url: '/pages/newspaper/order-detail/index?id=' + id });
    }
  },

  // 快捷操作：取消订单
  onCancelOrder(e) {
    const id = e.currentTarget.dataset.id;
    const module = e.currentTarget.dataset.module;
    wx.showModal({
      title: '提示',
      content: '确定取消此订单吗？',
      success: (res) => {
        if (!res.confirm) return;
        wx.showLoading({ title: '取消中' });
        // 根据模块调用对应的后端取消接口（统一 /api/orders/:id/cancel）
        const cancelApi = module === 'seal' ? api.cancelSealOrder
          : module === 'bookkeeping' ? api.cancelBookkeepingOrder
          : api.cancelNewspaperOrder;
        cancelApi(id).then(() => {
          wx.hideLoading();
          wx.showToast({ title: '已取消', icon: 'success' });
          // 后端取消成功后同步本地展示
          this.updateOrder(id, module, 'cancelled', '已取消', 'cancelled');
        }).catch((err) => {
          wx.hideLoading();
          console.error('[order/list] 取消订单失败:', err);
          wx.showToast({ title: '取消失败，请重试', icon: 'none' });
        });
      }
    });
  },

  // 快捷操作：立即支付 — 跳转到对应详情页处理真实支付
  onPayOrder(e) {
    // 已由 navigator 组件处理，保留方法防止意外调用兜底
  },

  // 快捷操作：确认完成 — 订单状态由系统后端驱动，用户无需手动操作
  onCompleteOrder(e) {
    // 已由系统自动推进，保留方法防止意外调用兜底
  },

  // 更新订单状态（本地存储）
  updateOrder(id, module, status, statusText, statusClass) {
    try {
      const key = module === 'seal' ? 'seal_orders' : 'newspaper_orders';
      const orders = wx.getStorageSync(key) || [];
      let found = false;
      for (let i = 0; i < orders.length; i++) {
        if (orders[i].id === id) {
          orders[i].status = status;
          orders[i].statusText = statusText;
          orders[i].statusClass = statusClass;
          found = true;
          break;
        }
      }
      if (found) {
        wx.setStorageSync(key, orders);
        this.loadOrders(); // 刷新列表
      }
    } catch (e) {
      wx.showToast({ title: '操作失败', icon: 'none' });
    }
  },

  // 删除订单
  onDeleteOrder(e) {
    const id = e.currentTarget.dataset.id;
    const module = e.currentTarget.dataset.module;
    wx.showModal({
      title: '删除订单',
      content: '确定删除此订单？删除后不可恢复',
      confirmColor: '#FF4D4F',
      success: (res) => {
        if (res.confirm) {
          this.deleteOrder(id, module);
        }
      }
    });
  },

  // 从本地存储删除订单
  deleteOrder(id, module) {
    try {
      const key = module === 'seal' ? 'seal_orders' : 'newspaper_orders';
      const orders = wx.getStorageSync(key) || [];
      const filtered = orders.filter(o => o.id !== id);
      wx.setStorageSync(key, filtered);
      this.loadOrders();
      wx.showToast({ title: '已删除', icon: 'success' });
    } catch (e) {
      wx.showToast({ title: '删除失败', icon: 'none' });
    }
  },

  // 申请售后（跳转到售后申请页）
  onApplyAftersale(e) {
    const id = e.currentTarget.dataset.id;
    const module = e.currentTarget.dataset.module;
    // 取出完整订单信息存入临时 storage，供申请页读取
    const key = module === 'seal' ? 'seal_orders' : 'newspaper_orders';
    const orders = wx.getStorageSync(key) || [];
    const order = orders.find(o => o.id === id);
    if (order) {
      wx.setStorageSync('aftersaleCurrent', order);
    }
    wx.navigateTo({ url: '/pages/aftersale/apply/index?orderId=' + id });
  }
});
