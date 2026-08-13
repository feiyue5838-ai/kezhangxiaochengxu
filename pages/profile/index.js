const common = require('../../utils/common.js');
const api = require('../../utils/api.js');
const auth = require('../../utils/auth.js');

Page({
  data: {
    userInfo: { nickName: '', phone: '' },
    orderTypes: [
      { id: 'pending',    name: '待支付',   iconSvg: '/assets/icons/icon-b64-13.svg', bgColor: '#FFF7E6', color: '#FAAD14', count: 0 },
      { id: 'processing', name: '进行中',   iconSvg: '/assets/icons/icon-b64-14.svg', bgColor: '#F0EBFF', color: '#7B5CFA', count: 0 },
      { id: 'completed',  name: '已完成',   iconSvg: '/assets/icons/icon-b64-15.svg', bgColor: '#F0FFF0', color: '#52C41A', count: 0 },
      { id: 'refund',     name: '退款/售后', iconSvg: '/assets/icons/icon-b64-16.svg', bgColor: '#FFF0E6', color: '#FA8C16', count: 0 }
    ],
    functions: [
      { id: 2, iconSvg: '/assets/icons/icon-b64-18.svg', name: '发票管理', bgColor: '#E8F0FF' },
      { id: 3, iconSvg: '/assets/icons/icon-b64-19.svg', name: '地址管理', bgColor: '#FFF7E6' },
      { id: 4, iconSvg: '/assets/icons/icon-b64-20.svg', name: '实名认证', bgColor: '#F0FFF0' },
      { id: 5, iconSvg: '/assets/icons/icon-b64-21.svg', name: '消息通知', bgColor: '#F5F0FF' },
      { id: 6, iconSvg: '/assets/icons/icon-b64-22.svg', name: '帮助中心', bgColor: '#E6F0FF' },
      { id: 7, iconSvg: '/assets/icons/icon-b64-7.svg', name: '联系客服', bgColor: '#FFE6E6' }
    ]
  },

  onLoad() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) this.setData({ userInfo });
    this.refreshOrderCounts();
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 4 });
    }
    this.refreshOrderCounts();
  },

  // 从 Storage 统计各状态订单数（与订单列表 tabs 对齐：进行中=待发货+待收货）
  refreshOrderCounts() {
    const counts = { pending: 0, paid: 0, completed: 0, refund: 0 };
    const bkStatusMap = { 1: 'pending', 2: 'paid', 3: 'paid', 4: 'completed', 5: 'completed', 6: 'cancelled', 7: 'refund', 8: 'refund' };

    // 刻章/登报/执照订单统计
    const collect = (orders) => {
      if (!Array.isArray(orders)) return;
      orders.forEach(o => {
        if (o.status === 'refunded') { counts.refund++; return; }
        if (o.status === 'cancelled') { return; }
        if (o.status === 'pending') { counts.pending++; return; }
        if (o.status === 'paid' || o.status === 'shipped') { counts.paid++; return; }
        if (o.status === 'completed') { counts.completed++; return; }
        if (o.status === 'refund') { counts.refund++; return; }
      });
    };
    collect(wx.getStorageSync('seal_orders'));
    collect(wx.getStorageSync('newspaper_orders'));
    collect(wx.getStorageSync('license_orders'));

    this.setData({
      'orderTypes[0].count': counts.pending,
      'orderTypes[1].count': counts.paid,
      'orderTypes[2].count': counts.completed,
      'orderTypes[3].count': counts.refund
    });

    if (!auth.isLogin()) return;

    // 补充代理记账订单 + 售后记录
    Promise.all([
      api.getBookkeepingOrderList({ pageSize: 200 }),
      api.getUserAfterSales({ pageSize: 50 })
    ]).then(([bkRes, afterRes]) => {
      let bkPaid = 0, bkCompleted = 0, bkRefund = 0;
      ((bkRes && bkRes.list) || []).forEach(o => {
        const s = bkStatusMap[o.status] || 'pending';
        if (s === 'paid') bkPaid++;
        else if (s === 'completed') bkCompleted++;
        else if (s === 'refund') bkRefund++;
      });
      const afterCount = ((afterRes && afterRes.rows) || []).length;
      this.setData({
        'orderTypes[0].count': counts.pending,
        'orderTypes[1].count': counts.paid + bkPaid,
        'orderTypes[2].count': counts.completed + bkCompleted,
        'orderTypes[3].count': counts.refund + bkRefund + afterCount
      });
    }).catch(() => {});
  },

  // 点击订单统计 → 跳转到订单列表对应 Tab
  goToOrderList(e) {
    const type = e.currentTarget.dataset.type;
    if (type === 'refund') {
      wx.navigateTo({ url: '/pages/aftersale/list/index' });
      return;
    }
    // statusMap 值直接对应对应订单列表 tabs 的 status 字符串
    const statusMap = { pending: 'pending', processing: 'paid', completed: 'completed' };
    const status = statusMap[type] || 'all';
    wx.navigateTo({ url: '/pages/order/list/index?status=' + status });
  },

  // 全部订单
  goToOrders() {
    wx.navigateTo({ url: '/pages/order/list/index' });
  },

  // 售后记录
  goToAftersale() {
    wx.navigateTo({ url: '/pages/aftersale/list/index' });
  },

  // 关于我们
  goToAbout() {
    wx.navigateTo({ url: '/pages/about/index' });
  },

  onFuncTap(e) {
    const id = e.currentTarget.dataset.id;
    const map = {
      2: { title: '发票管理', url: '/pages/invoice/edit/index' },
      3: { title: '地址管理', url: '/pages/address/edit/index' },
      4: { title: '实名认证', url: '/pages/realname/index' },
      5: { title: '消息通知', url: '/pages/notification/index' },
    6: { title: '帮助中心', url: '/pages/help/index' }
    };
    const item = map[id];
    if (!item) return;
    wx.navigateTo({ url: item.url });
  },

  // 选择头像回调
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    const userInfo = { ...this.data.userInfo, avatarUrl };
    this.setData({ userInfo });
  },

  // 昵称输入失焦
  onNicknameBlur(e) {
    const nickName = e.detail.value.trim();
    if (!nickName) return;
    const userInfo = { ...this.data.userInfo, nickName };
    this.setData({ userInfo });
  },

  // 确认登录(头像+昵称都有了,点完成)
  onConfirmLogin() {
    const { avatarUrl, nickName } = this.data.userInfo;
    if (!avatarUrl || !nickName) {
      wx.showToast({ title: '请完善头像和昵称', icon: 'none' });
      return;
    }
    const userInfo = {
      ...this.data.userInfo,
      loginTime: Date.now()
    };
    wx.setStorageSync('userInfo', userInfo);
    this.setData({ userInfo });
    wx.showToast({ title: '登录成功', icon: 'success' });
  },

  callService() {
    wx.makePhoneCall({ phoneNumber: '4008886666', fail: () => { wx.showToast({ title: '拨打失败', icon: 'none' }); } });
  },

  onViewPrivacy() {
    wx.navigateTo({ url: '/pages/agreement/privacy/index' });
  },

  onViewTerms() {
    wx.navigateTo({ url: '/pages/agreement/terms/index' });
  },

  onContactService() {
    wx.makePhoneCall({ phoneNumber: '4008886666', fail: () => { wx.showToast({ title: '拨打失败', icon: 'none' }); } });
  },
});
