// components/business-introduce-card/index.js
Component({
  properties: {
    isPersonal: { type: Boolean, value: false }
  },
  observers: {
    isPersonal(val) {
      this.setData({
        imageList: val ? this.data.personalImageList : this.data.bizImageList
      });
    }
  },
  data: {
    bizImageList: [
      '/assets/images/business-intro-1.jpg',
      '/assets/images/business-intro-2.jpg',
      '/assets/images/business-intro-3.jpg',
      '/assets/images/business-intro-4.jpg',
      '/assets/images/business-intro-5.jpg',
      '/assets/images/business-intro-6.jpg'
    ],
    personalImageList: [
      '/assets/images/business-intro-1.jpg',
      '/assets/images/business-intro-2.jpg'
    ],
    imageList: []
  },
  lifetimes: {
    attached() {
      this.setData({
        imageList: this.properties.isPersonal ? this.data.personalImageList : this.data.bizImageList
      });
    }
  },
  methods: {
    onImagePreview(e) {
      const src = e.currentTarget.dataset.src;
      wx.previewImage({ urls: this.data.imageList, current: src });
    }
  }
});
