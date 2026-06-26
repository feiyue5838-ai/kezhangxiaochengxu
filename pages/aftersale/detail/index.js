const common = require('../../../utils/common.js');

Page({
  data: {
    statusBarHeight: 0,
    navHeight: 0,
    record: {},
    statusText: {
      pending: '待处理',
      processing: '处理中',
      completed: '已完成',
      rejected: '已拒绝',
      cancelled: '已撤销'
    },
    statusIcon: {
      pending: '⏳',
      processing: '🔄',
      completed: '✅',
      rejected: '❌',
      cancelled: '🚫'
    },
    categoryText: {
      quality: '质量问题',
      missing: '漏刻/缺失',
      wrong: '信息错误',
      receipt: '补开收据',
      other: '其他'
    },
    nextIndex: 0
  },

  onLoad() {
    const statusBarHeight = common.getNavigationHeight().statusBarHeight;
    const navHeight = statusBarHeight + 64;
    this.setData({ statusBarHeight, navHeight });
    const record = wx.getStorageSync('aftersaleCurrent') || {};
    // 计算nextIndex：找到第一个没有时间的条目
    const nextIndex = (record.timeline || []).findIndex(t => !t.time);
    this.setData({ record, nextIndex: nextIndex >= 0 ? nextIndex : 2 });
  },

  previewImage(e) {
    const src = e.currentTarget.dataset.src;
    wx.previewImage({ current: src, urls: this.data.record.images || [src] });
  },

  cancelApply() {
    wx.showModal({
      title: '确认撤销',
      content: '确定要撤销此售后申请吗？撤销后将无法恢复。',
      confirmColor: '#5B6FE8',
      success: (res) => {
        if (!res.confirm) return;
        const records = wx.getStorageSync('aftersale_records') || [];
        const idx = records.findIndex(r => r.id === this.data.record.id);
        if (idx >= 0) {
          records[idx].status = 'cancelled';
          records[idx].timeline[0].time = new Date().toLocaleString('zh-CN');
          records[idx].timeline[0].desc = '您已主动撤销此申请';
          wx.setStorageSync('aftersale_records', records);
        }
        wx.showToast({ title: '已撤销', icon: 'success' });
        setTimeout(() => { wx.navigateBack(); }, 1200);
      }
    });
  },

  goBack() {
    wx.navigateBack();
  },
});
