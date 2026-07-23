/**
 * 全局配置 —— 上线前请逐项核对
 *
 * WECHAT_SUBSCRIBE_TEMPLATE_ID
 *   微信订阅消息模板 ID（一次性订阅）。
 *   当前为占位符，正式上线前必须替换为在「微信公众平台 → 订阅消息 → 我的模板」中申请的真实模板 ID。
 *   替换需两处保持一致：
 *     1) 本文件（前端弹授权窗时用）
 *     2) 后端 .env 的 WECHAT_SUBSCRIBE_TEMPLATE_ID（后端真正下发推送时用）
 */
module.exports = {
  // ⚠️ 发版前替换：微信公众平台 → 订阅消息 → 我的模板 → 申请模板 ID
  // 替换后需与后端 .env 的 WECHAT_SUBSCRIBE_TEMPLATE_ID 保持一致
  WECHAT_SUBSCRIBE_TEMPLATE_ID: '请替换为真实模板ID',
};
