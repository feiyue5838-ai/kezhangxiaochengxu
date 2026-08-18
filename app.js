// app.js
const auth = require('./utils/auth.js');

App({
  globalData: {
    userInfo: null,
    token: null,
    isLogin: false,
    isGuest: false,
    privacyAuthorized: false,
    // 导航栏高度（启动时计算一次，全局共享）
    navigationHeight: null
  },

  onLaunch() {
    // 同步登录态到 globalData（热启动时刷新）
    this._syncAuthState();

    // 计算导航栏高度（一次性计算，所有页面共享）
    this._calculateNavigationHeight();

    // 检查隐私授权状态
    if (wx.getPrivacySetting) {
      wx.getPrivacySetting({
        success: (res) => {
          this.globalData.privacyAuthorized = !res.needAuthorization;
        }
      });
    }
  },

  /**
   * 同步 Storage 登录态到 globalData
   */
  _syncAuthState() {
    this.globalData.isLogin = auth.isLogin();
    this.globalData.isGuest = auth.isGuest();
    this.globalData.userInfo = auth.getUserInfo();
    this.globalData.token = auth.getToken();
  },

  /**
   * 刷新全局登录态（登录/退出后调用）
   */
  refreshAuthState() {
    this._syncAuthState();
  },

  /**
   * 计算导航栏高度并存储到 globalData
   */
  _calculateNavigationHeight() {
    let statusBarHeight = 20;
    let navHeight = 84;  // 20 + 64
    try {
      // 优先使用新 API（避免 deprecated 警告）
      const sysInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
      statusBarHeight = sysInfo.statusBarHeight || 20;
      navHeight = statusBarHeight + 64;  // 改成 64px 内容区
    } catch (_e) {
      // 使用默认值
    }
    this.globalData.navigationHeight = { statusBarHeight, navHeight };
  }
});
