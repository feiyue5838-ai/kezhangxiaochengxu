// app.js
const auth = require('./utils/auth.js');

App({
  // Storage 过期时间（24小时）
  STORAGE_EXPIRY_TIME: 24 * 60 * 60 * 1000,

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

    // 异步清理过期的 Storage 数据（不要阻塞启动期 JS 线程）
    this._scheduleCleanExpiredStorage();
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
   * 异步清理过期的 Storage 数据
   * 注意：必须在 onLaunch 里用 setTimeout(setData 周期) 分批执行，
   * 否则同步遍历会阻塞主线程触发 "timeout" SystemError（白屏）。
   */
  _scheduleCleanExpiredStorage() {
    let keys;
    try {
      keys = wx.getStorageInfoSync().keys || [];
    } catch (e) {
      return;
    }
    if (!keys.length) return;

    const now = Date.now();
    const expiryTime = this.STORAGE_EXPIRY_TIME;
    let i = 0;

    const cleanBatch = () => {
      const end = Math.min(i + 5, keys.length);
      for (; i < end; i++) {
        try {
          const data = wx.getStorageSync(keys[i]);
          if (data && data._timestamp && (now - data._timestamp > expiryTime)) {
            wx.removeStorageSync(keys[i]);
          }
        } catch (e) {
          // 单个 key 跳过
        }
      }
      if (i < keys.length) {
        setTimeout(cleanBatch, 0); // 让出主线程
      }
    };

    // 延后首帧启动，避免和 onLoad 抢主线程
    setTimeout(cleanBatch, 0);
  },

  /**
   * 计算导航栏高度并存储到 globalData
   */
  _calculateNavigationHeight() {
    let statusBarHeight = 20;
    let navHeight = 84;  // 20 + 64
    try {
      const sysInfo = wx.getDeviceInfo ? wx.getDeviceInfo() : wx.getSystemInfoSync();
      statusBarHeight = sysInfo.statusBarHeight || 20;
      navHeight = statusBarHeight + 64;  // 改成 64px 内容区
    } catch (e) {
      // 使用默认值
    }
    this.globalData.navigationHeight = { statusBarHeight, navHeight };
  }
});
