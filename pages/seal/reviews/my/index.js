// pages/seal/reviews/my/index.js — 我提交的评价（管理页）
// 数据源：GET /api/reviews/my（api.myReviews），按审核状态分 Tab 展示
const api = require('../../../../utils/api.js');

// 审核状态归一化：兼容数字与字符串两种返回
function normalizeStatus(s) {
  const n = Number(s);
  if (!isNaN(n) && s !== null && s !== undefined && s !== '') {
    // 0=待审核 1=已通过 2=已驳回（与后端 review 审核流对齐）
    if (n === 0) return 'pending';
    if (n === 1) return 'approved';
    if (n === 2) return 'rejected';
  }
  const str = String(s || '').toLowerCase();
  if (str === 'pending' || str === 'waiting') return 'pending';
  if (str === 'approved' || str === 'passed' || str === 'ok') return 'approved';
  if (str === 'rejected' || str === 'refused' || str === 'fail') return 'rejected';
  return 'pending'; // 兜底视为待审核
}

const STATUS_META = {
  pending:  { text: '待审核', cls: 'badge--pending' },
  approved: { text: '已通过', cls: 'badge--approved' },
  rejected: { text: '已驳回', cls: 'badge--rejected' },
};

Page({
  data: {
    tabs: [
      { key: 'all', name: '全部' },
      { key: 'pending', name: '待审核' },
      { key: 'approved', name: '已通过' },
      { key: 'rejected', name: '已驳回' }
    ],
    activeTab: 'all',
    allList: [],   // 归一化后的全量列表
    list: [],      // 当前 Tab 过滤结果
    loading: true,
    showLoginTip: false,
  },

  onLoad(options) {
    if (options.tab) this.setData({ activeTab: options.tab });
    this.loadMyReviews();
  },

  goBack() {
    wx.navigateBack({ delta: 1 });
  },

  async loadMyReviews() {
    const token = wx.getStorageSync('token');
    if (!token) {
      this.setData({ loading: false, showLoginTip: true, allList: [], list: [] });
      return;
    }
    this.setData({ loading: true, showLoginTip: false });
    try {
      const res = await api.myReviews({ module: 'seal', limit: 50 });
      const raw = Array.isArray(res) ? res : (res.items || res.list || res.rows || []);
      const allList = raw.map(item => {
        const status = normalizeStatus(item.status);
        return {
          ...item,
          status,
          statusText: STATUS_META[status].text,
          statusCls: STATUS_META[status].cls,
          // 日期展示兼容多种字段
          date: item.date || (item.createdAt ? String(item.createdAt).slice(0, 10) : ''),
          rejectReason: item.rejectReason || item.reason || '',
        };
      });
      this.setData({ allList, loading: false });
      this.applyFilter();
    } catch (e) {
      console.error('加载我的评价失败:', e);
      this.setData({ loading: false, allList: [] });
      wx.showToast({ title: (e && e.message) || '加载失败', icon: 'none' });
    }
  },

  onTabTap(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({ activeTab: key });
    this.applyFilter();
  },

  applyFilter() {
    const { allList, activeTab } = this.data;
    const list = activeTab === 'all' ? allList : allList.filter(r => r.status === activeTab);
    this.setData({ list });
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.loadMyReviews().finally(() => wx.stopPullDownRefresh());
  },

  // 去写评价（跳公开评价页的可评价订单入口）
  goWriteReview() {
    wx.navigateBack({ delta: 1 });
  },

  // 未登录 → 去登录
  goLogin() {
    wx.navigateTo({ url: '/pages/auth/index' });
  }
});
