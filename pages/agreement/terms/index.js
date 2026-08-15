const api = require('../../../utils/api.js');

// rich-text 组件不依赖页面 WXSS，统一给块元素加行内样式（仅支持 px）
function formatRich(html) {
  if (!html) return '';
  return String(html)
    .replace(/<p(?! style)/gi, '<p style="margin:0 0 16px; line-height:1.8; font-size:15px; color:#333;"')
    .replace(/<h1(?! style)/gi, '<h1 style="font-size:20px; margin:24px 0 12px; font-weight:600; color:#222;"')
    .replace(/<h2(?! style)/gi, '<h2 style="font-size:18px; margin:22px 0 10px; font-weight:600; color:#222;"')
    .replace(/<strong(?! style)/gi, '<strong style="font-weight:600; color:#222;"')
    .replace(/<div(?! style)/gi, '<div style="margin:0 0 16px; line-height:1.8; font-size:15px; color:#333;"');
}

const DEFAULT_TERMS = `<p>更新日期：2026年1月1日</p>
<p>生效日期：2026年1月1日</p>
<p><strong>一、特别提示</strong></p>
<p>用户在使用蓉城企业服务平台小程序（以下简称"我们"）提供的服务前，应仔细阅读本协议的全部内容。如您不同意本协议的任何内容，请暂停注册或使用服务。您的注册或使用行为即视为您已阅读并同意本协议的全部内容。</p>
<p><strong>二、服务内容</strong></p>
<p>我们提供的服务包括：电子印章在线办理、报纸公告在线办理、证照代办咨询、订单管理等，具体以小程序实际功能为准。我们有权根据业务发展调整服务内容。</p>
<p><strong>三、用户注册</strong></p>
<p>您在使用我们的服务时，应提供真实、准确、完整的个人信息，并及时更新。如信息不实，我们有权终止服务。用户应妥善保管账户信息，因个人保管不善造成的损失由用户自行承担。</p>
<p><strong>四、订单与支付</strong></p>
<p>用户在提交订单前，请仔细核对订单信息。订单支付成功后，我们将按照约定为您办理。如因用户信息错误导致的延误，由用户自行承担责任。</p>
<p><strong>五、退款与售后</strong></p>
<p>退款政策请参照具体订单页面的说明。一般情况下，服务已开工后不支持退款。如有质量问题，请联系客服协商处理。</p>
<p><strong>六、知识产权</strong></p>
<p>小程序内所有内容（包括但不限于文字、图片、标识、界面设计等）的知识产权归我们所有，未经书面授权，不得进行任何形式的复制、修改或传播。</p>
<p><strong>七、免责声明</strong></p>
<p>因不可抗力（包括但不限于自然灾害、政策变更、网络故障等）导致服务无法正常提供的，我们不承担责任。因用户自身原因造成的损失，由用户自行承担。</p>
<p><strong>八、协议变更</strong></p>
<p>我们有权随时修改本协议，修改后会在小程序显著位置公告。修改后的协议自公告之日起生效。继续使用服务即视为接受修改后的协议。</p>
<p><strong>九、争议解决</strong></p>
<p>本协议的解释和执行均适用中华人民共和国法律。如双方发生争议，应友好协商解决；协商不成的，提交有管辖权的人民法院诉讼解决。</p>
<p><strong>十、联系方式</strong></p>
<p>客服热线：13273928888（工作日 9:00-18:00）</p>`;

Page({
  data: {
    html: DEFAULT_TERMS,
    loading: true,
  },

  onLoad() {
    api.getAgreement('terms').then((res) => {
      const content = res && res.content ? res.content : '';
      this.setData({ html: formatRich(content || DEFAULT_TERMS), loading: false });
    }).catch(() => {
      this.setData({ html: formatRich(DEFAULT_TERMS), loading: false });
    });
  },

  onBack() {
    wx.navigateBack();
  },
});
