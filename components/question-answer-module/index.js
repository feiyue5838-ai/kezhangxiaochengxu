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
      { id: 1, question: '刻章需要多长时间能拿到？', replies: [{ author: '客服小蓉', text: '正常情况1-2个工作日，加急可以当天拿到。' }, { author: '用户138****6688', text: '我上次上午下单，下午就收到了，很快！' }] },
      { id: 2, question: '公司刻章需要准备哪些材料？', replies: [{ author: '客服小蓉', text: '需要营业执照副本、法人身份证、经办人身份证。' }] },
      { id: 3, question: '刻好的章可以去哪里取？支持邮寄吗？', replies: [{ author: '客服小蓉', text: '支持到店自取和快递邮寄两种方式，成都市内快递次日达。' }] },
      { id: 4, question: '电子印章和实体章有什么区别？', replies: [{ author: '客服小蓉', text: '电子印章用于电子合同签署，与实体章具有同等法律效力。' }] },
      { id: 5, question: '刻章备案是必须的吗？', replies: [{ author: '客服小蓉', text: '是的，根据《印章管理办法》，刻章后必须在公安机关备案。我们平台会代办备案。' }] }
    ],
    personalQaList: [
      { id: 1, question: '个人刻章需要什么材料？', replies: [{ author: '客服小蓉', text: '需要本人身份证原件及复印件。' }] },
      { id: 2, question: '个人私章和职业章有什么区别？', replies: [{ author: '客服小蓉', text: '私章是个人签名使用，职业章标注有执业资格类别。' }] },
      { id: 3, question: '个人职业章可以在其他公司用吗？', replies: [{ author: '客服小蓉', text: '职业章属于个人执业印章，与单位无关，可以跨公司使用。' }] },
      { id: 4, question: '个人刻章需要备案吗？', replies: [{ author: '客服小蓉', text: '个人私章不强制备案，但个人职业章建议备案。' }] },
      { id: 5, question: '个人印章多久能刻好？', replies: [{ author: '客服小蓉', text: '个人印章通常1小时内可取，加急可更快。' }] }
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
      const isPersonal = this.properties.isPersonal ? 'true' : 'false';
      wx.navigateTo({ url: '/pages/seal/qa/index?isPersonal=' + isPersonal });
    },
    onQuestionTap(e) {
      const id = e.currentTarget.dataset.id;
      const isPersonal = this.properties.isPersonal ? 'true' : 'false';
      wx.navigateTo({ url: '/pages/seal/qa/index?id=' + id + '&isPersonal=' + isPersonal });
    }
  }
});
