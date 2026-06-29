const common = require('../../utils/common.js');

Page({
  data: {
    statusBarHeight: 0,
    notifications: [],
    currentDate: '',
  },

  onLoad() {
    const { statusBarHeight } = common.getNavigationHeight();
    this.setData({ statusBarHeight });
    const now = new Date();
    this.setData({ currentDate: `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日` });
    this.loadNotifications();
  },

  onShow() {
    this.loadNotifications();
  },

  loadNotifications() {
    const raw = wx.getStorageSync('notifications') || [];
    // 演示数据（有真实数据时用真实数据）
    const demos = [
      { id: 'n1', title: '您的印章订单已发货', content: '您的电子印章订单（订单号：SEAL20260617001）已完成制作，预计1-2个工作日内送达。', time: '10:23', unread: true },
      { id: 'n2', title: '登报申请已受理', content: '您的身份证挂失登报申请已受理，预计明日见报。如有疑问请联系客服。', time: '昨天', unread: true },
      { id: 'n3', title: '实名认证审核通过', content: '恭喜！您的实名认证申请已审核通过。', time: '06-15 14:30', unread: false },
      { id: 'n4', title: '系统升级通知', content: '蓉城企服小程序已更新至 v1.0.0，新增多项服务功能，体验更流畅。', time: '06-10 09:00', unread: false },
    ];
    const list = raw.length > 0 ? raw : demos;
    this.setData({ notifications: list });
  },

  onNotifTap(e) {
    const id = e.currentTarget.dataset.id;
    const list = this.data.notifications.map(n => {
      if (n.id === id) return { ...n, unread: false };
      return n;
    });
    this.setData({ notifications: list });
    wx.showToast({ title: '查看详情', icon: 'none' });
  },

  onContactService() {
    wx.makePhoneCall({ phoneNumber: '4008886666', fail: () => { wx.showToast({ title: '拨打失败', icon: 'none' }); } });
  },

  onBack() {
    wx.navigateBack();
  },
});
