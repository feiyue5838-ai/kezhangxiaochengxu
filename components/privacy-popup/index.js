Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    needPrivacy: {
      type: Boolean,
      value: false
    }
  },

  methods: {
    onClose() {
      this.triggerEvent('close');
    },

    onConfirm() {
      wx.setStorageSync('privacyAuthorized', true);
      this.triggerEvent('confirm');
    },

    onViewPrivacy() {
      wx.showToast({ title: '请前往官网查看隐私政策', icon: 'none' });
    },

    onViewTerms() {
      wx.showToast({ title: '请前往官网查看用户协议', icon: 'none' });
    }
  }
});
