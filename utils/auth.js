/**
 * utils/auth.js — 鉴权工具
 */

/**
 * 检查是否已登录 - A-04: 游客不算已登录
 */
function isLogin() {
  return !!wx.getStorageSync('token');
}

/**
 * 检查是否可以浏览（游客允许）
 */
function canBrowse() {
  return isLogin() || isGuest();
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
 * [L5] 清 token + 用户基本信息 + 所有含 PII 的业务缓存
 * （地址/发票/手机号/订单历史/openid/实名状态/网点 token）
 */
function logout() {
  wx.removeStorageSync('token');
  wx.removeStorageSync('userInfo');
  wx.removeStorageSync('isLogin');
  wx.removeStorageSync('isGuest');

  // — PII 业务缓存 —
  wx.removeStorageSync('deliveryAddress');    // 收货地址（含姓名/电话/门牌）
  wx.removeStorageSync('selectedAddress');    // 选中的地址
  wx.removeStorageSync('editingAddress');     // 编辑中的地址
  wx.removeStorageSync('invoiceData');        // 发票抬头信息
  wx.removeStorageSync('invoiceInfo');        // 发票详细信息
  wx.removeStorageSync('sealOrderPhone');    // 订单联系人手机号
  wx.removeStorageSync('orderRemark');        // 订单备注
  wx.removeStorageSync('realname_verify');    // 实名认证状态 + 脱敏身份证号
  wx.removeStorageSync('openid');             // 微信 openid（若本地存了）
  wx.removeStorageSync('aftersale_order');    // 售后申请草稿
  wx.removeStorageSync('aftersale_records');  // 售后记录列表
  wx.removeStorageSync('aftersaleCurrent');  // 售后当前详情

  // — 订单历史缓存 —
  wx.removeStorageSync('seal_orders');        // 刻章订单列表
  wx.removeStorageSync('newspaper_orders');  // 登报订单列表
  wx.removeStorageSync('currentOrderId');    // 当前订单 ID
  wx.removeStorageSync('seal_orders_detail');// 订单详情页缓存

  // — 网点绑定缓存 —
  wx.removeStorageSync('outletToken');         // 网点 token
  wx.removeStorageSync('outletInfo');          // 网点信息（名称/绑定状态）

  // — openid（微信登录身份）—
  wx.removeStorageSync('openid');             // 微信 openid（若本地存了）

  // — outletToken/outletInfo/outletId 的网点账号独立登出请用 outletLogout() —

  // — 业务表单草稿缓存 —
  wx.removeStorageSync('selectedSealsData');   // 印章选择数据（含名称/数量）
  wx.removeStorageSync('sealOrderForm');       // 刻章表单（执照地区/刻章原因/公司名/手机）
  wx.removeStorageSync('materialInfo');          // 印章材料信息（含证件照/营业执照，换账号须清除）
  wx.removeStorageSync('materialUploadContext'); // 印章材料上传上下文
  wx.removeStorageSync('newspaperTemplate');   // 登报模板（含姓名/证件号）
  wx.removeStorageSync('formPageNavData');     // 登报业务类型/文档名称
}


/**
 * 刷新全局登录态（登录/退出后调用）
 * 将 Storage 中的登录态同步到 app.globalData，使各页面可通过 getApp() 读到最新状态。
 * 同时将 userInfo / token / isLogin / isGuest 同步到 Storage 以便 auth.js 各函数使用。
 * [Storage 隔离修复] auth 模块不再依赖 getApp()，此函数仅用于同步 app.globalData（主包兼容层）。
 * @param {Object} appInstance 可选，传入 getApp() 结果；分包中无可用 app 实例时可不传
 */
function refreshAuthState(appInstance) {
  // 始终从 Storage 读取最新值
  const isLogin = !!wx.getStorageSync('token') || !!wx.getStorageSync('isGuest');
  const isGuest = !!wx.getStorageSync('isGuest');
  const userInfo = wx.getStorageSync('userInfo') || null;
  const token = wx.getStorageSync('token') || '';
  // 同步到 app.globalData（主包已启动时有效）
  if (appInstance && appInstance.globalData) {
    appInstance.globalData.isLogin = isLogin;
    appInstance.globalData.isGuest = isGuest;
    appInstance.globalData.userInfo = userInfo;
    appInstance.globalData.token = token;
  }
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
 * A-04: 游客默认不允许进入下单页（allowGuest=false）
 * @param {PageInstance} page Page 实例
 * @param {Object} options - { allowGuest: boolean } 是否允许游客进入
 */
function checkAuth(page, options = {}) {
  const { allowGuest = false } = options;
  
  // 已登录（有 token）
  if (isLogin()) return true;
  
  // 游客 + 允许游客进入
  if (allowGuest && isGuest()) return true;
  
  // 未登录：跳转登录页
  setTimeout(() => {
    wx.navigateTo({ url: '/pages/auth/index' });
  }, 100);
  return false;
}

module.exports = {
  isLogin,
  isGuest,
  canBrowse,  // A-04: 新增
  getUserInfo,
  getToken,
  logout,
  request,
  checkAuth,
  refreshAuthState,
};
