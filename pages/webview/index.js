// pages/webview/index.js
// 【H1 安全修复】web-view 仅允许加载白名单内的 https 域名，杜绝钓鱼/任意页加载。
// ⚠️ 必须在此填入你真正用 web-view 展示的 H5/业务域名（须与微信公众平台“业务域名”一致）。
//    当前仅占位 api.rongcheng.com，请按需补充（如 h5.rongcheng.com 等），否则非白名单链接会被拒绝。
const WEBVIEW_ALLOWED_HOSTS = [
  // ===== TODO 在这里填入真实 H5/业务域名（必须与微信公众平台“业务域名”登记一致）=====
  // 格式示例：'h5.rongcheng.com'
  // 规则：精确主机名，不支持通配符；每行一个域名，末尾无逗号
  // ============================================================================
  // 'h5.rongcheng.com',  // ← 取消注释并替换为真实域名后再发布
];

function isSafeWebUrl(raw) {
  if (typeof raw !== 'string' || !raw) return false;
  // 不依赖全局 URL 构造器（部分低版本基础库/iOS JSCore 不支持），手动解析
  let u;
  try {
    const m = /^([a-zA-Z][a-zA-Z0-9+.-]*):\/\/([^/?#]*)/.exec(raw);
    if (!m) return false;
    u = { protocol: m[1] + ':', host: m[2] };
  } catch (_e) { return false; }
  // 仅允许 https；禁止 http / javascript: / data: 等协议
  if (u.protocol !== 'https:') return false;
  // 主机精确匹配，杜绝 api.rongcheng.com.evil.com 之类子域绕过
  return WEBVIEW_ALLOWED_HOSTS.indexOf(u.host) !== -1;
}

Page({
  data: { url: '' },

  onLoad(options) {
    const raw = options.url ? decodeURIComponent(options.url) : '';
    if (!isSafeWebUrl(raw)) {
      wx.showToast({ title: '不支持的链接', icon: 'none' });
      return;
    }
    this.setData({ url: raw });
  },

  onMessage(_e) {
    // 接收 web-view 内网页通过 postMessage 发来的消息
  },

  onError(_e) {
    wx.showToast({ title: '页面加载失败', icon: 'none' });
  }
});
