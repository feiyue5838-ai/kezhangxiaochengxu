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
        if (res.statusCode === 200) {
          if (res.data.code === 0) {
            resolve(res.data.data);
          } else {
            const errorMsg = res.data.message || '请求失败';
            wx.showToast({ title: errorMsg, icon: 'none', duration: 2000 });
            reject(new Error(errorMsg));
          }
        } else if (res.statusCode === 401) {
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
          wx.showToast({ title: '登录已过期，请重新登录', icon: 'none' });
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
  // 创建刻章订单 → POST /api/orders/seal
  createSealOrder: (data) => request({ url: '/api/orders/seal', method: 'POST', data: data }),
  // 刻章订单列表 → GET /api/orders/seal
  getSealOrderList: (params) => request({ url: '/api/orders/seal', data: params }),
  // 刻章订单详情 → GET /api/orders/seal/:id
  getSealOrderDetail: (id) => request({ url: `/api/orders/seal/${id}` }),

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
  // 登报订单列表 → GET /api/orders/newspaper
  getNewspaperOrderList: (params) => request({ url: '/api/orders/newspaper', data: params }),
  // 登报订单详情 → GET /api/orders/newspaper/:id
  getNewspaperOrderDetail: (id) => request({ url: `/api/orders/newspaper/${id}` }),

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
  // 文件上传 → POST /api/upload/image
  uploadFile: (filePath) => {
    return new Promise((resolve, reject) => {
      const token = wx.getStorageSync('token');
      wx.uploadFile({
        url: API_BASE + '/api/upload/image',
        filePath: filePath,
        name: 'file',
        timeout: 30000,
        header: {
          'Authorization': token ? `Bearer ${token}` : ''
        },
        success: (res) => {
          const data = JSON.parse(res.data);
          if (data.code === 0) {
            resolve(data.data);
          } else {
            wx.showToast({ title: data.message || '上传失败', icon: 'none', duration: 2000 });
            reject(new Error(data.message));
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
  }
};

