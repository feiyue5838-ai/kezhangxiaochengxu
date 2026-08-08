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
  wx.removeStorageSync('license_orders');    // 许可证订单列表
  wx.removeStorageSync('currentOrderId');    // 当前订单 ID
  wx.removeStorageSync('seal_orders_detail');// 订单详情页缓存

  // — 网点绑定缓存 —
  wx.removeStorageSync('outletToken');         // 网点 token
  wx.removeStorageSync('outletInfo');          // 网点信息（名称/绑定状态）

  // — 业务表单草稿缓存 —
  wx.removeStorageSync('selectedSealsData');   // 印章选择数据（含名称/数量）
  wx.removeStorageSync('sealOrderForm');       // 刻章表单（执照地区/刻章原因/公司名/手机）
  wx.removeStorageSync('materialUploadContext'); // 印章材料上传上下文
  wx.removeStorageSync('newspaperTemplate');   // 登报模板（含姓名/证件号）
  wx.removeStorageSync('formPageNavData');     // 登报业务类型/文档名称
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
