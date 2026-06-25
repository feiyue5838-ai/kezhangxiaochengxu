/**
 * 蓉城企服 - API 接口封装（改进版）
 */

const API_BASE = 'https://api.rongchengqifu.com';

const request = (options) => {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token');

    wx.request({
      url: API_BASE + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      timeout: options.timeout || 15000,  // 默认15秒，可被 options.timeout 覆盖
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
            // 服务器返回错误码
            const errorMsg = res.data.message || '请求失败';
            wx.showToast({
              title: errorMsg,
              icon: 'none',
              duration: 2000
            });
            reject(new Error(errorMsg));
          }
        } else if (res.statusCode === 401) {
          // 未授权，清除登录态并跳转登录页
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
          wx.showToast({ title: '登录已过期，请重新登录', icon: 'none' });
          reject(new Error('未授权，请重新登录'));
        } else if (res.statusCode === 403) {
          wx.showToast({
            title: '没有权限访问',
            icon: 'none',
            duration: 2000
          });
          reject(new Error('没有权限访问'));
        } else if (res.statusCode === 500) {
          wx.showToast({
            title: '服务器内部错误',
            icon: 'none',
            duration: 2000
          });
          reject(new Error('服务器内部错误'));
        } else {
          wx.showToast({
            title: `请求失败(${res.statusCode})`,
            icon: 'none',
            duration: 2000
          });
          reject(new Error(`请求失败(${res.statusCode})`));
        }
      },
      fail: (err) => {
        // 网络请求失败，检查网络状态
        wx.getNetworkType({
          success: (networkRes) => {
            if (networkRes.networkType === 'none') {
              wx.showToast({
                title: '网络连接失败，请检查网络',
                icon: 'none',
                duration: 2000
              });
            } else if (err.errMsg && err.errMsg.includes('timeout')) {
              wx.showToast({
                title: '请求超时，请稍后重试',
                icon: 'none',
                duration: 2000
              });
            } else {
              wx.showToast({
                title: '网络请求失败，请稍后重试',
                icon: 'none',
                duration: 2000
              });
            }
          },
          fail: () => {
            // 获取网络状态失败，显示默认错误提示
            wx.showToast({
              title: '网络请求失败',
              icon: 'none',
              duration: 2000
            });
          }
        });

        reject(err);
      }
    });
  });
};

module.exports = {
  // 用户相关
  login: (code) => request({ url: '/api/login', method: 'POST', data: { code } }),
  getUserInfo: () => request({ url: '/api/user/info' }),
  updateUserInfo: (data) => request({ url: '/api/user/update', method: 'POST', data: data }),

  // 在线刻章
  getSealList: (params) => request({ url: '/api/seal/list', data: params }),
  getSealDetail: (id) => request({ url: `/api/seal/detail/${id}` }),
  createSealOrder: (data) => request({ url: '/api/seal/order', method: 'POST', data: data }),
  getSealOrderList: (params) => request({ url: '/api/seal/orders', data: params }),
  getSealOrderDetail: (id) => request({ url: `/api/seal/order/${id}` }),

  // 登报服务
  getNewspaperList: (params) => request({ url: '/api/newspaper/list', data: params }),
  getNewspaperCategory: () => request({ url: '/api/newspaper/category' }),
  getNewspaperTemplate: (categoryId) => request({ url: '/api/newspaper/template', data: { categoryId } }),
  createNewspaperOrder: (data) => request({ url: '/api/newspaper/order', method: 'POST', data: data }),
  getNewspaperOrderList: (params) => request({ url: '/api/newspaper/orders', data: params }),
  getNewspaperOrderDetail: (id) => request({ url: `/api/newspaper/order/${id}` }),

  // 调档服务
  getLicenseList: (params) => request({ url: '/api/license/list', data: params }),
  createLicenseOrder: (data) => request({ url: '/api/license/order', method: 'POST', data: data }),
  getLicenseOrderList: (params) => request({ url: '/api/license/orders', data: params }),
  getLicenseOrderDetail: (id) => request({ url: `/api/license/order/${id}` }),

  // 文件上传
  uploadFile: (filePath) => {
    return new Promise((resolve, reject) => {
      const token = wx.getStorageSync('token');
      wx.uploadFile({
        url: API_BASE + '/api/upload',
        filePath: filePath,
        name: 'file',
        timeout: 30000,  // - 文件上传超时 30秒
        header: {
          'Authorization': token ? `Bearer ${token}` : ''
        },
        success: (res) => {
          const data = JSON.parse(res.data);
          if (data.code === 0) {
            resolve(data.data);
          } else {
            wx.showToast({
              title: data.message || '上传失败',
              icon: 'none',
              duration: 2000
            });
            reject(new Error(data.message));
          }
        },
        fail: (err) => {
          // 上传失败，检查网络状态
          wx.getNetworkType({
            success: (networkRes) => {
              if (networkRes.networkType === 'none') {
                wx.showToast({
                  title: '网络连接失败，请检查网络',
                  icon: 'none',
                  duration: 2000
                });
              } else {
                wx.showToast({
                  title: '文件上传失败',
                  icon: 'none',
                  duration: 2000
                });
              }
            },
            fail: () => {
              wx.showToast({
                title: '文件上传失败',
                icon: 'none',
                duration: 2000
              });
            }
          });
          reject(err);
        }
      });
    });
  }
};
