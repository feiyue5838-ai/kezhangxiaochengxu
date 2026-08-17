const common = require('../../../utils/common.js');
const api = require('../../../utils/api.js');
const auth = require('../../../utils/auth.js');
const { orderStatusV2 } = require('../../../utils/order-status-v2.js');

// 刻章订单数字 status -> 字符串 status（用于 Tab 过滤，与 localStorage 格式对齐）
const sealStatusMap = {
  1: 'pending',    // 待支付
  2: 'paid',       // 已支付（待发货）
  3: 'paid',       // 制作中 -> 待发货
  4: 'shipped',    // 已发货（待收货）
  5: 'completed',  // 已完成（待评价）
  6: 'cancelled',  // 已取消
  7: 'refund',     // 售后中
  8: 'refund',     // 退款中
  9: 'refund',     // 已退款
};

// 状态文本映射（淘宝样式）
const statusText = (status) => {
  const map = {
    pending: '待付款',
    paid: '待发货',
    shipped: '待收货',
    completed: '待评价',
    cancelled: '已取消',
    refund: '退款/售后',
    aftersale: '售后中',
    refunding: '退款中',
    refunded: '已退款',
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
        url: '/pages/newspaper/order-detail/index?id=' + o.id,
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
        url: '/pages/seal/order-detail/index?id=' + o.id,
      };
    }
    return o;
  });
};

