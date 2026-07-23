// pages/seal/qa/index.js
const api = require('../../../utils/api.js');

Page({
  data: {
    qaList: [],
    loading: true,
    showAsk: false,
    newQuestion: '',
    isPersonal: false,
    submitting: false
  },

  goBack() {
    wx.navigateBack({ delta: 1 });
  },

  onLoad(options) {
    const isPersonal = options.isPersonal === 'true';
    this.setData({ isPersonal });
    this.loadQA();
  },

  // 从 API 加载问答列表
  async loadQA() {
    this.setData({ loading: true });
    try {
      const res = await api.qaList({ module: 'seal', limit: 50 });
      // 适配后端返回格式
      const list = Array.isArray(res) ? res : (res.items || res.list || []);
      // 添加 expanded 字段用于折叠展开
      const qaList = list.map(item => ({
        ...item,
        expanded: false,
        // 适配回复列表格式
        replies: item.replies || item.answers || []
      }));
      this.setData({
        qaList: qaList,
        loading: false
      });
    } catch (e) {
      console.error('加载问答失败:', e);
      this.setData({ loading: false });
      // 加载失败时显示空列表，不再使用模拟数据
      this.setData({ qaList: [] });
    }
  },

  // 展开/收起问答详情
  onItemTap(e) {
    const id = e.currentTarget.dataset.id;
    const list = this.data.qaList;
    const idx = list.findIndex(q => q.id === id);
    if (idx !== -1) {
      const key = 'qaList[' + idx + '].expanded';
      this.setData({ [key]: !list[idx].expanded });
    }
  },

  // 显示提问弹窗
  showAskPopup() {
    this.setData({ showAsk: true });
  },

  // 隐藏提问弹窗
  hideAskPopup() {
    this.setData({ showAsk: false, newQuestion: '' });
  },

  // 阻止事件冒泡
  stopProp() {},

  // 输入问题
  onQuestionInput(e) {
    this.setData({ newQuestion: e.detail.value });
  },

  // 提交问题
  async submitQuestion() {
    const q = this.data.newQuestion.trim();
    if (!q) {
      wx.showToast({ title: '请输入问题', icon: 'none' });
      return;
    }
    if (q.length < 5) {
      wx.showToast({ title: '问题至少5个字', icon: 'none' });
      return;
    }

    this.setData({ submitting: true });

    try {
      const res = await api.submitQuestion({
        module: 'seal',
        content: q
      });

      // 添加到列表顶部
      const newItem = {
        id: res.id || Date.now(),
        question: q,
        expanded: false,
        replies: [],
        createdAt: new Date().toISOString()
      };

      this.setData({
        qaList: [newItem, ...this.data.qaList],
        showAsk: false,
        newQuestion: '',
        submitting: false
      });

      wx.showToast({ title: '提问成功', icon: 'success' });
    } catch (e) {
      console.error('提交问题失败:', e);
      wx.showToast({ title: e.message || '提交失败', icon: 'none' });
      this.setData({ submitting: false });
    }
  }
});
