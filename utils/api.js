/**
 * 蓉城企服 - API 接口封装（改进版）
 * 所有路径与后端路由对齐
 */

const API_BASE = 'http://192.168.31.219:7890';

const request = (options) => {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token');

    wx.request({
      url: API_BASE + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      timeout: options.timeout || 15000,
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.header
      },
      success: (res) => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          // 兼容：无 code 字段时直接返回 data（如后端直接返回对象）；有 code 时验证为 0
          if (res.data.code === 0 || res.data.code === undefined) {
            resolve(res.data.data !== undefined ? res.data.data : res.data);
          } else {
            const errorMsg = res.data.message || '请求失败';
            wx.showToast({ title: errorMsg, icon: 'none', duration: 2000 });
            reject(new Error(errorMsg));
          }
        } else if (res.statusCode === 401) {
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
          wx.showToast({ title: '登录已过期，请重新登录', icon: 'none' });
          // 跳转登录页，避免用户被卡死（与 auth.request 行为对齐）
          const pages = getCurrentPages();
          const cur = pages[pages.length - 1];
          if (!cur || cur.route !== 'pages/auth/index') {
            wx.navigateTo({ url: '/pages/auth/index' });
          }
          reject(new Error('未授权，请重新登录'));
        } else if (res.statusCode === 403) {
          wx.showToast({ title: '没有权限访问', icon: 'none', duration: 2000 });
          reject(new Error('没有权限访问'));
        } else if (res.statusCode === 500) {
          wx.showToast({ title: '服务器内部错误', icon: 'none', duration: 2000 });
          reject(new Error('服务器内部错误'));
        } else {
          wx.showToast({ title: `请求失败(${res.statusCode})`, icon: 'none', duration: 2000 });
          reject(new Error(`请求失败(${res.statusCode})`));
        }
      },
      fail: (err) => {
        wx.getNetworkType({
          success: (networkRes) => {
            if (networkRes.networkType === 'none') {
              wx.showToast({ title: '网络连接失败，请检查网络', icon: 'none', duration: 2000 });
            } else if (err.errMsg && err.errMsg.includes('timeout')) {
              wx.showToast({ title: '请求超时，请稍后重试', icon: 'none', duration: 2000 });
            } else {
              wx.showToast({ title: '网络请求失败，请稍后重试', icon: 'none', duration: 2000 });
            }
          },
          fail: () => {
            wx.showToast({ title: '网络请求失败', icon: 'none', duration: 2000 });
          }
        });
        reject(err);
      }
    });
  });
};

