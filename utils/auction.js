/**
 * 拍卖公告 - 分类配置
 * 涵盖通用拍卖、网络拍卖、专项资产拍卖、司法法院拍卖
 */

const categories = [
  {
    id: 1,
    name: '通用拍卖公告',
    color: '#5B6FE8',
    desc: '线下拍卖通用模板',
    hot: true,
    docs: [
      { name: '拍卖公告' },
      { name: '拍卖公告 1' },
      { name: '拍卖公告 2' },
      { name: '公开拍卖公告' },
    ]
  },
  {
    id: 2,
    name: '网络线上拍卖',
    color: '#5B6FE8',
    desc: '网络拍卖平台公告',
    hot: true,
    docs: [
      { name: '网络拍卖公告 1' },
      { name: '网络拍卖公告 2' },
    ]
  },
  {
    id: 3,
    name: '专项资产拍卖',
    color: '#5B6FE8',
    desc: '资产、机动车专项拍卖',
    hot: false,
    docs: [
      { name: '资产拍卖公告' },
      { name: '机动车拍卖公告' },
    ]
  },
  {
    id: 4,
    name: '司法法院拍卖',
    color: '#5B6FE8',
    desc: '法院强制执行拍卖公告',
    hot: false,
    docs: [
      { name: '法院拍卖公告' },
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
  const auctionHouse = 'XXXX拍卖有限公司';
  const courtName = 'XXXX人民法院';

  // ==================== 1. 通用拍卖公告 ====================
  if (name === '拍卖公告') {
    return `拍卖公告\n\n受${companyName}委托， ${auctionHouse}定于XXXX年XX月XX日XX时，在XXXX（地址）举行公开拍卖会，现公告如下：\n\n一、拍卖标的：XXXXXXXX\n二、展示时间：XXXX年XX月XX日至XXXX年XX月XX日（工作时间）\n三、展示地点：XXXXXXXX\n四、报名时间：XXXX年XX月XX日至XXXX年XX月XX日（每日XX:XX-XX:XX）\n五、报名地点：XXXXXXXX\n六、竞买保证金：XXXXXXXX元/标的\n七、其他事项：XXXXXXXX\n\n联系方式：XXX  XXXX-XXXXXXXX\n${auctionHouse}\nXXXX年XX月XX日`;
  }

  if (name === '拍卖公告 1') {
    return `拍卖公告\n\n根据《中华人民共和国拍卖法》之规定，${auctionHouse}受所有权人委托，对以下标的进行公开拍卖：\n\n一、拍卖标的\n  1. XXXXXXXX\n  2. XXXXXXXX\n  3. XXXXXXXX\n\n二、拍卖时间：XXXX年XX月XX日XX时\n三、拍卖地点：XXXXXXXX\n四、标的展示：XXXX年XX月XX日至XX月XX日（工作时间），在标的所在地展示。\n五、竞买登记：\n  1. 有意竞买者请于XXXX年XX月XX日XX时前，将竞买保证金缴至指定账户（以到账为准）。\n  2. 携有效证件及保证金收据到XXXX办理竞买登记手续。\n\n六、联系方式\n  联系人：XXX  联系电话：XXXX-XXXXXXXX\n  ${auctionHouse}\n  XXXX年XX月XX日`;
  }

  if (name === '拍卖公告 2') {
    return `拍卖公告\n\n${auctionHouse}拍卖公告\n\n受委托，${auctionHouse}定于XXXX年XX月XX日XX时在XXXX举行拍卖会，现公告如下：\n\n一、拍卖标的：XXXXXXXX\n二、拍卖依据：XXXXXXXX\n三、竞买人资格：XXXXXXXX\n四、标的展示时间与地点：XXXX年XX月XX日至XX月XX日，在标的所在地展示。\n五、报名时间及方式：XXXX年XX月XX日至XX月XX日，在XXXX现场报名。\n六、竞买保证金：XXXXXXXX元。\n七、特别说明：XXXXXXXX\n\n联系方式：\n  ${auctionHouse}\n  地址：XXXXXXXX\n  电话：XXXX-XXXXXXXX\n  XXXX年XX月XX日`;
  }

  if (name === '公开拍卖公告') {
    return `公开拍卖公告\n\n根据《中华人民共和国拍卖法》及《中华人民共和国民法典》之规定，${companyName}委托${auctionHouse}对下列资产进行公开拍卖，现就有关事宜公告如下：\n\n一、拍卖标的：XXXXXXXX\n二、拍卖时间：XXXX年XX月XX日XX时\n三、拍卖地点：XXXXXXXX\n四、标的展示：\n  展示时间：XXXX年XX月XX日至XXXX年XX月XX日\n  展示地点：标的所在地\n五、竞买人资格：XXXXXXXX\n六、报名手续：\n  1. 个人：身份证原件及复印件。\n  2. 单位：营业执照复印件、法定代表人身份证复印件、授权委托书等。\n  3. 缴纳竞买保证金至指定账户。\n七、特别说明：XXXXXXXX\n\n联系人：XXX  电话：XXXX-XXXXXXXX\n${auctionHouse}\nXXXX年XX月XX日`;
  }

  // ==================== 2. 网络线上拍卖 ====================
  if (name === '网络拍卖公告 1') {
    return `网络拍卖公告\n\n受${companyName}委托，${auctionHouse}定于XXXX年XX月XX日XX时至XX时（延时除外），在XXXX网络拍卖平台（网址：XXXXXXXX）对以下标的进行公开网络拍卖：\n\n一、拍卖标的：XXXXXXXX\n二、竞买人资格：XXXXXXXX\n三、展示时间及地点：XXXX年XX月XX日至XX月XX日，在标的所在地展示。\n四、网上报名：有意竞买者请于XXXX年XX月XX日XX时前，登录XXXX网络拍卖平台完成实名注册、报名及缴纳保证金手续。\n五、特别提醒：\n  1. 本次拍卖为网络拍卖，拍卖结束时的最高应价即为成交价。\n  2. 拍卖平台网址：XXXXXXXX\n  3. 咨询电话：XXXX-XXXXXXXX\n\n${auctionHouse}\nXXXX年XX月XX日`;
  }

  if (name === '网络拍卖公告 2') {
    return `网络拍卖公告\n\n${auctionHouse}网络拍卖公告\n\n一、拍卖标的：XXXXXXXX\n二、拍卖平台：XXXX网络拍卖平台（网址：XXXXXXXX）\n三、拍卖时间：XXXX年XX月XX日XX时XX分至XX时XX分（延时除外）\n四、起拍价：XXXXXXXX元\n五、竞买人条件：XXXXXXXX\n六、咨询、展示看样的时间与方式：自公告之日起至XXXX年XX月XX日XX时止接受咨询，有意者请与${auctionHouse}联系安排看样。\n七、竞买人须在拍卖平台完成实名注册，并在拍卖结束前缴纳保证金。\n八、特别说明：XXXXXXXX\n\n咨询电话：XXXX-XXXXXXXX\n${auctionHouse}\nXXXX年XX月XX日`;
  }

  // ==================== 3. 专项资产拍卖 ====================
  if (name === '资产拍卖公告') {
    return `资产拍卖公告\n\n根据《中华人民共和国拍卖法》及相关法律法规之规定，${companyName}委托${auctionHouse}对下列资产进行公开拍卖：\n\n一、拍卖标的：\n  1. 资产名称：XXXXXXXX\n  2. 资产位置：XXXXXXXX\n  3. 资产规模：XXXXXXXX\n  4. 参考价：XXXXXXXX元\n\n二、拍卖时间：XXXX年XX月XX日XX时\n三、拍卖地点：XXXXXXXX\n四、竞买人资格：XXXXXXXX\n五、标的展示：XXXX年XX月XX日至XX月XX日，在资产所在地展示。\n六、报名方式：有意竞买者请于XXXX年XX月XX日XX时前，到${auctionHouse}办理报名手续并缴纳保证金。\n七、特别说明：XXXXXXXX\n\n${auctionHouse}\n地址：XXXXXXXX\n电话：XXXX-XXXXXXXX\nXXXX年XX月XX日`;
  }

  if (name === '机动车拍卖公告') {
    return `机动车拍卖公告\n\n受${companyName}委托，${auctionHouse}对以下机动车进行公开拍卖：\n\n一、拍卖标的：\n  1. 车牌号：XXXXXXXX  品牌型号：XXXXXXXX  初次登记日期：XXXX年XX月\n  2. 车牌号：XXXXXXXX  品牌型号：XXXXXXXX  初次登记日期：XXXX年XX月\n  （详见拍卖文件）\n\n二、拍卖时间：XXXX年XX月XX日XX时\n三、拍卖地点：XXXXXXXX\n四、车辆展示：XXXX年XX月XX日至XX月XX日，在XXXXXXXX展示。\n五、报名手续：\n  1. 竞买人须为具有完全民事行为能力的自然人或合法存续的法人/其他组织。\n  2. 缴纳竞买保证金XXXX元/辆。\n  3. 报名时须携带有效身份证件。\n六、特别说明：\n  1. 车辆以现状拍卖，拍卖人不承担瑕疵担保责任。\n  2. 车辆过户手续由买受人自行办理，相关税费由买受人承担。\n\n${auctionHouse}\n咨询电话：XXXX-XXXXXXXX\nXXXX年XX月XX日`;
  }

  // ==================== 4. 司法法院拍卖 ====================
  if (name === '法院拍卖公告') {
    return `法院拍卖公告\n\n${courtName}拍卖公告\n\n根据《中华人民共和国民事诉讼法》《最高人民法院关于人民法院民事执行中拍卖、变卖财产的规定》之规定，${courtName}将于XXXX年XX月XX日XX时XX分至XXXX年XX月XX日XX时XX分（延时的除外），在${courtName}网络司法拍卖平台（网址：XXXXXXXX）对以下财产进行公开拍卖：\n\n一、拍卖财产：XXXXXXXX\n二、评估价：XXXXXXXX元  起拍价：XXXXXXXX元  保证金：XXXXXXXX元  增价幅度：XXXXXXXX元\n三、竞买人资格：\n  1. 凡具备完全民事行为能力的公民、法人和其他组织均可参加竞买。\n  2. 委托代理人竞买的，须在竞价程序开始前XXX个工作日向法院办理委托手续。\n四、咨询、展示看样：自公告之日起至拍卖结束前接受咨询，有意者请与法院联系安排看样。\n五、特别提醒：\n  1. 拍卖财产以实物现状为准，法院不承担拍卖财产的瑕疵担保责任。\n  2. 竞买人决定参与竞买的，视为对拍卖财产完全了解，并接受拍卖财产一切已知和未知瑕疵。\n  3. 拍卖成交后，买受人须在XXXX日内将尾款缴入法院指定账户。\n\n咨询电话：XXXX-XXXXXXXX（${courtName}执行局）\n${courtName}\nXXXX年XX月XX日`;
  }

  // 默认兜底
  return `${companyName}\n\n拍卖公告\n\n受委托，${auctionHouse}对以下标的进行公开拍卖，现将有关事宜公告如下：\n\n一、拍卖标的：XXXXXXXX\n二、拍卖时间：XXXX年XX月XX日XX时\n三、拍卖地点：XXXXXXXX\n四、标的展示：XXXXXXXX\n五、竞买登记：XXXXXXXX\n六、特别说明：XXXXXXXX\n\n${auctionHouse}\nXXXX年XX月XX日`;
}

module.exports = { categories, generateContent, getTotalCount };
