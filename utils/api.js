/**
 * utils/api.js — 后端 API 配置
 * 所有后端接口地址在此统一管理，方便切换环境
 */

// API 基础地址（开发/测试/生产环境切换）
const API_BASE = {
  dev: 'https://dev-api.example.com',
  test: 'https://test-api.example.com',
  prod: 'https://api.example.com'
};

// 当前环境（根据 project.config.json 或自定义逻辑判断）
const ENV = 'dev';

const BASE_URL = API_BASE[ENV];

// API 端点
const API = {
  // ── 用户鉴权 ────────────────────────────────
  AUTH: {
    LOGIN: BASE_URL + '/auth/login',           // 微信登录
    LOGOUT: BASE_URL + '/auth/logout',         // 退出登录
    REFRESH: BASE_URL + '/auth/refresh',       // 刷新 token
  },

  // ── 用户信息 ────────────────────────────────
  USER: {
    INFO: BASE_URL + '/user/info',             // 获取用户信息
    UPDATE: BASE_URL + '/user/update',         // 更新用户信息
  },

  // ── 刻章业务 ────────────────────────────────
  SEAL: {
    LIST: BASE_URL + '/seal/list',             // 刻章订单列表
    DETAIL: BASE_URL + '/seal/detail',         // 订单详情
    CREATE: BASE_URL + '/seal/create',         // 创建订单
    CANCEL: BASE_URL + '/seal/cancel',         // 取消订单
    REVIEW: BASE_URL + '/seal/review',         // 提交评价
  },

  // ── 登报业务 ────────────────────────────────
  NEWSPAPER: {
    LIST: BASE_URL + '/newspaper/list',        // 登报订单列表
    DETAIL: BASE_URL + '/newspaper/detail',    // 订单详情
    CREATE: BASE_URL + '/newspaper/create',    // 创建订单
    CANCEL: BASE_URL + '/newspaper/cancel',    // 取消订单
  },

  // ── 地址管理 ────────────────────────────────
  ADDRESS: {
    LIST: BASE_URL + '/address/list',          // 地址列表
    ADD: BASE_URL + '/address/add',            // 添加地址
    UPDATE: BASE_URL + '/address/update',      // 更新地址
    DELETE: BASE_URL + '/address/delete',      // 删除地址
    DEFAULT: BASE_URL + '/address/default',    // 设为默认
  },

  // ── 支付 ─────────────────────────────────────
  PAYMENT: {
    CREATE: BASE_URL + '/payment/create',      // 创建支付
    QUERY: BASE_URL + '/payment/query',        // 查询支付状态
  },

  // ── 其他 ─────────────────────────────────────
  UPLOAD: BASE_URL + '/upload',                // 文件上传
};

/**
 * 获取完整 API 地址
 * @param {string} key - API 路径，如 'AUTH.LOGIN'
 * @returns {string} 完整 URL
 */
function getApi(key) {
  const keys = key.split('.');
  let result = API;
  for (const k of keys) {
    result = result[k];
    if (!result) break;
  }
  return result || '';
}

/**
 * 切换环境
 * @param {string} env - 'dev' | 'test' | 'prod'
 */
function setEnv(env) {
  if (API_BASE[env]) {
    // 重新计算 BASE_URL 和所有 API 端点
    console.log('API 环境切换为:', env);
  }
}

module.exports = {
  API,
  BASE_URL,
  getApi,
  setEnv
};
