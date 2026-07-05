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
    // 是否显示返回键（自动计算，可手动覆盖）
    showBack: {
      type: Boolean,
      value: true
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
    navContentHeight: 44,
    capsuleLeft: 0,
    capsuleTop: 0,
    capsuleWidth: 0,
    capsuleHeight: 32,
    showBack: true
  },

  /**
   * 生命周期
   */
  lifetimes: {
    attached() {
      const systemInfo = wx.getSystemInfoSync();
      const statusBarHeight = systemInfo.statusBarHeight;

      let navContentHeight = 44;
      let capsuleLeft = 0;
      let capsuleTop = 0;
      let capsuleWidth = 0;
      let capsuleHeight = 32;

      try {
        const capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          capsuleLeft = capsule.left;
          capsuleTop = capsule.top;
          capsuleWidth = capsule.width;
          capsuleHeight = capsule.height;
          navContentHeight = capsule.bottom - statusBarHeight;
          navContentHeight = Math.max(32, Math.min(64, navContentHeight));
        }
      } catch (e) {}

      // 判断是否显示返回按钮（首页无上一页则隐藏）
      const pages = getCurrentPages();
      const showBack = pages.length > 1;

      this.setData({
        statusBarHeight,
        navContentHeight,
        navHeight: statusBarHeight + navContentHeight,
        capsuleLeft,
        capsuleTop,
        capsuleWidth,
        capsuleHeight,
        showBack
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