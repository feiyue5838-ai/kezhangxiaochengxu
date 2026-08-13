// pages/order/rate/index.js
const api = require('../../../utils/api');

const STAR_LABELS = ['很差', '较差', '一般', '满意', '非常满意'];
const TAG_OPTIONS = ['质量好', '速度快', '服务好', '价格实惠', '包装完好'];

Page({
  data: {
    orderId: '',
    order: null,
    star: 5,
    starLabels: STAR_LABELS,
    tagOptions: TAG_OPTIONS,
    selectedTags: [],
    content: '',
    images: [],
    submitting: false,
  },

  onLoad(opt) {
    const { id, module } = opt;
    if (!id) {
      wx.showToast({ title: '参数错误', icon: 'none' });
      wx.navigateBack();
      return;
    }
    this.setData({ orderId: id });
    // 优先从 Storage 读缓存订单
    const stored = wx.getStorageSync('orderToRate');
    if (stored && stored.id === id) {
      this.setData({ order: stored });
    } else {
      this.fetchOrder(id);
    }
  },

  fetchOrder(id) {
    api.getSealOrderDetail(id).then(res => {
      const d = res.data || res;
      this.setData({ order: d });
    }).catch(() => {
      wx.showToast({ title: '加载订单失败', icon: 'none' });
    });
  },

  goBack() { wx.navigateBack(); },

  onSelectStar(e) {
    this.setData({ star: e.currentTarget.dataset.star });
  },

  onToggleTag(e) {
    const tag = e.currentTarget.dataset.tag;
    const { selectedTags } = this.data;
    const idx = selectedTags.indexOf(tag);
    if (idx >= 0) {
      selectedTags.splice(idx, 1);
    } else {
      selectedTags.push(tag);
    }
    this.setData({ selectedTags });
  },

  onContentInput(e) {
    this.setData({ content: e.detail.value });
  },

  onAddImg() {
    if (this.data.images.length >= 3) {
      wx.showToast({ title: '最多3张图片', icon: 'none' });
      return;
    }
    wx.chooseImage({
      count: 3 - this.data.images.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFiles = res.tempFilePaths;
        // 先显示本地预览
        this.setData({ images: [...this.data.images, ...tempFiles] });
        // 异步上传到服务器
        this.uploadImages(tempFiles);
      },
    });
  },

  uploadImages(paths) {
    const { images } = this.data;
    // 上传完成后替换本地路径为线上URL
    const uploadOne = (idx) => {
      if (idx >= paths.length) return;
      api.uploadReviewImage(paths[idx]).then(res => {
        const url = (res.data && res.data.url) || res.url || '';
        if (url) {
          const newImages = [...this.data.images];
          // 找到第一个本地路径替换
          const localIdx = newImages.indexOf(paths[idx]);
          if (localIdx >= 0) newImages[localIdx] = url;
          this.setData({ images: newImages });
        }
        uploadOne(idx + 1);
      }).catch(() => {
        // 上传失败，保留本地路径（可能404，但不影响提交）
        uploadOne(idx + 1);
      });
    };
    uploadOne(0);
  },

  onRemoveImg(e) {
    const idx = e.currentTarget.dataset.idx;
    const images = [...this.data.images];
    images.splice(idx, 1);
    this.setData({ images });
  },

  onSubmit() {
    const { star, selectedTags, content, images, orderId, submitting } = this.data;
    if (submitting) return;
    this.setData({ submitting: true });
    wx.showLoading({ title: '提交中...' });

    api.submitReview(orderId, {
      rating: star,
      tags: selectedTags,
      content: content.trim(),
      images: images.filter(i => i.startsWith('http')),
    }).then(() => {
      wx.hideLoading();
      wx.showToast({ title: '评价成功', icon: 'success' });
      // 清除缓存
      wx.removeStorageSync('orderToRate');
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }).catch(err => {
      wx.hideLoading();
      const msg = err && err.message ? err.message : '提交失败，请重试';
      wx.showToast({ title: msg, icon: 'none' });
      this.setData({ submitting: false });
    });
  },
});
