// components/question-answer-module/index.js
Component({
  properties: {
    isPersonal: { type: Boolean, value: false }
  },
  observers: {
    isPersonal(val) {
      this.setData({
        qaList: val ? this.data.personalQaList : this.data.bizQaList
      });
    }
  },
  data: {
    bizQaList: [
      { id: 1, question: '刻章需要多长时间能拿到？', replyCount: 5 },
      { id: 2, question: '公司刻章需要准备哪些材料？', replyCount: 8 },
      { id: 3, question: '刻好的章可以去哪里取？支持邮寄吗？', replyCount: 3 },
      { id: 4, question: '电子印章和实体章有什么区别？', replyCount: 6 },
      { id: 5, question: '刻章备案是必须的吗？', replyCount: 4 }
    ],
    personalQaList: [
      { id: 1, question: '个人刻章需要什么材料？', replyCount: 6 },
      { id: 2, question: '个人私章和职业章有什么区别？', replyCount: 4 },
      { id: 3, question: '个人职业章可以在其他公司用吗？', replyCount: 3 },
      { id: 4, question: '个人刻章需要备案吗？', replyCount: 5 },
      { id: 5, question: '个人印章多久能刻好？', replyCount: 7 }
    ],
    qaList: []
  },
  lifetimes: {
    attached() {
      this.setData({
        qaList: this.properties.isPersonal ? this.data.personalQaList : this.data.bizQaList
      });
    }
  },
  methods: {
    viewAll() {
      wx.navigateTo({ url: '/pages/seal/qa/index' });
    },
    onQuestionTap(e) {
      const id = e.currentTarget.dataset.id;
      wx.navigateTo({ url: '/pages/seal/qa/index?id=' + id });
    }
  }
});
