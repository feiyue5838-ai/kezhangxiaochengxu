// components/user-comment-block/index.js
Component({
  properties: {
    isPersonal: { type: Boolean, value: false }
  },
  observers: {
    isPersonal(val) {
      this.updateCommentList(val);
    }
  },
  data: {
    bizCommentList: [
      { id: 1, maskedPhone: '138****6688', date: '2026-05-20', serviceScore: 5, qualityScore: 5, text: '刻章速度很快，当天就收到了，质量也很好，推荐！' },
      { id: 2, maskedPhone: '159****2231', date: '2026-05-18', serviceScore: 5, qualityScore: 4, text: '客服态度很好，耐心解答了我的问题，刻章也很正规。' },
      { id: 3, maskedPhone: '136****5512', date: '2026-05-15', serviceScore: 5, qualityScore: 5, text: '公司急需刻章，这里当天就办好了，非常满意！' }
    ],
    personalCommentList: [
      { id: 1, maskedPhone: '189****3321', date: '2026-06-05', serviceScore: 5, qualityScore: 5, text: '个人私章刻得很精致，师傅手艺好！' },
      { id: 2, maskedPhone: '177****8902', date: '2026-06-02', serviceScore: 5, qualityScore: 5, text: '律师章刻好了，很正规，值得信赖。' },
      { id: 3, maskedPhone: '135****4578', date: '2026-05-28', serviceScore: 5, qualityScore: 4, text: '执业药师章很清晰，速度也快。' }
    ],
    commentList: []
  },
  lifetimes: {
    attached() {
      this.updateCommentList(this.properties.isPersonal);
    }
  },
  methods: {
    updateCommentList(isPersonal) {
      const source = isPersonal ? this.data.personalCommentList : this.data.bizCommentList;
      const list = source.map(item => ({
        ...item,
        serviceStars: Array(5).fill(0).map((_, i) => ({
          type: i < item.serviceScore ? 'gold' : 'gray',
          char: '★'
        })),
        qualityStars: Array(5).fill(0).map((_, i) => ({
          type: i < item.qualityScore ? 'gold' : 'gray',
          char: '★'
        }))
      }));
      this.setData({ commentList: list });
    },
    viewAll() {
      wx.navigateTo({ url: '/pages/seal/reviews/index' });
    }
  }
});
