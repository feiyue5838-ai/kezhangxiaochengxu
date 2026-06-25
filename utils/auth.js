/**
 * utils/auth.js — 鉴权工具
 */

/**
 * 检查是否已登录
 */
function isLogin() {
  return !!wx.getStorageSync('token') || !!wx.getStorageSync('isGuest');
}

/**
 * 检查是否游客
 */
function isGuest() {
  return !!wx.getStorageSync('isGuest');
}

/**
 * 获取用户信息
 */
function getUserInfo() {
  return wx.getStorageSync('userInfo') || null;
}

/**
 * 获取 Token
 */
function getToken() {
  return wx.getStorageSync('token') || '';
}

/**
 * 退出登录
 */
function logout() {
  wx.removeStorageSync('token');
  wx.removeStorageSync('userInfo');
  wx.removeStorageSync('isLogin');
  wx.removeStorageSync('isGuest');
}

/**
 * 带鉴权的请求封装
 * - 已登录：自动带上 token
 * - 未登录：跳转登录页
 *
 * @param {Object} options wx.request 同款参数
 * @returns {Promise} 请求结果
 */
function request(options = {}) {
  return new Promise((resolve, reject) => {
    // 未登录拦截
    if (!isLogin()) {
      wx.navigateTo({ url: '/pages/auth/index' });
      return reject(new Error('not login'));
    }

    const token = getToken();
    const header = { ...(options.header || {}) };
    if (token) {
      header['Authorization'] = 'Bearer ' + token;
    }

    wx.request({ timeout: 15000,
      ...options,
      header,
      success: (res) => {
        // token 过期
        if (res.statusCode === 401 || (res.data && res.data.code === 401)) {
          logout();
          wx.navigateTo({ url: '/pages/auth/index' });
          return reject(new Error('token expired'));
        }
        resolve(res.data);
      },
      fail: (err) => {
        wx.showToast({ title: '网络异常', icon: 'none' });
        reject(err);
      }
    });
  });
}

/**
 * 需要登录的页面生命周期包装
 * 用法：在 Page() 的 onLoad/onShow 中调用
 *
 *   const { checkAuth } = require('../../utils/auth.js');
 *   onLoad() { checkAuth(this); }
 *
 * @param {PageInstance} page Page 实例
 */
function checkAuth(page) {
  if (!isLogin()) {
    // 延迟跳转避免页面渲染闪烁
    setTimeout(() => {
      wx.navigateTo({ url: '/pages/auth/index' });
    }, 100);
    return false;
  }
  return true;
}

module.exports = {
  isLogin,
  isGuest,
  getUserInfo,
  getToken,
  logout,
  request,
  checkAuth,
};
