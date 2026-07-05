const common = require('../../../utils/common.js');

// 状态文本映射
const statusText = (status) => {
  const map = {
    pending: '待支付',
    processing: '进行中',
    completed: '已完成',
    cancelled: '已取消',
    refund: '退款'
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
        type: o.type || '登报',
        desc: o.desc || o.productName || '',
        date: o.date || o.createTime || '',
        status: o.status || 'pending',
        statusText: o.statusText || statusText(o.status),
        statusClass: o.statusClass || o.status,
        price: o.price || 0,
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
      { name: '已取消', status: 'cancelled' }
    ],
    currentTab: 0,
    list: [],      // 当前显示的列表
    allList: [],   // 全部订单
    loading: true
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
    this.loadOrders();
  },

  // 切换 Tab
  switchTab: function (e) {
    const idx = e.currentTarget.dataset.idx;
    this.setData({ currentTab: idx });
    this.filterList();
  },

  // 从本地存储加载所有订单
  loadOrders: function () {
    this.setData({ loading: true });
    try {
      const newspaperOrders = wx.getStorageSync('newspaper_orders') || [];
      const sealOrders = wx.getStorageSync('seal_orders') || [];

      const all = [
        ...normalize(newspaperOrders, 'newspaper'),
        ...normalize(sealOrders, 'seal')
      ];

      // 按日期倒序
      all.sort((a, b) => {
        const da = a.date || '';
        const db = b.date || '';
        return db.localeCompare(da);
      });

      this.setData({ allList: all });
      this.filterList();
    } catch (e) {
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
    this.setData({ loading: false });
  },

  // 根据当前 Tab 过滤列表
  filterList: function () {
    const { allList, currentTab, tabs } = this.data;
    const status = tabs[currentTab].status;

    if (status === 'all') {
      this.setData({ list: allList });
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
    } else {
      wx.navigateTo({ url: '/pages/newspaper/order-detail?id=' + id });
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
        if (res.confirm) {
          this.updateOrder(id, module, 'cancelled', '已取消', 'cancelled');
        }
      }
    });
  },

  // 快捷操作：立即支付
  onPayOrder(e) {
    const id = e.currentTarget.dataset.id;
    const module = e.currentTarget.dataset.module;
    wx.showModal({
      title: '模拟支付',
      content: '这是模拟支付（实际需接入微信支付）',
      success: (res) => {
        if (res.confirm) {
          this.updateOrder(id, module, 'processing', '进行中', 'processing');
          wx.showToast({ title: '支付成功', icon: 'success' });
        }
      }
    });
  },

  // 快捷操作：确认完成
  onCompleteOrder(e) {
    const id = e.currentTarget.dataset.id;
    const module = e.currentTarget.dataset.module;
    wx.showModal({
      title: '确认完成',
      content: '确认订单已完成？',
      success: (res) => {
        if (res.confirm) {
          this.updateOrder(id, module, 'completed', '已完成', 'completed');
          wx.showToast({ title: '订单已完成', icon: 'success' });
        }
      }
    });
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
  }
});
