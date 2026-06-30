/**
 * 登报道歉 - 分类配置
 * 涵盖个人道歉、企业道歉、产品道歉等
 */

const categories = [
  {
    id: 1,
    name: '个人道歉声明',
    color: '#EB2F96',
    desc: '个人原因致歉公示',
    hot: true,
    docs: [
      { name: '个人道歉声明' },
      { name: '个人误伤道歉' },
      { name: '个人侵权道歉' },
    ]
  },
  {
    id: 2,
    name: '企业道歉声明',
    color: '#5B6FE8',
    desc: '企业对外致歉公告',
    hot: true,
    docs: [
      { name: '企业道歉声明' },
      { name: '企业服务道歉' },
      { name: '企业虚假宣传道歉' },
    ]
  },
  {
    id: 3,
    name: '产品道歉声明',
    color: '#FA8C16',
    desc: '产品质量问题致歉',
    hot: false,
    docs: [
      { name: '产品道歉声明' },
      { name: '产品召回道歉' },
    ]
  },
  {
    id: 4,
    name: '其他道歉声明',
    color: '#52C41A',
    desc: '侵权、违约等致歉',
    hot: false,
    docs: [
      { name: '侵权道歉声明' },
      { name: '违约道歉声明' },
    ]
  }
];

function getTotalCount() {
  return categories.reduce((sum, cat) => sum + cat.docs.length, 0);
}

/**
 * 根据模板名称生成报纸内容
 */
