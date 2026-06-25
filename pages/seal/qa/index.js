// pages/seal/qa/index.js
Page({
  data: {
    qaList: [],
    showAsk: false,
    newQuestion: ''
  },
  onLoad() {
    this.loadQA();
  },
  loadQA() {
    this.setData({
      qaList: [
        {
          id: 1,
          question: '刻章需要多长时间能拿到？',
          replyCount: 5,
          expanded: false,
          replies: [
            { idx: 1, author: '客服小蓉', text: '正常情况1-2个工作日，加急可以当天拿到。' },
            { idx: 2, author: '用户138****6688', text: '我上次上午下单，下午就收到了，很快！' }
          ]
        },
        {
          id: 2,
          question: '公司刻章需要准备哪些材料？',
          replyCount: 8,
          expanded: false,
          replies: [
            { idx: 1, author: '客服小蓉', text: '需要营业执照副本、法人身份证、经办人身份证。' }
          ]
        },
        {
          id: 3,
          question: '刻好的章可以去哪里取？支持邮寄吗？',
          replyCount: 3,
          expanded: false,
          replies: [
            { idx: 1, author: '客服小蓉', text: '支持到店自取和快递邮寄两种方式，成都市内快递次日达。' }
          ]
        },
        {
          id: 4,
          question: '电子印章和实体章有什么区别？',
          replyCount: 6,
          expanded: false,
          replies: [
            { idx: 1, author: '客服小蓉', text: '电子印章用于电子合同签署，与实体章具有同等法律效力。' }
          ]
        },
        {
          id: 5,
          question: '刻章备案是必须的吗？',
          replyCount: 4,
          expanded: false,
          replies: [
            { idx: 1, author: '客服小蓉', text: '是的，根据《印章管理办法》，刻章后必须在公安机关备案。我们平台会代办备案。' }
          ]
        }
      ]
    });
  },
  onItemTap(e) {
    const id = e.currentTarget.dataset.id;
    const list = this.data.qaList;
    const idx = list.findIndex(q => q.id === id);
    if (idx !== -1) {
      const key = 'qaList[' + idx + '].expanded';
      this.setData({ [key]: !list[idx].expanded });
    }
  },
  showAskPopup() {
    this.setData({ showAsk: true });
  },
  hideAskPopup() {
    this.setData({ showAsk: false, newQuestion: '' });
  },
  stopProp() {},
  onQuestionInput(e) {
    this.setData({ newQuestion: e.detail.value });
  },
  submitQuestion() {
    const q = this.data.newQuestion.trim();
    if (!q) {
      wx.showToast({ title: '请输入问题', icon: 'none' });
      return;
    }
    const list = this.data.qaList;
    const newId = list.length ? Math.max(...list.map(i => i.id)) + 1 : 1;
    list.unshift({
      id: newId,
      question: q,
      replyCount: 0,
      expanded: false,
      replies: []
    });
    this.setData({ qaList: list, showAsk: false, newQuestion: '' });
    wx.showToast({ title: '提问成功', icon: 'success' });
  }
});
