// pages/seal/qa/detail/index.js — 问答详情页
// 数据源：GET /api/questions/:id（api.qaDetail）；接口失败时回退到列表页带入的快照数据
const api = require('../../../../utils/api.js');

Page({
  data: {
    id: '',
    question: null,   // { question/content, createdAt, status, replies: [{author, text, createdAt}] }
    loading: true,
    loadFailed: false,
  },

  onLoad(options) {
    const id = options.id;
    if (!id) {
      wx.showToast({ title: '参数错误', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1200);
      return;
    }
    this.setData({ id });

    // 列表页通过 EventChannel 传快照，先渲染再刷新
    const channel = this.getOpenerEventChannel && this.getOpenerEventChannel();
    if (channel && channel.on) {
      channel.on('qaSnapshot', (snap) => {
        if (snap && snap.question) this.setData({ question: this._normalize(snap), loading: false });
      });
    }

    this.loadDetail(id);
  },

  async loadDetail(id) {
    try {
      const res = await api.qaDetail(id);
      const raw = (res && res.data !== undefined && !res.question && !res.content) ? res.data : res;
      this.setData({ question: this._normalize(raw), loading: false, loadFailed: false });
    } catch (e) {
      console.error('加载问答详情失败:', e);
      // 已有快照则静默失败，否则展示错误态
      this.setData({
        loading: false,
        loadFailed: !this.data.question,
      });
    }
  },

  // 兼容列表字段（question/content、answers/replies）
  _normalize(raw) {
    const replies = (raw.replies || raw.answers || []).map(r => ({
      author: r.author || r.adminName || '官方回复',
      text: r.text || r.content || r.answer || '',
      createdAt: r.createdAt || '',
    }));
    return {
      ...raw,
      title: raw.question || raw.content || '',
      statusText: raw.status === 1 || raw.status === 'answered' ? '已回复' : '待回复',
      isAnswered: replies.length > 0,
      date: raw.createdAt ? String(raw.createdAt).slice(0, 10) : (raw.date || ''),
      replies,
    };
  },

  goBack() {
    wx.navigateBack({ delta: 1 });
  },

  onRetry() {
    this.setData({ loading: true });
    this.loadDetail(this.data.id);
  },

  // 继续追问（回到列表页提问弹窗）
  onAskAgain() {
    wx.navigateBack({ delta: 1 });
  },
});
