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

const DEFAULT_PRIVACY = `<p style="text-align:center;font-size:36rpx;font-weight:600;margin-bottom:24rpx;">隐私政策</p>
<p style="text-align:center;font-size:24rpx;color:#999;margin-bottom:40rpx;">更新日期：2026年8月20日 &nbsp; 生效日期：2026年8月20日</p>
<p style="font-size:28rpx;line-height:1.9;color:#333;">成都蓉城信息服务有限公司（以下简称"我们"）非常重视您的个人信息及隐私安全。您在使用我们的刻章、登报、记账等服务时，我们将按照本隐私政策的规定收集、使用、存储和保护您的个人信息。请您在使用我们的服务前，仔细阅读并了解本隐私政策。</p>

<h3 style="font-size:32rpx;font-weight:600;margin:32rpx 0 16rpx;color:#222;">一、信息收集</h3>
<p style="font-size:28rpx;line-height:1.9;color:#333;">在您使用蓉城企服小程序服务时，我们可能收集以下信息：</p>
<ul style="font-size:28rpx;line-height:2.2;color:#333;padding-left:32rpx;">
<li><strong>账户信息：</strong>您通过微信授权登录时，我们获取您的微信昵称、头像、性别等公开信息。</li>
<li><strong>联系信息：</strong>您主动填写手机号码、地址、身份证信息、企业名称等，用于刻章申请、登报发布、税务登记等业务办理。</li>
<li><strong>业务材料：</strong>您上传的营业执照、法人身份证、介绍信、承诺书等电子文件，用于验证您的真实经营资质。</li>
<li><strong>订单记录：</strong>您在我们平台的刻章订单、登报订单、记账订单记录及交易状态。</li>
<li><strong>设备信息：</strong>设备型号、操作系统版本等基础信息，用于保障服务安全稳定运行。</li>
<li><strong>位置信息：</strong>如您使用门店查询功能，我们会在获得您授权后获取您的位置信息，以便推荐就近服务网点。</li>
</ul>

<h3 style="font-size:32rpx;font-weight:600;margin:32rpx 0 16rpx;color:#222;">二、信息使用</h3>
<p style="font-size:28rpx;line-height:1.9;color:#333;">我们收集您的个人信息仅用于以下目的：</p>
<ul style="font-size:28rpx;line-height:2.2;color:#333;padding-left:32rpx;">
<li>为您提供刻章申请、登报发布、税务登记代理等服务的全流程办理；</li>
<li>对您提交的材料进行真实性核验，并依法向相关行政部门提交；</li>
<li>向您推送订单状态通知、服务进度提醒等重要消息；</li>
<li>完成微信支付等在线交易功能；</li>
<li>改进我们的服务，优化用户体验；</li>
<li>遵守法律法规要求，配合监管部门的合规审查。</li>
</ul>

<h3 style="font-size:32rpx;font-weight:600;margin:32rpx 0 16rpx;color:#222;">三、信息共享</h3>
<p style="font-size:28rpx;line-height:1.9;color:#333;">未经您同意，我们不会向第三方出售或非法向无关第三方提供您的个人信息。但以下情形除外：</p>
<ul style="font-size:28rpx;line-height:2.2;color:#333;padding-left:32rpx;">
<li>经您明确授权同意后，向履约供应商、政务部门共享必要信息；</li>
<li><strong>为完成您所委托的业务，我们需将您的必要信息提供给履约供应商（包括刻章网点、登报机构、记账机构等）用于刻章备案、登报发布、记账报税等用途，您对此知悉并同意；</strong></li>
<li>根据法律法规、法律程序、法院判决或政府强制要求进行披露；</li>
<li>为保护我们、您或其他用户的合法权益免受重大危害而必须披露。</li>
</ul>

<h3 style="font-size:32rpx;font-weight:600;margin:32rpx 0 16rpx;color:#222;">四、信息存储</h3>
<p style="font-size:28rpx;line-height:1.9;color:#333;">我们在中国境内存储您的个人信息，存储期限为您使用服务期间及服务终止后合理期限内。对于企业用户的重要材料，我们依据相关法规要求进行存档。您的个人信息账户注销后，我们将在合理时间内删除或匿名化处理您的相关信息。</p>

<h3 style="font-size:32rpx;font-weight:600;margin:32rpx 0 16rpx;color:#222;">五、信息安全</h3>
<p style="font-size:28rpx;line-height:1.9;color:#333;">我们采取业界标准的安全技术措施和管理流程保护您的个人信息，包括数据加密传输（HTTPS）、访问权限控制、操作日志审计等，防止数据遭到未经授权的访问、使用、修改或泄露。尽管我们尽力提供安全保护，但互联网环境并非百分之百安全，请您在设置账户密码时使用复杂组合，并妥善保管您的认证凭证。</p>

<h3 style="font-size:32rpx;font-weight:600;margin:32rpx 0 16rpx;color:#222;">六、您的权利</h3>
<p style="font-size:28rpx;line-height:1.9;color:#333;">您对您的个人信息享有以下权利：</p>
<ul style="font-size:28rpx;line-height:2.2;color:#333;padding-left:32rpx;">
<li><strong>查阅权：</strong>您可以在"我的"页面查看您已提交的账户信息和材料记录。</li>
<li><strong>更正权：</strong>如发现您的个人信息有误，可联系客服进行更正。</li>
<li><strong>删除权：</strong>您可以申请注销账户，注销后我们将删除您的个人信息（法律法规另有规定的除外）。</li>
<li><strong>撤回授权：</strong>您可以在微信中解除对小程序授权，但部分功能可能因此无法使用。</li>
</ul>

<h3 style="font-size:32rpx;font-weight:600;margin:32rpx 0 16rpx;color:#222;">七、未成年人保护</h3>
<p style="font-size:28rpx;line-height:1.9;color:#333;">我们的服务主要面向具备完全民事行为能力的企业经营者及相关人员。如您为未满18周岁的未成年人，请在监护人陪同下阅读本政策，并在取得监护人同意后使用我们的服务。</p>

<h3 style="font-size:32rpx;font-weight:600;margin:32rpx 0 16rpx;color:#222;">八、政策更新</h3>
<p style="font-size:28rpx;line-height:1.9;color:#333;">我们可能会适时修订本隐私政策。修订后，我们将在小程序内显著位置提示更新内容，建议您定期查阅。如您继续使用服务，则视为同意更新后的政策。</p>

<h3 style="font-size:32rpx;font-weight:600;margin:32rpx 0 16rpx;color:#222;">九、联系我们</h3>
<p style="font-size:28rpx;line-height:1.9;color:#333;">如您对本隐私政策有任何疑问、意见或投诉，请通过以下方式联系我们：</p>
<ul style="font-size:28rpx;line-height:2.2;color:#333;padding-left:32rpx;">
<li>联系地址：四川省成都市（具体地址见小程序"关于我们"）</li>
<li>联系电话：见小程序"关于我们"页面公示</li>
<li>受理时间：工作日 9:00–18:00</li>
</ul>`;

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
