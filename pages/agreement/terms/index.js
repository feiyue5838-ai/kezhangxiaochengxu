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

const DEFAULT_TERMS = `<p style="text-align:center;font-size:36rpx;font-weight:600;margin-bottom:24rpx;">用户服务协议</p>
<p style="text-align:center;font-size:24rpx;color:#999;margin-bottom:40rpx;">更新日期：2026年8月20日 &nbsp; 生效日期：2026年8月20日</p>
<p style="font-size:28rpx;line-height:1.9;color:#333;">欢迎使用蓉城企服小程序服务！在您开始使用刻章申请、登报发布、税务登记代理等业务服务前，请仔细阅读并充分理解本协议的全部内容。<strong>如您勾选"同意"或实际使用本服务，视为您已阅读、理解并同意接受本协议的全部条款。</strong></p>

<h3 style="font-size:32rpx;font-weight:600;margin:32rpx 0 16rpx;color:#222;">一、服务说明</h3>
<p style="font-size:28rpx;line-height:1.9;color:#333;"><strong>蓉城企服</strong>是成都蓉城信息服务有限公司运营的小程序平台，为用户提供刻章申请代理、登报发布代理、税务登记代理等企业服务（以下统称"本服务"）。服务范围以小程序内实际展示的功能为准。我们保留根据业务需要调整服务内容、收费标准的权利，并提前在小程序内公告。</p>
<p style="font-size:28rpx;line-height:1.9;color:#333;">为完成服务交付，我们会委托经审核的履约服务提供方（以下简称"<strong>履约供应商</strong>"，包括刻章网点、登报机构、记账机构等）按订单要求提供具体服务。<strong>履约供应商系本平台履约体系的组成部分，您与履约供应商之间不存在直接的合同关系；我们作为整体服务的提供方，就全部服务向您负责。</strong></p>

<h3 style="font-size:32rpx;font-weight:600;margin:32rpx 0 16rpx;color:#222;">二、用户注册与账户</h3>
<ul style="font-size:28rpx;line-height:2.2;color:#333;padding-left:32rpx;">
<li>您通过微信授权登录即完成账户注册，无需另行设置用户名和密码。</li>
<li>您承诺使用本人真实、合法的身份信息进行注册及业务办理，不得冒用他人名义或使用虚假身份。</li>
<li>您须妥善保管账户认证凭证，因账户被他人冒用而产生的损失，由您自行承担。</li>
<li>一个微信账户仅限对应一个用户主体，禁止多人共用同一账户。</li>
</ul>

<h3 style="font-size:32rpx;font-weight:600;margin:32rpx 0 16rpx;color:#222;">三、服务订单</h3>
<ul style="font-size:28rpx;line-height:2.2;color:#333;padding-left:32rpx;">
<li>您在线提交业务申请，即视为向我们就对应服务发出要约；我们确认收到款项后，视为合同成立。</li>
<li>订单生效后，如需变更或撤销，请联系客服协商处理，部分业务因已向行政部门提交可能无法撤销。</li>
<li>您应确保所提交的营业执照、法人身份证、介绍信、承诺书等材料均为真实、合法、有效的原件扫描件或照片，不得伪造、篡改、借用他人材料。</li>
<li>若因材料虚假导致的一切法律责任，由您自行承担，并赔偿因此给我们造成的全部损失。</li>
<li>我们不对因行政部门审核不通过、政策调整、不可抗力等原因导致的服务无法完成承担责任，但我们将积极协助您解决。</li>
</ul>

<h3 style="font-size:32rpx;font-weight:600;margin:32rpx 0 16rpx;color:#222;">四、费用与支付</h3>
<ul style="font-size:28rpx;line-height:2.2;color:#333;padding-left:32rpx;">
<li>各项服务的收费标准以小程序内页面公示为准，支持微信支付结算。</li>
<li>部分业务实行定金+尾款分阶段支付，请按页面提示按时足额付款，以免延误办理。</li>
<li><strong>您支付的款项直接进入本平台微信商户号，由本平台统一与履约供应商进行结算，您与履约供应商之间不存在直接的资金往来关系。</strong></li>
<li>费用一旦支付，不支持通过小程序自行发起退款；如需退款，请联系客服处理，我们将根据业务办理进度协商退款金额。</li>
<li>发票将在业务完成后根据您提供的开票信息开具并邮寄，邮费到付。</li>
</ul>

<h3 style="font-size:32rpx;font-weight:600;margin:32rpx 0 16rpx;color:#222;">五、办理时限</h3>
<p style="font-size:28rpx;line-height:1.9;color:#333;">各业务的办理时限以页面公示为准，从材料审核通过之日起计算。因行政部门办理进度、邮寄时效、节假日等因素影响，实际完成时间可能有所延长。我们将尽力加快办理，但不对行政部门的工作周期作出保证。如因政策调整、系统故障等导致办理延误，我们将提前通知您并协商解决方案。</p>

<h3 style="font-size:32rpx;font-weight:600;margin:32rpx 0 16rpx;color:#222;">六、交付方式</h3>
<p style="font-size:28rpx;line-height:1.9;color:#333;">刻章成品以您选择的收件地址为准进行邮寄，邮费由您承担（部分套餐含包邮以页面说明为准）；登报发布以刊登日期和报刊版次为准，刊登完成后我们会通知您查看。税务登记等政务事项以相关证照的审批完成时间为准，证照原件需您到现场自取或另行协商邮寄。</p>

<h3 style="font-size:32rpx;font-weight:600;margin:32rpx 0 16rpx;color:#222;">七、用户行为规范</h3>
<ul style="font-size:28rpx;line-height:2.2;color:#333;padding-left:32rpx;">
<li>您不得利用平台服务从事任何违法违规活动，包括但不限于发布虚假信息、恶意下单、洗钱、套现等。</li>
<li><strong>您不得绕开本平台直接与履约供应商建立交易关系（跳单/飞单），否则我们有权暂停或终止服务，并保留追究法律责任的权利。</strong></li>
<li>您不得侵犯他人知识产权、肖像权、名誉权等合法权益。</li>
</ul>

<h3 style="font-size:32rpx;font-weight:600;margin:32rpx 0 16rpx;color:#222;">八、免责声明</h3>
<p style="font-size:28rpx;line-height:1.9;color:#333;">对以下情形造成的损失或延误，我们不承担责任：</p>
<ul style="font-size:28rpx;line-height:2.2;color:#333;padding-left:32rpx;">
<li>因您提交的材料不符合要求、证件过期、信息有误等自身原因导致业务无法办理；</li>
<li>因行政部门政策调整、审核标准变化、系统故障等非我们可控因素导致服务延误或失败；</li>
<li>因地震、台风、疫情、战争、罢工等不可抗力导致服务中断；</li>
<li>因邮寄过程中快递延误、包裹丢失、损毁（非我们过错）等物流原因；</li>
<li>因您自身保管不当导致材料、证照遗失。</li>
</ul>

<h3 style="font-size:32rpx;font-weight:600;margin:32rpx 0 16rpx;color:#222;">九、知识产权</h3>
<p style="font-size:28rpx;line-height:1.9;color:#333;">蓉城企服小程序内的所有内容（包括但不限于文字、图片、标识、界面设计、版面框架）的知识产权归成都蓉城信息服务有限公司所有。未经书面授权，您不得复制、修改、传播或以商业目的使用上述内容。</p>

<h3 style="font-size:32rpx;font-weight:600;margin:32rpx 0 16rpx;color:#222;">十、个人信息保护</h3>
<p style="font-size:28rpx;line-height:1.9;color:#333;">我们依法保护您的个人信息安全，具体按照本小程序公示的《隐私政策》执行。<strong>为完成服务交付，我们需将您的必要信息提供给履约供应商用于刻章备案、登报发布、记账报税等用途，您对此知悉并同意。</strong></p>

<h3 style="font-size:32rpx;font-weight:600;margin:32rpx 0 16rpx;color:#222;">十一、账户注销</h3>
<p style="font-size:28rpx;line-height:1.9;color:#333;">您可通过联系客服申请注销账户。账户注销后，您的个人信息将按隐私政策相关规定处理；尚未完成的订单将视情况终止或退款；已提交的材料按相关法规要求进行存档，存档期内的信息不因账户注销而删除。</p>

<h3 style="font-size:32rpx;font-weight:600;margin:32rpx 0 16rpx;color:#222;">十二、协议变更</h3>
<p style="font-size:28rpx;line-height:1.9;color:#333;">我们保留根据法律法规或业务需要适时修订本协议的权利。修订内容将于生效前7日通过小程序公告或页面提示的方式通知您。如您不同意修订后的协议，有权停止使用本服务；如您继续使用，视为您接受修订后的协议。</p>

<h3 style="font-size:32rpx;font-weight:600;margin:32rpx 0 16rpx;color:#222;">十三、争议解决</h3>
<p style="font-size:28rpx;line-height:1.9;color:#333;">本协议的解释、执行及争议解决均适用中华人民共和国法律。如因本服务发生争议，双方应首先友好协商解决；协商不成的，任一方可向成都蓉城信息服务有限公司住所地有管辖权的人民法院提起诉讼。</p>

<h3 style="font-size:32rpx;font-weight:600;margin:32rpx 0 16rpx;color:#222;">十四、联系我们</h3>
<p style="font-size:28rpx;line-height:1.9;color:#333;">如您对本协议有任何疑问，请通过以下方式联系我们：</p>
<ul style="font-size:28rpx;line-height:2.2;color:#333;padding-left:32rpx;">
<li>联系地址：四川省成都市（具体地址见小程序"关于我们"）</li>
<li>联系电话：见小程序"关于我们"页面公示</li>
<li>受理时间：工作日 9:00–18:00</li>
</ul>`;

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
