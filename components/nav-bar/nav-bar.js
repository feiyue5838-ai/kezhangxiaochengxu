Component({
  /**
   * 组件属性
   */
  properties: {
    // 标题
    title: {
      type: String,
      value: ''
    },
    // 是否显示返回键
    showBack: {
      type: Boolean,
      value: true
    },
    // 返回键文字（默认 "<"）
    backText: {
      type: String,
      value: '<'
    },
    // 背景颜色（默认主题蓝）
    backgroundColor: {
      type: String,
      value: '#5B6FE8'
    },
    // 文字颜色（默认白色）
    color: {
      type: String,
      value: '#ffffff'
    },
    // 是否使用固定定位（默认true）
    fixed: {
      type: Boolean,
      value: true
    },
    // 是否使用自定义中间内容（为true时隐藏默认标题，显示 center 插槽）
    customCenter: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件数据
   */
  data: {
    statusBarHeight: 20,
    navHeight: 64,
    navContentHeight: 44
  },

  /**
   * 生命周期
   */
  lifetimes: {
    attached() {
      const systemInfo = wx.getSystemInfoSync();
      const statusBarHeight = systemInfo.statusBarHeight;

      let navContentHeight = 44; // 默认 44px
      try {
        const capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          // navContentHeight = 胶囊底部距状态栏底的距离，即 (胶囊底部 - 状态栏顶部) - 状态栏高度
          navContentHeight = capsule.bottom - statusBarHeight;
          // 兜底：最小 32（胶囊高度），最大 64
          navContentHeight = Math.max(32, Math.min(64, navContentHeight));
        }
      } catch (e) {}

      this.setData({
        statusBarHeight,
        navContentHeight,
        navHeight: statusBarHeight + navContentHeight
      });
    }
  },

  /**
   * 组件方法
   */
  methods: {
    /**
     * 返回键点击事件
     */
    onBack() {
      this.triggerEvent('back');
    }
  }
});