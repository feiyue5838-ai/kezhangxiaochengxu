/**

 * 蓉城企服 - API 接口封装（改进版）

 * 所有路径与后端路由对齐

 */



// ==================== 环境自适应 API_BASE ====================
// 开发版（模拟器 / 真机调试 / 预览）走局域网 IP，体验版 / 正式版走 HTTPS 域名
// ⚠️ 发版前：把 API_BASE_PROD 替换为已备案的 HTTPS 域名，并在微信公众平台
//    开发管理 → 服务器域名 中把 request / uploadFile / downloadFile 都加上该域名
const API_BASE_DEV = 'http://192.168.31.219:3001';
const API_BASE_PROD = 'https://api.rongcheng.com'; // TODO: 替换为实际备案 HTTPS 域名

let API_BASE;
try {
  const envVersion = wx.getAccountInfoSync().miniProgram.envVersion;
  // 'develop' = 模拟器/真机调试/预览；'trial' = 体验版；'release' = 正式版
  API_BASE = (envVersion === 'develop') ? API_BASE_DEV : API_BASE_PROD;
} catch (e) {
  API_BASE = API_BASE_DEV; // 兜底：环境信息获取失败时退回开发地址
}

// API_BASE 也在模块导出中，供组件拼接图片等静态资源使用



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

          // 兼容：无 code 字段时直接返?data（如后端直接返回对象）；?code 时验证为 0

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

          // 跳转登录页，避免用户被卡死（?auth.request 行为对齐?

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



// 网点独立请求函数（使用网点 token，与用户 token 分离）
const outletRequest = (options) => {
  return new Promise((resolve, reject) => {
    const outletToken = wx.getStorageSync('outletToken');
    wx.request({
      url: API_BASE + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      timeout: options.timeout || 15000,
      header: {
        'Content-Type': 'application/json',
        'Authorization': outletToken ? 'Bearer ' + outletToken : '',
        ...options.header
      },
      success: (res) => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          resolve(res.data.data !== undefined ? res.data.data : res.data);
        } else if (res.statusCode === 401) {
          wx.removeStorageSync('outletToken');
          wx.removeStorageSync('outletInfo');
          reject(new Error('网点登录已过期，请重新登录'));
        } else {
          const msg = (res.data && res.data.message) || '请求失败(' + res.statusCode + ')';
          wx.showToast({ title: msg, icon: 'none', duration: 2000 });
          reject(new Error(msg));
        }
      },
      fail: (err) => {
        wx.showToast({ title: '网络请求失败', icon: 'none', duration: 2000 });
        reject(err);
      }
    });
  });
};

