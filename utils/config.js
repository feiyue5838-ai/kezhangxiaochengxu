/**
 * utils/config.js — 全局配置（模板 ID、环境开关等）
 *
 * 该文件被 pages/outlet-binding 等页面引用。
 * 真实模板 ID 在小程序后台「功能 → 订阅消息」申请后填入。
 */

// 订阅消息模板 ID（门店通知）
const WECHAT_SUBSCRIBE_TEMPLATE_ID = '';

// 后续环境变量/开关统一放这里，例如：
// const ENV = 'prod'; // 'dev' | 'staging' | 'prod'

module.exports = {
  WECHAT_SUBSCRIBE_TEMPLATE_ID,
};
