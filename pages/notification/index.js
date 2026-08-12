const api = require('../../utils/api.js');

Page({
  data: {
    notifications: [],
    currentDate: '',
    phone: '4008886666',
    loading: true,
  },

  onLoad() {
    const now = new Date();
    this.setData({ currentDate: `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日` });
    this.loadNotifications();
  },

  onShow() {
    this.loadNotifications();
  },

  loadNotifications() {
    // 优先读本地缓存（先展示避免白屏）
    const cached = wx.getStorageSync('notifications') || [];
    if (cached.length > 0) {
      this.setData({ notifications: cached });
    }
    // 从后端拉取最新公告
    api.getAnnouncements().then((res) => {
      const now = Date.now();
      const raw = Array.isArray(res) ? res : (res.list || []);
      const list = raw.map((item) => {
        const publishedAt = item.publishedAt ? new Date(item.publishedAt).getTime() : 0;
        const expiredAt = item.expiredAt ? new Date(item.expiredAt).getTime() : Infinity;
        if (item.status !== 1 || now < publishedAt || now > expiredAt) return null;
        const d = new Date(item.publishedAt);
        const today = new Date();
        const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
        const isToday = d.toDateString() === today.toDateString();
        const isYesterday = d.toDateString() === yesterday.toDateString();
        let timeStr;
        if (isToday) timeStr = `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
        else if (isYesterday) timeStr = '昨天';
        else timeStr = `${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        return { id: item.id, title: item.title, content: item.content, time: timeStr, unread: false };
      }).filter(Boolean);
      // 更新缓存
      wx.setStorageSync('notifications', list);
      this.setData({ notifications: list, loading: false });
      // 同时加载客服电话
      return api.getFaqList().then((r) => {
        const p = r && r.data && r.data.phone;
        if (p) this.setData({ phone: p });
      }).catch(() => {});
    }).catch(() => {
      // 接口失败兜底缓存，loading 保持缓存时的状态
      this.setData({ notifications: cached, loading: false });
    });
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
    wx.makePhoneCall({ phoneNumber: String(this.data.phone), fail: () => { wx.showToast({ title: '拨打失败', icon: 'none' }); } });
  },

  onBack() {
    wx.navigateBack();
  },
});
