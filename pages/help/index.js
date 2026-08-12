const api = require('../../utils/api.js');

Page({
  data: {
    openIndex: -1,     // 当前展开的 FAQ 索引（flatFaqs 数组下标）
    categories: [],     // 分类网格 [{id, name, icon}]
    flatFaqs: [],       // 扁平化 FAQ 列表 [{id, categoryId, question, answer}]
    phone: '4008886666',  // 客服电话（默认兜底）
    loading: true,
  },

  onLoad() {
    this.loadFaqs();
  },

  loadFaqs() {
    api.getFaqList().then((res) => {
      const { categories = [], phone = '4008886666' } = res.data || {};
      // 扁平化所有分类下的问答，保留 categoryId 以便分类过滤
      const flatFaqs = [];
      (categories || []).forEach(function(cat) {
        (cat.faqs || []).forEach(function(faq) {
          flatFaqs.push({
            id: faq.id,
            categoryId: cat.id,
            question: faq.question,
            answer: faq.answer,
          });
        });
      });
      this.setData({
        categories: categories,
        flatFaqs: flatFaqs,
        phone: phone,
        loading: false,
      });
    }).catch(function() {
      this.setData({ loading: false });
    }.bind(this));
  },

  onFaqTap(e) {
    const idx = e.currentTarget.dataset.index;
    this.setData({ openIndex: this.data.openIndex === idx ? -1 : idx });
  },

  onCatTap(e) {
    const catId = e.currentTarget.dataset.id;
    const cats = this.data.categories;
    const cat = cats.find(function(c) { return c.id === catId; });
    if (!cat) return;
    // 扁平化当前分类下的问答，显示在 FAQ 列表区域
    const catFaqs = (cat.faqs || []).map(function(faq, i) {
      return {
        id: faq.id,
        categoryId: catId,
        question: faq.question,
        answer: faq.answer,
      };
    });
    this.setData({ flatFaqs: catFaqs, openIndex: -1 });
    wx.showToast({
      title: '正在为您解答「' + (cat.name || '') + '」',
      icon: 'none',
    });
  },

  onCallService() {
    const phone = this.data.phone;
    wx.makePhoneCall({
      phoneNumber: String(phone),
      fail: function() {
        wx.showToast({ title: '拨打失败', icon: 'none' });
      },
    });
  },

  onBack() {
    wx.navigateBack();
  },
});
