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
    images: [],          // 提交用：已上传的线上相对路径（/uploads/...）
    displayImages: [],   // 预览用：本地临时路径或完整线上 URL
    submitting: false,
  },

  onLoad(opt) {
    const { id, _module } = opt;
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
        // 本地路径可直接预览，先同步进两个数组
        this.setData({
          images: [...this.data.images, ...tempFiles],
          displayImages: [...this.data.displayImages, ...tempFiles],
        });
        // 异步上传到服务器
        this.uploadImages(tempFiles);
      },
    });
  },

  uploadImages(paths) {
    // 上传完成后把本地路径替换为线上相对路径（提交用），预览用完整 URL
    const uploadOne = (idx) => {
      if (idx >= paths.length) return;
      api.uploadReviewImage(paths[idx]).then(url => {
        if (url) {
          const images = [...this.data.images];
          const displayImages = [...this.data.displayImages];
          const localIdx = images.indexOf(paths[idx]);
          if (localIdx >= 0) {
            images[localIdx] = url;
            displayImages[localIdx] = api.resolveImage(url);
            this.setData({ images, displayImages });
          }
        }
        uploadOne(idx + 1);
      }).catch(() => {
        // 上传失败，保留本地路径（提交时会被过滤掉），提示用户
        wx.showToast({ title: '图片上传失败，请重试', icon: 'none' });
        uploadOne(idx + 1);
      });
    };
    uploadOne(0);
  },

  onRemoveImg(e) {
    const idx = e.currentTarget.dataset.idx;
    const images = [...this.data.images];
    const displayImages = [...this.data.displayImages];
    images.splice(idx, 1);
    displayImages.splice(idx, 1);
    this.setData({ images, displayImages });
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
      // 只提交已成功上传的线上图片（相对路径 /uploads/...），过滤本地临时路径
      images: images.filter(i => typeof i === 'string' && i.indexOf('/uploads') > -1),
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
