// components/bottom-bar/index.js
// 底部提交栏组件，替代原来各页面中重复的 bottom-bar 代码块
Component({
  properties: {
    price: { type: Number, value: 0 },
    btnText: { type: String, value: '下一步：选择报纸' },
    label: { type: String, value: '应付' },
    selected: { type: Number, value: 0 }
  },
  methods: {
    onBtnTap: function () {
      this.triggerEvent('submit');
    },
    onBackTap: function () {
      this.triggerEvent('back');
    },
    switchTab: function (e) {
      const index = Number(e.currentTarget.dataset.index);
      const pages = ['/pages/seal-tab/index', '/pages/newspaper-tab/index', '/pages/home/index', '/pages/bookkeeping-tab/index', '/pages/profile/index'];
      wx.switchTab({ url: pages[index] });
    }
  }
});
