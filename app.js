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

  // Storage 过期时间（24小时）
  STORAGE_EXPIRY_TIME: 24 * 60 * 60 * 1000,

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

    // 清理过期的 Storage 数据
    this._cleanExpiredStorage();
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
   * 清理过期的 Storage 数据
   * 扫描所有 Storage key，清理带 _timestamp 且超过过期时间的数据
   */
  _cleanExpiredStorage() {
    const now = Date.now();
    const expiryTime = this.STORAGE_EXPIRY_TIME;

    try {
      const res = wx.getStorageInfoSync();
      const keys = res.keys || [];

      keys.forEach(key => {
        try {
          const data = wx.getStorageSync(key);
          // 检查是否有 _timestamp 字段（带过期机制的数据）
          if (data && data._timestamp && (now - data._timestamp > expiryTime)) {
            wx.removeStorageSync(key);
          }
        } catch (e) {
          // 单个 key 读取失败，跳过
        }
      });

    } catch (e) {
      // 获取 Storage 信息失败
    }
  },

  /**
   * 带过期时间的 Storage 写入（工具方法，供页面调用）
   * @param {string} key - Storage key
   * @param {any} data - 要存储的数据
   */
  setStorageWithExpiry(key, data) {
    const wrappedData = {
      _timestamp: Date.now(),
      _data: data
    };
    wx.setStorageSync(key, wrappedData);
  },

  /**
   * 读取带过期时间的 Storage（工具方法，供页面调用）
   * @param {string} key - Storage key
   * @returns {any|null} 数据，过期或不存在返回 null
   */
  getStorageWithExpiry(key) {
    try {
      const wrappedData = wx.getStorageSync(key);
      if (!wrappedData) return null;

      // 新格式（带 _timestamp）
      if (wrappedData._timestamp) {
        const now = Date.now();
        if (now - wrappedData._timestamp > this.STORAGE_EXPIRY_TIME) {
          wx.removeStorageSync(key);
          return null;
        }
        return wrappedData._data;
      }

      // 旧格式（兼容，直接返回）
      return wrappedData;
    } catch (e) {
      return null;
    }
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
