// pages/seal/qa/index.js
const STORAGE_KEY = 'seal_qa_data';

// 默认问答数据
const DEFAULT_BIZ_QA = [
  {
    id: 1,
    question: '刻章需要多长时间能拿到？',
    expanded: false,
    replies: [
      { idx: 1, author: '客服小蓉', text: '正常情况1-2个工作日，加急可以当天拿到。' },
      { idx: 2, author: '用户138****6688', text: '我上次上午下单，下午就收到了，很快！' }
    ]
  },
  {
    id: 2,
    question: '公司刻章需要准备哪些材料？',
    expanded: false,
    replies: [
      { idx: 1, author: '客服小蓉', text: '需要营业执照副本、法人身份证、经办人身份证。' }
    ]
  },
  {
    id: 3,
    question: '刻好的章可以去哪里取？支持邮寄吗？',
    expanded: false,
    replies: [
      { idx: 1, author: '客服小蓉', text: '支持到店自取和快递邮寄两种方式，成都市内快递次日达。' }
    ]
  },
  {
    id: 4,
    question: '电子印章和实体章有什么区别？',
    expanded: false,
    replies: [
      { idx: 1, author: '客服小蓉', text: '电子印章用于电子合同签署，与实体章具有同等法律效力。' }
    ]
  },
  {
    id: 5,
    question: '刻章备案是必须的吗？',
    expanded: false,
    replies: [
      { idx: 1, author: '客服小蓉', text: '是的，根据《印章管理办法》，刻章后必须在公安机关备案。我们平台会代办备案。' }
    ]
  }
];

const DEFAULT_PERSONAL_QA = [
  {
    id: 1,
    question: '个人刻章需要什么材料？',
    expanded: false,
    replies: [
      { idx: 1, author: '客服小蓉', text: '需要本人身份证原件及复印件。' }
    ]
  },
  {
    id: 2,
    question: '个人私章和职业章有什么区别？',
    expanded: false,
    replies: [
      { idx: 1, author: '客服小蓉', text: '私章是个人签名使用，职业章（如律师、会计）标注有执业资格类别。' }
    ]
  },
  {
    id: 3,
    question: '个人职业章可以在其他公司用吗？',
    expanded: false,
    replies: [
      { idx: 1, author: '客服小蓉', text: '职业章属于个人执业印章，与单位无关，可以跨公司使用。' }
    ]
  },
  {
    id: 4,
    question: '个人刻章需要备案吗？',
    expanded: false,
    replies: [
      { idx: 1, author: '客服小蓉', text: '个人私章不强制备案，但个人职业章建议备案以增强法律效力。' }
    ]
  },
  {
    id: 5,
    question: '个人印章多久能刻好？',
    expanded: false,
    replies: [
      { idx: 1, author: '客服小蓉', text: '个人印章通常1小时内可取，加急可更快。' }
    ]
  }
];

Page({
  data: {
    qaList: [],
    showAsk: false,
    newQuestion: '',
    isPersonal: false
  },
  onLoad(options) {
    const isPersonal = options.isPersonal === 'true';
    this.setData({ isPersonal });
    this.loadQA(isPersonal);
  },
  loadQA(isPersonal) {
    const cached = wx.getStorageSync(STORAGE_KEY + '_' + (isPersonal ? 'personal' : 'biz'));
    if (cached && Array.isArray(cached) && cached.length > 0) {
      this.setData({ qaList: cached });
    } else {
      const defaults = isPersonal ? DEFAULT_PERSONAL_QA : DEFAULT_BIZ_QA;
      this.setData({ qaList: defaults });
    }
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
    // 延迟聚焦，确保弹窗渲染完成
    setTimeout(() => {
      const query = wx.createSelectorQuery();
      query.select('.ask-textarea').node().exec((res) => {
        const textarea = res[0]?.node;
        if (textarea) {
          textarea.focus();
        }
      });
    }, 100);
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
    const newItem = {
      id: newId,
      question: q,
      expanded: false,
      replies: []
    };
    list.unshift(newItem);
    this.setData({ qaList: list, showAsk: false, newQuestion: '' });
    // 持久化到 storage
    this._saveToStorage();
    wx.showToast({ title: '提问成功', icon: 'success' });
  },
  _saveToStorage() {
    const key = STORAGE_KEY + '_' + (this.data.isPersonal ? 'personal' : 'biz');
    wx.setStorageSync(key, this.data.qaList);
  }
});
