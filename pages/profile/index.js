const common = require('../../utils/common.js');
const api = require('../../utils/api.js');

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

  // 从Storage统计各状态订单数（含后端代理记账订单）
  refreshOrderCounts() {
    const statusIdx = { pending: 0, processing: 1, completed: 2, refund: 3 };
    const counts = [0, 0, 0, 0];
    const bkStatusMap = { 1: 'pending', 2: 'processing', 3: 'processing', 4: 'completed', 5: 'completed', 6: 'cancelled', 7: 'refund', 8: 'refund' };
    const collect = (orders) => {
      if (!Array.isArray(orders)) return;
      orders.forEach(o => {
        // 退款订单 (refunded) 计入 “退款/售后” 分类
        if (o.status === 'refunded') {
          counts[3]++;
          return;
        }
        const idx = statusIdx[o.status];
        if (idx !== undefined) counts[idx]++;
      });
    };
    collect(wx.getStorageSync('seal_orders'));
    collect(wx.getStorageSync('newspaper_orders'));
    collect(wx.getStorageSync('license_orders'));
    this.setData({
      'orderTypes[0].count': counts[0],
      'orderTypes[1].count': counts[1],
      'orderTypes[2].count': counts[2],
      'orderTypes[3].count': counts[3]
    });
    // 补充代理记账订单统计（后端）
    api.getBookkeepingOrderList({ pageSize: 200 }).then(res => {
      const list = (res && res.list) || [];
      const c = [0, 0, 0, 0];
      list.forEach(o => {
        const s = bkStatusMap[o.status] || 'pending';
        if (s === 'refund') c[3]++;
        else { const idx = statusIdx[s]; if (idx !== undefined) c[idx]++; }
      });
      this.setData({
        'orderTypes[0].count': counts[0] + c[0],
        'orderTypes[1].count': counts[1] + c[1],
        'orderTypes[2].count': counts[2] + c[2],
        'orderTypes[3].count': counts[3] + c[3]
      });
    }).catch(() => {});
  },

  // 点击订单统计 → 跳转到订单列表并筛选对应状态
  goToOrderList(e) {
    const type = e.currentTarget.dataset.type;
    const statusMap = { pending: 1, processing: 2, completed: 3, refund: 4 };
    const status = statusMap[type];
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
      5: { title: '消息通知', url: '/pages/notification/index' }
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

  // 确认登录（头像+昵称都有了，点完成）
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