module.exports = {
  // ==================== 认证相关 ====================
  // 微信登录 → POST /api/auth/wx-login
  wxLogin: (code) => request({ url: '/api/auth/wx-login', method: 'POST', data: { code } }),
  // 门店登录 → POST /api/auth/store-login
  storeLogin: (data) => request({ url: '/api/auth/store-login', method: 'POST', data: data }),

  // ==================== 用户相关 ====================
  // 获取用户信息 → GET /api/user/profile
  getUserInfo: () => request({ url: '/api/user/profile' }),
  // 更新用户信息 → PUT /api/user/profile
  updateUserInfo: (data) => request({ url: '/api/user/profile', method: 'PUT', data: data }),

  // ==================== 印章服务 ====================
  // 印章分类 → GET /api/seals/categories
  getSealCategories: () => request({ url: '/api/seals/categories' }),
  // 印章列表 → GET /api/seals
  getSealList: (params) => request({ url: '/api/seals', data: params }),
  // 印章套餐 → GET /api/seals/packages
  getSealPackages: (params) => request({ url: '/api/seals/packages', data: params }),
  // 印章业务场景（统一走 categories 接口） → GET /api/seals/categories
  getSealScenes: () => request({ url: '/api/seals/categories' }),
  // 分类下的印章+套餐 → GET /api/seals/categories/:id
  getSealSceneProducts: (sceneId) => request({ url: `/api/seals/categories/${sceneId}` }),
  // 创建刻章订单 → POST /api/orders/seal
  createSealOrder: (data) => request({ url: '/api/orders/seal', method: 'POST', data: data }),
  // 刻章订单列表 → GET /api/orders/seal
  getSealOrderList: (params) => request({ url: '/api/orders/seal', data: params }),
  // 刻章订单详情 → GET /api/orders/:id
  getSealOrderDetail: (id) => request({ url: `/api/orders/${id}` }),
  // 获取刻章订单微信支付参数 → POST /api/orders/:id/pay
  getSealPayParams: (id, openid) => request({ url: `/api/orders/${id}/pay`, method: 'POST', data: { openid: openid || '' } }),
  // 开发环境模拟微信支付回调（生产环境该接口返回 403）→ POST /api/orders/:id/dev-paid
  devConfirmPay: (id) => request({ url: `/api/orders/${id}/dev-paid`, method: 'POST' }),

  // ==================== 登报服务 ====================
  // 报纸分类 → GET /api/newspapers/categories
  getNewspaperCategories: () => request({ url: '/api/newspapers/categories' }),
  // 报纸列表 → GET /api/newspapers
  getNewspaperList: (params) => request({ url: '/api/newspapers', data: params }),
  // 报纸模板 → GET /api/newspapers/templates?categoryId=xxx
  getNewspaperTemplate: (categoryId) => request({ url: '/api/newspapers/templates', data: { categoryId } }),
  // 报纸价格 → GET /api/newspapers/price
  getNewspaperPrice: (data) => request({ url: '/api/newspapers/price', data }),
  // 创建登报订单 → POST /api/orders/newspaper
  createNewspaperOrder: (data) => request({ url: '/api/orders/newspaper', method: 'POST', data: data }),
  // 登报订单列表 → GET /api/orders?module=newspaper
  getNewspaperOrderList: (params) => request({ url: '/api/orders', data: { ...params, module: 'newspaper' } }),
  // 登报订单详情 → GET /api/orders/:id
  getNewspaperOrderDetail: (id) => request({ url: `/api/orders/${id}` }),
  // 登报订单微信支付参数 → POST /api/orders/:id/pay
  getNewspaperPayParams: (id, openid) => request({ url: `/api/orders/${id}/pay`, method: 'POST', data: { openid: openid || '' } }),
  // 用户取消订单 / 申请退款 → POST /api/orders/:id/cancel
  cancelNewspaperOrder: (id) => request({ url: `/api/orders/${id}/cancel`, method: 'POST' }),

  // ==================== 收货地址 ====================
  // 地址列表 → GET /api/users/addresses
  getAddressList: () => request({ url: '/api/users/addresses' }),
  // 新增地址 → POST /api/users/addresses
  addAddress: (data) => request({ url: '/api/users/addresses', method: 'POST', data: data }),
  // 更新地址 → PUT /api/users/addresses/:id
  updateAddress: (id, data) => request({ url: `/api/users/addresses/${id}`, method: 'PUT', data: data }),
  // 删除地址 → DELETE /api/users/addresses/:id
  deleteAddress: (id) => request({ url: `/api/users/addresses/${id}`, method: 'DELETE' }),

  // ==================== 门店端 ====================
  // 门店订单列表 → GET /api/stores/me/orders
  getStoreOrders: (params) => request({ url: '/api/stores/me/orders', data: params }),
  // 接单 → PUT /api/stores/me/orders/:id/accept
  acceptOrder: (id) => request({ url: `/api/stores/me/orders/${id}/accept`, method: 'PUT' }),
  // 完成制作 → PUT /api/stores/me/orders/:id/complete
  completeOrder: (id, data) => request({ url: `/api/stores/me/orders/${id}/complete`, method: 'PUT', data }),
  // 发货 → PUT /api/stores/me/orders/:id/ship
  shipOrder: (id, data) => request({ url: `/api/stores/me/orders/${id}/ship`, method: 'PUT', data }),
  // 上传交付凭证 → POST /api/stores/me/receipts
  uploadReceipt: (data) => request({ url: '/api/stores/me/receipts', method: 'POST', data }),

  // ==================== 通用 ====================
  // 文件上传（用户侧）→ POST /api/upload/user-image
  // 后端直返 { url }，兼容可能的 { code:0, data } 包装
  uploadFile: (filePath, endpoint) => {
    return new Promise((resolve, reject) => {
      const token = wx.getStorageSync('token');
      wx.uploadFile({
        url: API_BASE + (endpoint || '/api/upload/user-image'),
        filePath: filePath,
        name: 'file',
        timeout: 30000,
        header: {
          'Authorization': token ? `Bearer ${token}` : ''
        },
        success: (res) => {
          let data;
          try { data = JSON.parse(res.data); } catch (e) { reject(new Error('上传返回解析失败')); return; }
          // 后端直返 { url }；兼容 { code:0, data:url } 包装
          const url = (data && typeof data.url === 'string') ? data.url
            : (data && data.code === 0 ? data.data : null);
          if (url) {
            resolve(url);
          } else {
            const msg = (data && data.message) || '上传失败';
            wx.showToast({ title: msg, icon: 'none', duration: 2000 });
            reject(new Error(msg));
          }
        },
        fail: (err) => {
          wx.getNetworkType({
            success: (networkRes) => {
              if (networkRes.networkType === 'none') {
                wx.showToast({ title: '网络连接失败，请检查网络', icon: 'none', duration: 2000 });
              } else {
                wx.showToast({ title: '文件上传失败', icon: 'none', duration: 2000 });
              }
            },
            fail: () => {
              wx.showToast({ title: '文件上传失败', icon: 'none', duration: 2000 });
            }
          });
          reject(err);
        }
      });
    });
  },

  // ==================== 系统配置 ====================
  // 获取单个配置（公开接口，无需登录）: GET /api/config?key=xxx
  // 后端直接返回配置值（如数组/字符串），request 封装会自动 resolve 为值本身
  getConfig: (key) => request({ url: '/api/config', data: { key } }),
};

