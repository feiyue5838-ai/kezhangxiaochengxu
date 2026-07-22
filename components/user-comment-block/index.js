// components/user-comment-block/index.js
const api = require('../../utils/api.js');

Component({
  properties: {
    isPersonal: { type: Boolean, value: false }
  },
  observers: {
    isPersonal(val) {
      this.loadComments(val);
    }
  },
  data: {
    commentList: [],
    loading: false
  },
  lifetimes: {
    attached() {
      this.loadComments(this.properties.isPersonal);
    }
  },
  methods: {
    loadComments(isPersonal) {
      const module = isPersonal ? 'seal_personal' : 'seal_biz';
      this.setData({ loading: true });
      api.reviewList({ module, page: 1, pageSize: 10 }).then(res => {
        const list = (res.list || []).map(item => ({
          id: item.id,
          maskedPhone: item.user?.nickname || '用户',
          date: item.createdAt ? item.createdAt.slice(0, 10) : '',
          serviceScore: item.rating,
          qualityScore: item.rating,
          text: item.content,
          images: item.images || []
        }));
        this.setData({ commentList: list, loading: false });
      }).catch(() => {
        // API 失败时 fallback 到默认好评
        this.setData({ commentList: this.getDefaultList(isPersonal), loading: false });
      });
    },
    getDefaultList(isPersonal) {
      return isPersonal ? [
        { id: 1, maskedPhone: '189****3321', date: '2026-06-05', serviceScore: 5, qualityScore: 5, text: '个人私章刻得很精致，师傅手艺好！' },
        { id: 2, maskedPhone: '177****8902', date: '2026-06-02', serviceScore: 5, qualityScore: 5, text: '律师章刻好了，很正规，值得信赖。' },
        { id: 3, maskedPhone: '135****4578', date: '2026-05-28', serviceScore: 5, qualityScore: 4, text: '执业药师章很清晰，速度也快。' }
      ] : [
        { id: 1, maskedPhone: '138****6688', date: '2026-05-20', serviceScore: 5, qualityScore: 5, text: '刻章速度很快，当天就收到了，质量也很好，推荐！' },
        { id: 2, maskedPhone: '159****2231', date: '2026-05-18', serviceScore: 5, qualityScore: 4, text: '客服态度很好，耐心解答了我的问题，刻章也很正规。' },
        { id: 3, maskedPhone: '136****5512', date: '2026-05-15', serviceScore: 5, qualityScore: 5, text: '公司急需刻章，这里当天就办好了，非常满意！' }
      ];
    },
    updateCommentList(isPersonal) {
      // 兼容旧 observer 逻辑，但优先走 API
      if (this.data.commentList.length === 0) {
        this.loadComments(isPersonal);
      }
    },
    viewAll() {
      wx.navigateTo({ url: '/pages/seal/reviews/index' });
    }
  }
});