module.exports = {

  // 基础地址（本地调试用，生产环境需替换?HTTPS 公网域名?

  API_BASE,

  // ==================== 认证相关 ====================

  // 微信登录 ?POST /api/auth/wx-login

  wxLogin: (code) => request({ url: '/api/auth/wx-login', method: 'POST', data: { code } }),

  // 门店登录 ?POST /api/auth/store-login

  storeLogin: (data) => request({ url: '/api/auth/store-login', method: 'POST', data: data }),



  // ==================== 用户相关 ====================

  // 获取用户信息 ?GET /api/user/profile

  getUserInfo: () => request({ url: '/api/user/profile' }),

  // 更新用户信息 ?PUT /api/user/profile

  updateUserInfo: (data) => request({ url: '/api/user/profile', method: 'PUT', data: data }),



  // ==================== 印章服务 ====================

  // 印章分类 ?GET /api/seals/categories

  getSealCategories: (region) => request({ url: '/api/seals/categories', data: region ? { region } : {} }),

  // 印章列表 ?GET /api/seals

  getSealList: (params) => request({ url: '/api/seals', data: params }),

  // 印章套餐 ?GET /api/seals/packages

  getSealPackages: (region) => request({ url: '/api/seals/packages', data: region ? { region } : {} }),

  // 印章业务场景（统一?categories 接口??GET /api/seals/categories

  getSealScenes: () => request({ url: '/api/seals/scenes' }),

  // 业务场景下的印章+套餐 GET /api/seals/scenes/:id

  getSealSceneProducts: (sceneId, region) => {
    const url = `/api/seals/scenes/${sceneId}` + (region ? '?region=' + encodeURIComponent(region) : '');
    return request({ url, data: {} });
  },

  // 创建刻章订单 ?POST /api/orders/seal

  createSealOrder: (data) => request({ url: '/api/orders/seal', method: 'POST', data: data }),

  // 刻章订单列表 ?GET /api/orders?module=seal

  getSealOrderList: (params) => request({ url: '/api/orders', data: { module: 'seal', ...params } }),

  // 刻章订单详情 ?GET /api/orders/:id

  getSealOrderDetail: (id) => request({ url: `/api/orders/${id}` }),

  // 获取刻章订单微信支付参数 ?POST /api/orders/:id/pay

  getSealPayParams: (id, openid) => request({ url: `/api/orders/${id}/pay`, method: 'POST', data: { openid: openid || '' } }),

  // 开发环境模拟微信支付回调（生产环境该接口返?403）→ POST /api/orders/:id/dev-paid

  devConfirmPay: (id) => request({ url: `/api/orders/${id}/dev-paid`, method: 'POST' }),



  // ==================== 登报服务 ====================

  // 报纸分类 ?GET /api/newspapers/categories

  getNewspaperCategories: () => request({ url: '/api/newspapers/categories' }),

  // 报纸列表 ?GET /api/newspapers

  getNewspaperList: (params) => request({ url: '/api/newspapers', data: params }),

  // 报纸模板 ?GET /api/newspapers/templates?categoryId=xxx

  getNewspaperTemplate: (categoryId) => request({ url: '/api/newspapers/templates', data: { categoryId } }),

  // 报纸价格 ?GET /api/newspapers/price

  getNewspaperPrice: (data) => request({ url: '/api/newspapers/price', data }),

  // 创建登报订单 ?POST /api/orders/newspaper

  createNewspaperOrder: (data) => request({ url: '/api/orders/newspaper', method: 'POST', data: data }),

  // 登报订单列表 ?GET /api/orders?module=newspaper

  getNewspaperOrderList: (params) => request({ url: '/api/orders', data: { ...params, module: 'newspaper' } }),

  // 登报订单详情 ?GET /api/orders/:id

  getNewspaperOrderDetail: (id) => request({ url: `/api/orders/${id}` }),

  // 登报订单微信支付参数 ?POST /api/orders/:id/pay

  getNewspaperPayParams: (id, openid) => request({ url: `/api/orders/${id}/pay`, method: 'POST', data: { openid: openid || '' } }),

  // 用户取消订单 / 申请退??POST /api/orders/:id/cancel

  cancelNewspaperOrder: (id) => request({ url: `/api/orders/${id}/cancel`, method: 'POST' }),

  // 个人证件分类+证件列表 ?GET /api/newspapers/personal-docs

  getPersonalDocs: () => request({ url: '/api/newspapers/personal-docs' }),

  // 发票收据模板（按业务类型分组）→ GET /api/newspapers/invoice-templates

  getInvoiceTemplates: () => request({ url: '/api/newspapers/invoice-templates' }),

  // 公告模板（按 17 分类分组）→ GET /api/newspapers/announcement-templates

  getAnnouncementTemplates: () => request({ url: '/api/newspapers/announcement-templates' }),

  // 企业证件模板（按 12 分类分组）→ GET /api/newspapers/company-doc-templates

  getCompanyDocTemplates: () => request({ url: '/api/newspapers/company-doc-templates' }),

  // 法院公告模板（按 9 分类分组）→ GET /api/newspapers/court-templates

  getCourtTemplates: () => request({ url: '/api/newspapers/court-templates' }),

  // 政府送达模板（按 5 分类分组）→ GET /api/newspapers/government-templates

  getGovernmentTemplates: () => request({ url: '/api/newspapers/government-templates' }),

  // 债权债务模板（按 4 分类分组）→ GET /api/newspapers/creditor-templates

  getCreditorTemplates: () => request({ url: '/api/newspapers/creditor-templates' }),

  // 劳动纠纷模板（按 4 分类分组）→ GET /api/newspapers/labor-templates

  getLaborTemplates: () => request({ url: '/api/newspapers/labor-templates' }),

  // 招标公告模板（按 3 分类分组）→ GET /api/newspapers/bidding-templates

  getBiddingTemplates: () => request({ url: '/api/newspapers/bidding-templates' }),

  // 环评公示模板（按 5 分类分组）→ GET /api/newspapers/env-templates

  getEnvTemplates: () => request({ url: '/api/newspapers/env-templates' }),

  getAuctionTemplates: () => request({ url: '/api/newspapers/auction-templates' }),

  // 登报道歉模板（按 4 分类分组）→ GET /api/newspapers/apology-templates

  getApologyTemplates: () => request({ url: '/api/newspapers/apology-templates' }),

  // 宣传公示模板（按 5 分类分组）→ GET /api/newspapers/publicity-templates

  getPublicityTemplates: () => request({ url: '/api/newspapers/publicity-templates' }),













  // ==================== 收货地址 ====================

  // 地址列表 ?GET /api/users/addresses

  getAddressList: () => request({ url: '/api/users/addresses' }),

  // 新增地址 ?POST /api/users/addresses

  addAddress: (data) => request({ url: '/api/users/addresses', method: 'POST', data: data }),

  // 更新地址 ?PUT /api/users/addresses/:id

  updateAddress: (id, data) => request({ url: `/api/users/addresses/${id}`, method: 'PUT', data: data }),

  // 删除地址 ?DELETE /api/users/addresses/:id

  deleteAddress: (id) => request({ url: `/api/users/addresses/${id}`, method: 'DELETE' }),



  // ==================== 网点端（Outlet）====================

  // 门店订单列表 → GET /api/outlets/me/orders（网点 token）
  getStoreOrders: (params) => outletRequest({ url: '/api/outlets/me/orders', data: params }),

  // 网点单条订单详情 → GET /api/outlets/me/orders/:id（网点 token）
  getStoreOrderDetail: (id) => outletRequest({ url: '/api/outlets/me/orders/' + id }),

  // 接单 → PUT /api/outlets/me/orders/:id/accept（网点 token）
  acceptOrder: (id) => outletRequest({ url: `/api/outlets/me/orders/${id}/accept`, method: 'PUT' }),

  // 完成制作 → PUT /api/outlets/me/orders/:id/complete（网点 token）
  completeOrder: (id, data) => outletRequest({ url: `/api/outlets/me/orders/${id}/complete`, method: 'PUT', data }),

  // 发货 → PUT /api/outlets/me/orders/:id/ship（网点 token）
  shipOrder: (id, data) => outletRequest({ url: `/api/outlets/me/orders/${id}/ship`, method: 'PUT', data }),

  // 网点端查询自己的回执列表 → GET /api/delivery-receipts/Outlet/list（网点 token）
  getOutletReceipts: ({ orderId } = {}) => outletRequest({ url: '/api/delivery-receipts/Outlet/list', data: { orderId } }),

  // 用户端查询订单回执列表 → GET /api/delivery-receipts/user/list（用户 token）
  getOrderReceipts: (orderId) => request({ url: '/api/delivery-receipts/user/list', data: { orderId } }),

  // 上传交付凭证 → POST /api/delivery-receipts（wx.uploadFile + 网点 token）
  uploadReceipt: (filePath, data = {}) => {
    return new Promise((resolve, reject) => {
      const outletToken = wx.getStorageSync('outletToken');
      wx.uploadFile({
        url: API_BASE + '/api/delivery-receipts',
        filePath: filePath,
        name: 'file',
        formData: data,
        header: {
          'Authorization': outletToken ? 'Bearer ' + outletToken : ''
        },
        success: (res) => {
          try {
            const body = JSON.parse(res.data);
            if (res.statusCode === 200 || res.statusCode === 201) {
              resolve(body.data !== undefined ? body.data : body);
            } else if (res.statusCode === 401) {
              wx.removeStorageSync('outletToken');
              wx.removeStorageSync('outletInfo');
              reject(new Error('网点登录已过期，请重新登录'));
            } else {
              const msg = (body && body.message) || '上传失败(' + res.statusCode + ')';
              wx.showToast({ title: msg, icon: 'none', duration: 2000 });
              reject(new Error(msg));
            }
          } catch (e) {
            reject(new Error('响应解析失败'));
          }
        },
        fail: (err) => {
          wx.showToast({ title: '网络请求失败', icon: 'none', duration: 2000 });
          reject(err);
        }
      });
    });
  },



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

          // 后端直返 { url }；兼?{ code:0, data:url } 包装

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

  // 获取单个配置（公开接口，无需登录? GET /api/config?key=xxx

  // 后端直接返回配置值（如数?字符串），request 封装会自?resolve 为值本?

  getConfig: (key) => request({ url: '/api/config', data: { key } }),


// 网点独立请求函数（使用网点 token，与用户 token 分离）

  outletRequest: (options) => {

    return new Promise((resolve, reject) => {

      const outletToken = wx.getStorageSync('outletToken');

      wx.request({

        url: API_BASE + options.url,

        method: options.method || 'GET',

        data: options.data || {},

        timeout: options.timeout || 15000,

        header: {

          'Content-Type': 'application/json',

          'Authorization': outletToken ? 'Bearer ' + outletToken : '',

          ...options.header

        },

        success: (res) => {

          if (res.statusCode === 200 || res.statusCode === 201) {

            resolve(res.data.data !== undefined ? res.data.data : res.data);

          } else if (res.statusCode === 401) {

            wx.removeStorageSync('outletToken');

            wx.removeStorageSync('outletInfo');

            reject(new Error('网点登录已过期，请重新登录'));

          } else {

            const msg = (res.data && res.data.message) || '请求失败(' + res.statusCode + ')';

            wx.showToast({ title: msg, icon: 'none', duration: 2000 });

            reject(new Error(msg));

          }

        },

        fail: (err) => {

          wx.showToast({ title: '网络请求失败', icon: 'none', duration: 2000 });

          reject(err);

        }

      });

    });

  },



  // 网点登录（返回 outlet 信息含 openid 绑定状态）>POST /api/auth/store-login

  outletLogin: (data) => new Promise((resolve, reject) => {

    wx.request({

      url: API_BASE + '/api/auth/store-login',

      method: 'POST',

      data,

      header: { 'Content-Type': 'application/json' },

      success: (res) => {

        if (res.statusCode === 200) {

          const d = res.data.data !== undefined ? res.data.data : res.data;

          resolve(d);

        } else {

          const msg = (res.data && res.data.message) || '登录失败';

          reject(new Error(msg));

        }

      },

      fail: (err) => reject(err)

    });

  }),

  // 绑定微信 openid（接收订阅消息）>PUT /api/outlets/me/bind-openid

  outletBindOpenid: (openid) => {

    const token = wx.getStorageSync('outletToken');

    return new Promise((resolve, reject) => {

      wx.request({

        url: API_BASE + '/api/outlets/me/bind-openid',

        method: 'PUT',

        data: { openid },

        header: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },

        success: (res) => {

          if (res.statusCode === 200) resolve(res.data.data !== undefined ? res.data.data : res.data);

          else reject(new Error((res.data && res.data.message) || '绑定失败'));

        },

        fail: (err) => reject(err)

      });

    });

  },

  // 开关订阅消息 >PUT /api/outlets/me/subscribe-toggle

  outletToggleSubscribe: (enabled) => {

    const token = wx.getStorageSync('outletToken');

    return new Promise((resolve, reject) => {

      wx.request({

        url: API_BASE + '/api/outlets/me/subscribe-toggle',

        method: 'PUT',

        data: { enabled },

        header: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },

        success: (res) => {

          if (res.statusCode === 200) resolve(res.data.data !== undefined ? res.data.data : res.data);

          else reject(new Error((res.data && res.data.message) || '设置失败'));

        },

        fail: (err) => reject(err)

      });

    });

  },

  // 网点通知列表（轮询用）>GET /api/notifications/me

  outletGetNotifications: () => {

    const token = wx.getStorageSync('outletToken');

    return new Promise((resolve, reject) => {

      wx.request({

        url: API_BASE + '/api/notifications/me',

        method: 'GET',

        header: { 'Authorization': 'Bearer ' + token },

        success: (res) => {

          if (res.statusCode === 200) resolve(res.data.data !== undefined ? res.data.data : res.data);

          else reject(new Error((res.data && res.data.message) || '获取通知失败'));

        },

        fail: (err) => reject(err)

      });

    });

  },





  // ==================== 网点微信绑定 & 订阅消息 ====================



  


  // ==================== 评价（小程序端） ====================
  /** 已审核通过的评价列表 */
  reviewList: (params) => request({ url: '/api/reviews/list', data: params }),
  /** 提交评价（需登录） */
  submitReview: (data) => request({ url: '/api/reviews', method: 'POST', data }),
  /** 我的评价列表（需登录） */
  myReviews: (params) => request({ url: '/api/reviews/my', data: params }),

  // ==================== 问答（小程序端） ====================
  /** 公开问答列表 */
  qaList: (params) => request({ url: '/api/questions/list', data: params }),
  /** 问答详情 */
  qaDetail: (id) => request({ url: '/api/questions/' + id }),
  /** 提交问题（需登录） */
  submitQuestion: (data) => request({ url: '/api/questions', method: 'POST', data }),

  // ==================== 代理记账 ====================
  /** 获取代理记账价格 */
  getBookkeepingPrice: (params) =>
    request({ url: '/api/bookkeeping/price?' + Object.keys(params).map(k=>k+'='+encodeURIComponent(params[k])).join('&') }),
  /** 创建代理记账订单 */
  createBookkeepingOrder: (data) => request({ url: '/api/bookkeeping/orders', method: 'POST', data }),
  /** 代理记账订单列表 */
  getBookkeepingOrderList: (params) => request({ url: '/api/orders', data: { module: 'bookkeeping', ...params } }),
  /** 代理记账订单详情 */
  getBookkeepingOrderDetail: (id) => request({ url: '/api/orders/' + id }),
  /** 取消代理记账订单 */
  cancelBookkeepingOrder: (id) => request({ url: '/api/orders/' + id + '/cancel', method: 'POST' }),
  /** 获取代理记账订单支付参数（POST） */
  getBookkeepingPayParams: (orderId, openid) =>
    request({ url: '/api/bookkeeping/orders/' + orderId + '/pay-params', method: 'POST', data: { openid: openid || '' } }),

  /** API 基础地址（用于拼接图片等静态资源） */
  API_BASE: API_BASE,

};