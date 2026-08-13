const api = require('../../../utils/api.js');

// rich-text 组件不继承页面 WXSS，统一给块级元素注入行内间距（仅支持 px）
function formatRich(html) {
  if (!html) return '';
  return String(html)
    .replace(/<p(?! style)/gi, '<p style="margin:0 0 16px; line-height:1.8; font-size:15px; color:#333;"')
    .replace(/<h1(?! style)/gi, '<h1 style="font-size:20px; margin:24px 0 12px; font-weight:600; color:#222;"')
    .replace(/<h2(?! style)/gi, '<h2 style="font-size:18px; margin:22px 0 10px; font-weight:600; color:#222;"')
    .replace(/<strong(?! style)/gi, '<strong style="font-weight:600; color:#222;"')
    .replace(/<div(?! style)/gi, '<div style="margin:0 0 16px; line-height:1.8; font-size:15px; color:#333;"');
}

const DEFAULT_PRIVACY = `<p>更新日期：2026年1月1日</p>
<p>生效日期：2026年1月1日</p>
<p><strong>一、信息收集</strong></p>
<p>我们收集您主动提供的信息，以及您在使用服务时自动生成的信息，包括但不限于：身份信息、联系方式、交易记录、设备信息等。</p>
<p><strong>二、信息使用</strong></p>
<p>您的信息将用于：为您提供刻章、登报、证件办理等服务；处理您的订单及售后请求；改进我们的产品与服务；遵守法律法规的要求。</p>
<p><strong>三、信息共享</strong></p>
<p>未经您同意，我们不会与任何第三方共享您的个人信息，法律法规要求的除外。</p>
<p><strong>四、信息存储</strong></p>
<p>您的信息存储在中华人民共和国境内的服务器上，存储期限为实现处理目的所必需的最短时间。</p>
<p><strong>五、信息安全</strong></p>
<p>我们采用行业标准的安全措施保护您的个人信息，防止数据遭到未经授权的访问、使用或泄露。</p>
<p><strong>六、您的权利</strong></p>
<p>您有权查询、更正、删除您的个人信息，也有权撤回同意或注销账户，请通过客服渠道联系我们。</p>
<p><strong>七、未成年人保护</strong></p>
<p>我们非常重视对未成年人信息的保护。如您为未满18周岁的未成年人，请在监护人陪同下阅读本政策。</p>
<p><strong>八、政策更新</strong></p>
<p>我们可能适时更新本政策，更新后将在小程序内显著位置提示。如您不同意更新，请停止使用服务。</p>
<p><strong>九、联系我们</strong></p>
<p>如您对本政策有任何疑问，请联系客服：400-888-6666。</p>`;

Page({
  data: {
    html: DEFAULT_PRIVACY,
    loading: true,
  },

  onLoad() {
    api.getAgreement('privacy').then((res) => {
      const content = res && res.content ? res.content : '';
      this.setData({ html: formatRich(content || DEFAULT_PRIVACY), loading: false });
    }).catch(() => {
      this.setData({ html: formatRich(DEFAULT_PRIVACY), loading: false });
    });
  },

  onBack() {
    wx.navigateBack();
  },
});
