/**
 * utils/config.js — 全局配置（模板 ID、环境开关等）
 *
 * 该文件被 pages/outlet-binding 等页面引用。
 * 真实模板 ID 在小程序后台「功能 → 订阅消息」申请后填入。
 */

// ⚠️ 上线阻断项：订阅消息模板 ID（门店通知）
// 填写步骤：
//   1. 登录 mp.weixin.qq.com →「功能」→「订阅消息」→ 选用「新订单通知」类模板；
//   2. 模板字段须含：thing（提醒语）、character_string（订单号）、thing（业务类型）、thing（网点名称）；
//   3. 将模板 ID 同时填入此处（前端）与后端 .env 的 WECHAT_SUBSCRIBE_TEMPLATE_ID（两端必须一致）；
//   4. 留空时前端开关会提示「通知模板暂未配置」，后端静默跳过发送，不会报错。
const WECHAT_SUBSCRIBE_TEMPLATE_ID = '';

// 后续环境变量/开关统一放这里，例如：
// const ENV = 'prod'; // 'dev' | 'staging' | 'prod'

module.exports = {
  WECHAT_SUBSCRIBE_TEMPLATE_ID,
};
