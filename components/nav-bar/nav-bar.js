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
    // 设备信息在 attached 计算（同步，避免 wx.getSystemInfo 废弃警告）
    attached() {
      try {
        const systemInfo = wx.getSystemInfoSync();
        const statusBarHeight = systemInfo.statusBarHeight || 20;

        // 再获取胶囊按钮信息
        try {
          const capsule = wx.getMenuButtonBoundingClientRect();
          if (capsule) {
            const navContentHeight = Math.max(
              32,
              Math.min(64, capsule.bottom - statusBarHeight)
            );
            this.setData({
              statusBarHeight,
              navContentHeight,
              navHeight: statusBarHeight + navContentHeight,
              capsuleLeft: capsule.left,
              capsuleTop: capsule.top,
              capsuleWidth: capsule.width,
              capsuleHeight: capsule.height
            });
          } else {
            this.setData({
              statusBarHeight,
              navHeight: statusBarHeight + 44
            });
          }
        } catch (e) {
          this.setData({
            statusBarHeight,
            navHeight: statusBarHeight + 44
          });
        }
      } catch (e) {
        this.setData({
          statusBarHeight: 20,
          navHeight: 64
        });
      }
    },

    // showBack 判断在 ready 时执行，避免与初始化阶段冲突
    ready() {
      // 自动判断是否需要返回键（页面栈 > 1 时显示）
      const pages = getCurrentPages();
      const autoShowBack = pages.length > 1;

      // 如果用户显式传了 showBack，以传入值为准；否则用自动判断
      const hasExplicitShowBack =
        this.properties.hasOwnProperty('showBack') &&
        typeof this.properties.showBack === 'boolean';
      const finalShowBack = hasExplicitShowBack
        ? this.properties.showBack
        : autoShowBack;

      this.setData({ showBack: finalShowBack });
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
      const pages = getCurrentPages();
      if (pages.length > 1) {
        wx.navigateBack({ delta: 1 });
      }
    }
  }
});