Page({
  data: {
    tabs: [
      { name: '全部', status: 'all' },
      { name: '待付款', status: 'pending' },
      { name: '待发货', status: 'paid' },
      { name: '待收货', status: 'shipped' },
      { name: '待评价', status: 'completed' },
      { name: '售后', status: 'refund' },
    ],
    currentTab: 0,
    list: [],
    allList: [],
    loading: false,
    needLogin: false,
  },

  onLoad(opt) {
    // 测试模式：URL 添加 ?test=1 启用
    if (opt.test === '1') {
      this._testMode = true;
      wx.setStorageSync('__test_mode__', true);
    }
    if (opt.status) {
      const idx = this.data.tabs.findIndex(t => t.status === opt.status);
      if (idx >= 0) this.setData({ currentTab: idx });
    }
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 4 });
    }
    // 检查测试模式
    if (wx.getStorageSync('__test_mode__')) {
      this._testMode = true;
    }
    this.loadOrders();
  },

  switchTab(e) {
    const idx = e.currentTarget.dataset.idx;
    this.setData({ currentTab: idx });
    this.filterList();
  },

  async loadOrders() {
    if (this._loadingOrders) return;
    this._loadingOrders = true;
    if (!auth.isLogin()) {
      this.setData({ loading: false, needLogin: true, allList: [], list: [] });
      this._loadingOrders = false;
      return;
    }
    this.setData({ loading: true, needLogin: false });

    // ===== V2.0 优先：统一订单列表（五维状态） =====
    try {
      const v2res = await api.v2GetOrders({ pageSize: 200 });
      const v2List = (v2res && (v2res.list || v2res.rows)) || [];
      if (v2List.length > 0 || (v2res && v2res.total !== undefined)) {
        const v2Orders = v2List.map(o => {
          const st = orderStatusV2(o);
          const itemDesc = (o.orderItemsV2 && o.orderItemsV2.length)
            ? o.orderItemsV2.map(i => i.itemName || '').filter(Boolean).join(' / ')
            : (o.customerRemark || (o.module === 'seal' ? '刻章服务' : o.module === 'newspaper' ? '登报服务' : '代理记账'));
          return {
            id: o.orderNo,            // V2.0 用 orderNo 作为唯一标识
            orderNo: o.orderNo,
            module: o.module || 'seal',
            type: o.module === 'seal' ? '在线刻章' : o.module === 'newspaper' ? '登报服务' : '代理记账',
            desc: itemDesc,
            date: (o.createdAt || '').split('T')[0],
            createTime: (o.createdAt || '').replace('T', ' ').substring(0, 16),
            status: st.key,
            statusText: st.label,
            statusClass: st.key,
            color: st.color,
            step: st.step,
            price: Number(o.totalAmount) || 0,
            payAmount: Number(o.payAmount) || 0,
            expressNo: o.expressNo || '',
            expressCompany: o.expressCompany || '',
            url: '/pages/order/detail/index?orderNo=' + o.orderNo,
          };
        });
        v2Orders.sort((a, b) => (b.createTime || '').localeCompare(a.createTime || ''));
        this.setData({ allList: v2Orders });
        this.filterList();
        this.setData({ loading: false });
        this._loadingOrders = false;
        return;
      }
    } catch (e) {
      console.warn('[order-list] V2.0 接口失败，降级 V1:', e && e.message);
    }

    // ===== V1 兜底（原有逻辑） =====
    // 测试模式：自动添加测试订单
    const testMode = this._testMode || wx.getStorageSync('__test_mode__');
    const newspaperOrders = testMode ? [
      { id: 'TEST_NEWS_001', status: 2, type: '登报服务', desc: '营业执照遗失声明', date: '2026-08-14', price: 150 }
    ] : (wx.getStorageSync('newspaper_orders') || []);
    const localSealOrders = testMode ? [
      { id: 'TEST_SEAL_001', status: 3, companyName: '公章 + 财务章', date: '2026-08-14', totalPrice: 299 },
      { id: 'TEST_SEAL_002', status: 1, companyName: '合同专用章', date: '2026-08-13', totalPrice: 199 },
      { id: 'TEST_SEAL_003', status: 5, companyName: '法人章', date: '2026-08-12', totalPrice: 99 },
      { id: 'TEST_SEAL_004', status: 4, companyName: '发票专用章', date: '2026-08-11', totalPrice: 159 },
    ] : (wx.getStorageSync('seal_orders') || []);
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
            ? o.orderItems.map(i => i.seal ? i.seal.name : '').filter(Boolean).join(' / ')
            : (o.companyName || ''),
          date: o.createdAt ? o.createdAt.split('T')[0] : '',
          createTime: o.createdAt ? o.createdAt.replace('T', ' ').substring(0, 16) : '',
          status: strStatus,
          statusText: o.statusText || statusText(strStatus),
          statusClass: strStatus,
          price: Number(o.totalPrice) || 0,
          expressNo: o.expressNo || '',
          expressCompany: o.expressCompany || '',
          url: '/pages/seal/order-detail/index?id=' + o.id,
        };
      }) : [];
      const localPendingSeal = localSealOrders.filter(o => String(o.id).startsWith('SEAL_'));
      const seen = new Set(apiOrders.map(o => o.id));
      const merged = [
        ...localPendingSeal,
        ...apiOrders,
        ...localSealOrders.filter(o => !seen.has(o.id) && !String(o.id).startsWith('SEAL_')),
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
          url: '/pages/bookkeeping/order-detail/index?id=' + o.id,
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

  filterList() {
    const { allList, currentTab, tabs } = this.data;
    const status = tabs[currentTab].status;
    // V1 旧状态 key → 兼容 V2.0 新 key
    const v2KeyMap = {
      pending: ['pending_payment'],
      paid: ['pending_assign', 'assigned', 'accepted', 'processing'],
      shipped: ['delivering', 'signed'],
      completed: ['completed'],
      refund: ['refunding', 'partial_refund', 'refunded', 'refund_rejected', 'cancelled'],
    };
    if (status === 'all') {
      this.setData({ list: allList });
    } else if (status === 'refund') {
      this.setData({ list: allList.filter(o => ['refund', 'refunded', 'cancelled'].includes(o.status) || (v2KeyMap.refund || []).includes(o.status)) });
    } else {
      const v2Keys = v2KeyMap[status] || [];
      this.setData({ list: allList.filter(o => o.status === status || v2Keys.includes(o.status)) });
    }
  },

  goToDetail(e) {
    const { id, module, orderno } = e.currentTarget.dataset;
    // V2.0 订单（orderNo）→ 统一订单详情页
    if (orderno || (id && String(id).startsWith('SE') === false && String(id).length > 16)) {
      // orderNo 形如 SE/RB/BK + 时间戳，长度 > 16 且非 UUID（UUID 含 -）
      wx.navigateTo({ url: '/pages/order/detail/index?orderNo=' + (orderno || id) });
      return;
    }
    const urls = {
      seal: '/pages/seal/order-detail/index',
      newspaper: '/pages/newspaper/order-detail/index',
      bookkeeping: '/pages/bookkeeping/order-detail/index',
    };
    wx.navigateTo({ url: (urls[module] || urls.newspaper) + '?id=' + id });
  },

  onCancelOrder(e) {
    const { id, module } = e.currentTarget.dataset;
    wx.showModal({
      title: '提示',
      content: '确定取消此订单吗？',
      success: (res) => {
        if (!res.confirm) return;
        wx.showLoading({ title: '取消中...' });
        const cancelApi = module === 'seal' ? api.cancelSealOrder : module === 'bookkeeping' ? api.cancelBookkeepingOrder : api.cancelNewspaperOrder;
        cancelApi(id).then(() => {
          wx.hideLoading();
          wx.showToast({ title: '已取消', icon: 'success' });
          this.updateLocalOrder(id, module, 'cancelled', '已取消', 'cancelled');
        }).catch(() => {
          wx.hideLoading();
          wx.showToast({ title: '取消失败', icon: 'none' });
        });
      },
    });
  },

  onViewLogistics(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: '/pages/order/logistics/index?id=' + id });
  },

  onConfirmReceive(e) {
    const { id, module } = e.currentTarget.dataset;
    wx.showModal({
      title: '确认收货',
      content: '请确认您已收到货物且无异议？',
      confirmColor: '#52C41A',
      success: (res) => {
        if (!res.confirm) return;
        wx.showLoading({ title: '确认中...' });
        api.confirmReceive(id).then(() => {
          wx.hideLoading();
          wx.showToast({ title: '已确认收货', icon: 'success' });
          this.updateLocalOrder(id, module, 'completed', '待评价', 'completed');
        }).catch(() => {
          wx.hideLoading();
          wx.showToast({ title: '确认失败，请重试', icon: 'none' });
        });
      },
    });
  },

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

  onApplyAftersale(e) {
    const { id, module } = e.currentTarget.dataset;
    const key = module === 'seal' ? 'seal_orders' : module === 'newspaper' ? 'newspaper_orders' : null;
    if (key) {
      const orders = wx.getStorageSync(key) || [];
      const order = orders.find(o => o.id === id);
      if (order) wx.setStorageSync('aftersaleCurrent', order);
    }
    wx.navigateTo({ url: '/pages/aftersale/apply/index?orderId=' + id + '&module=' + module });
  },

  onDeleteOrder(e) {
    const { id, module } = e.currentTarget.dataset;
    wx.showModal({
      title: '删除订单',
      content: '确定删除？删除后不可恢复',
      confirmColor: '#FF4D4F',
      success: (res) => {
        if (res.confirm) {
          const key = module === 'seal' ? 'seal_orders' : module === 'newspaper' ? 'newspaper_orders' : null;
          if (key) {
            const orders = wx.getStorageSync(key) || [];
            wx.setStorageSync(key, orders.filter(o => o.id !== id));
          }
          this.loadOrders();
          wx.showToast({ title: '已删除', icon: 'success' });
        }
      },
    });
  },

  updateLocalOrder(id, module, status, statusText, statusClass) {
    const key = module === 'seal' ? 'seal_orders' : module === 'newspaper' ? 'newspaper_orders' : null;
    if (key) {
      const orders = wx.getStorageSync(key) || [];
      orders.forEach(o => {
        if (o.id === id) {
          o.status = status;
          o.statusText = statusText;
          o.statusClass = statusClass;
        }
      });
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