function generateContent(name) {
  const companyName = 'XXXX公司';
  const personName = 'XXX';

  // ==================== 1. 个人道歉声明 ====================
  if (name === '个人道歉声明') {
    return `道歉声明\n\n本人${personName}，身份证号：XXXXXXXXXXXXXXXXXX。\n\n本人于XXXX年XX月XX日在XXXXXXXX（平台/场合）发布了关于XXXXXXXX的不实言论/信息，对XXXX造成了不良影响。现本人郑重道歉：\n\n一、本人发布的内容与事实不符，对此深表歉意。\n二、本人已主动删除上述不实内容，并将引以为戒，严格遵守法律法规和网络公德。\\n三、特此登报致歉，消除影响。\n\n道歉人：${personName}\nXXXX年XX月XX日`;
  }

  if (name === '个人误伤道歉') {
    return `道歉声明\n\n本人${personName}，身份证号：XXXXXXXXXXXXXXXXXX。\n\n因本人XXXX年XX月XX日在XXXXXXXX（事件）中，误伤/误解了XXXX，给其造成了困扰和不良影响。现本人郑重道歉：\n\n一、对本人不当言行给XXXX造成的伤害，深表歉意。\n二、本人已认识到自身错误，并将引以为戒。\n三、特此登报致歉，以消除影响。\n\n道歉人：${personName}\nXXXX年XX月XX日`;
  }

  if (name === '个人侵权道歉') {
    return `侵权道歉声明\n\n本人${personName}，身份证号：XXXXXXXXXXXXXXXXXX。\n\n本人因在XXXXXXXX中使用/传播了XXXXXXXX（作品/肖像/名誉等），侵犯了XXXX的合法权益。现本人郑重道歉：\n\n一、本人已立即停止侵权行为，并删除相关侵权内容。\n二、本人将依法承担相应的法律责任。\n三、特此登报致歉，消除影响。\n\n道歉人：${personName}\nXXXX年XX月XX日`;
  }

  // ==================== 2. 企业道歉声明 ====================
  if (name === '企业道歉声明') {
    return `道歉声明\n\n${companyName}就XXXXXXXX事件，向社会公众及受影响的相关方郑重道歉：\n\n一、事件概述：XXXXXXXX\n二、我司已立即采取以下措施：\n  1. XXXXXXXX\n  2. XXXXXXXX\n  3. XXXXXXXX\n三、我司将深刻吸取教训，完善内部管理，杜绝类似事件再次发生。\n四、对受到影响的各方，我司将依法承担相应责任。\n\n特此登报致歉。\n\n${companyName}\nXXXX年XX月XX日`;
  }

  if (name === '企业服务道歉') {
    return `服务道歉声明\n\n${companyName}就近期服务过程中出现的XXXXXXXX问题，向广大用户及受影响客户郑重道歉：\n\n一、问题说明：XXXXXXXX\n二、处理措施：\n  1. 我司已立即XXXXXX进行整改。\n  2. 对受影响的客户，我司将XXXXXX予以补偿。\n  3. 我司将完善服务流程，避免类似问题再次发生。\n三、感谢社会各界的监督与理解。\n\n特此登报致歉。\n\n${companyName}\nXXXX年XX月XX日`;
  }

  if (name === '企业虚假宣传道歉') {
    return `虚假宣传道歉声明\n\n${companyName}就我司在XXXXXXXX（平台/渠道）对XXXXXXXX产品/服务进行虚假宣传一事，向社会公众及广大消费者郑重道歉：\n\n一、我司在宣传中XXXXXXXX（具体虚假内容），与产品/服务实际情况不符。\n二、我司已立即停止相关虚假宣传，并主动整改。\n三、对因此受到误导的消费者，我司将依法予以赔偿/处理。\n四、我司将严格遵守《中华人民共和国广告法》等法律法规，诚信经营。\n\n特此登报致歉。\n\n${companyName}\nXXXX年XX月XX日`;
  }

  // ==================== 3. 产品道歉声明 ====================
  if (name === '产品道歉声明') {
    return `产品道歉声明\n\n${companyName}就我司生产的XXXXXXXX产品存在的XXXXXXXX问题，向广大消费者郑重道歉：\n\n一、问题描述：XXXXXXXX\n二、我司已立即采取以下措施：\n  1. 对存在问题批次的产品进行XXXXXX。\n  2. 对已售出产品，我司将XXXXXX予以处理。\n  3. 完善生产质量管控体系，杜绝类似问题。\n三、对因此受到影响的消费者，我司将依法承担相应责任。\n\n特此登报致歉。\n\n${companyName}\nXXXX年XX月XX日`;
  }

  if (name === '产品召回道歉') {
    return `产品召回道歉声明\n\n${companyName}就我司生产的XXXXXXXX产品（批次号：XXXXXXXX）存在的XXXXXXXX缺陷/问题，向广大消费者郑重道歉并公告召回：\n\n一、产品信息：\n  产品名称：XXXXXXXX\n  型号/批次：XXXXXXXX\n  生产日期：XXXX年XX月XX日至XXXX年XX月XX日\n\n二、召回原因：XXXXXXXX\n\n三、召回措施：\n  1. 请持有上述批次产品的消费者立即停止使用。\n  2. 我司将予以退换货/维修/赔偿（具体方式：XXXXXXXX）。\n  3. 联系方式：XXXX-XXXXXXXX\n\n四、对因此给消费者带来的不便，我司深表歉意。\n\n特此登报致歉并公告召回。\n\n${companyName}\nXXXX年XX月XX日`;
  }

  // ==================== 4. 其他道歉声明 ====================
  if (name === '侵权道歉声明') {
    return `侵权道歉声明\n\n${companyName}就我司在XXXXXXXX中侵犯XXXXXXXX（权利人）的XXXXXXXX（知识产权/名誉权/肖像权等）一事，郑重道歉：\n\n一、我司已立即停止侵权行为，并删除/撤下相关侵权内容。\n二、我司将依法承担相应法律责任，并对权利人予以合理赔偿。\n三、我司将严格遵守法律法规，尊重他人合法权益。\n\n特此登报致歉。\n\n${companyName}\nXXXX年XX月XX日`;
  }

  if (name === '违约道歉声明') {
    return `违约道歉声明\n\n${companyName}就我司在履行与XXXXXXXX的XXXXXXXX合同/协议过程中出现的违约行为，郑重道歉：\n\n一、违约情况说明：XXXXXXXX\n二、我司已采取补救措施：XXXXXXXX\n三、我司将依法承担违约责任，并对受损方予以合理赔偿。\n四、我司将严格遵守合同约定，诚信履约。\n\n特此登报致歉。\n\n${companyName}\nXXXX年XX月XX日`;
  }

  // 默认兜底
  return `${companyName}\n\n道歉声明\n\n就XXXXXXXX一事，我司/本人深表歉意，并将依法承担相应责任。\n\n特此登报致歉。\n\n${companyName}\nXXXX年XX月XX日`;
}

module.exports = { categories, generateContent, getTotalCount };
