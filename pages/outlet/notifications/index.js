const api = require('../../../utils/api.js');

Page({
  data: {
    notifications: [],
    loading: true,
    outletToken: '',
  },

  onLoad() {
    const outletToken = wx.getStorageSync('outletToken');
    if (!outletToken) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1500);
      return;
    }
    this.setData({ outletToken });
    this.loadNotifications();
  },

  onShow() {
    if (this.data.outletToken) {
      this.loadNotifications();
    }
  },

  async loadNotifications() {
    this.setData({ loading: true });
    try {
      // 从服务器获取网点通知
      const res = await api.outletRequest({
        url: '/outlets/me/notifications',
        method: 'GET',
      });

      this.setData({
        notifications: res.list || res || [],
        loading: false
      });
    } catch (err) {
      console.error('加载通知失败:', err);
      this.setData({ loading: false });
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  onNotificationTap(e) {
    const { id, order_id, order_no } = e.currentTarget.dataset;

    // 标记已读
    this.markAsRead(id);

    // 跳转到订单详情
    if (order_id || order_no) {
      wx.navigateTo({
        url: `/pages/outlet/order-detail/index?id=${order_id || ''}&order_no=${order_no || ''}`
      });
    }
  },

  async markAsRead(notificationId) {
    try {
      await api.outletRequest({
        url: `/outlets/notifications/${notificationId}/read`,
        method: 'PUT',
      });

      // 更新本地状态
      const notifications = this.data.notifications.map(n => {
        if (n.id === notificationId) {
          return { ...n, is_read: true };
        }
        return n;
      });
      this.setData({ notifications });
    } catch (err) {
      console.error('标记已读失败:', err);
    }
  },

  async deleteNotification(e) {
    const { id } = e.currentTarget.dataset;

    wx.showModal({
      title: '确认删除',
      content: '确定删除这条通知吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await api.outletRequest({
              url: `/outlets/notifications/${id}`,
              method: 'DELETE',
            });

            // 从列表中移除
            const notifications = this.data.notifications.filter(n => n.id !== id);
            this.setData({ notifications });

            wx.showToast({ title: '已删除', icon: 'success' });
          } catch (_err) {
            wx.showToast({ title: '删除失败', icon: 'none' });
          }
        }
      }
    });
  },

  onPullDownRefresh() {
    this.loadNotifications().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;

    // 1小时内
    if (diff < 3600000) {
      return Math.floor(diff / 60000) + '分钟前';
    }
    // 今天
    if (date.toDateString() === now.toDateString()) {
      return date.getHours() + ':' + String(date.getMinutes()).padStart(2, '0');
    }
    // 昨天
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return '昨天 ' + date.getHours() + ':' + String(date.getMinutes()).padStart(2, '0');
    }
    // 其他
    return (date.getMonth() + 1) + '月' + date.getDate() + '日';
  },
});