/**
 * 招标公告 - 分类配置
 * 涵盖工程招标、采购招标、通用招标等
 */

const categories = [
  {
    id: 1,
    name: '工程场地租赁招标',
    color: '#5B6FE8',
    desc: '工程项目、场地承租招标',
    hot: true,
    docs: [
      { name: '工程招标公告' },
      { name: '场地承租项目招标公告' },
    ]
  },
  {
    id: 2,
    name: '采购供应商招标',
    color: '#6675EA',
    desc: '物资采购、供应商入围招标',
    hot: true,
    docs: [
      { name: '采购招标公告' },
      { name: '供应商招标公告' },
    ]
  },
  {
    id: 3,
    name: '招聘通用招标',
    color: '#727BED',
    desc: '社会招聘、通用服务招标',
    hot: false,
    docs: [
      { name: '社会招聘招标公告' },
      { name: '招标公告' },
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
  const tenderingUnit = 'XXXX招标代理有限公司';

  // ==================== 1. 工程、场地租赁招标 ====================
  if (name === '工程招标公告') {
    return `招标公告\n\n${companyName}（以下简称"招标人"）现就"XXXX项目"进行公开招标，欢迎符合条件的投标人参加投标。\n\n一、项目概况\n  1. 项目名称：XXXX项目\n  2. 建设地点：XX省XX市XX区/县XX路XX号\n  3. 建设规模：XXXXXXXX\n  4. 招标范围：XXXXXXXX\n  5. 工期要求：XXXX日历天\n\n二、投标人资格要求\n  1. 具有独立法人资格，持有有效营业执照。\n  2. 具有XXXX资质（如：建筑工程施工总承包X级及以上资质）。\n  3. 项目经理具有XXXX专业X级及以上注册建造师执业资格。\n  4. 近X年内具有类似项目业绩。\n  5. 投标人未被列入"信用中国"网站失信被执行人名单。\n\n三、招标文件的获取\n  1. 时间：XXXX年XX月XX日至XXXX年XX月XX日（法定节假日除外），每日XX:XX-XX:XX。\n  2. 地点：XXXXXXXX\n  3. 售价：XXXX元/份，售后不退。\n\n四、投标文件的递交\n  1. 截止时间：XXXX年XX月XX日XX时XX分\n  2. 递交地点：XXXXXXXX\n  3. 逾期送达或者未送达指定地点的投标文件，招标人不予受理。\n\n五、开标时间及地点\n  1. 时间：XXXX年XX月XX日XX时XX分\n  2. 地点：XXXXXXXX\n\n六、联系方式\n  招标人：${companyName}\n  地址：XXXXXXXX\n  联系人：XXX  电话：XXXX-XXXXXXXX\n  招标代理：${tenderingUnit}\n  地址：XXXXXXXX\n  联系人：XXX  电话：XXXX-XXXXXXXX\n\n${companyName}\nXXXX年XX月XX日`;
  }

  if (name === '场地承租项目招标公告') {
    return `场地承租项目招标公告\n\n${companyName}现就"XXXX场地承租项目"进行公开招标，欢迎符合条件的承租人参加投标。\n\n一、项目概况\n  1. 场地位置：XX省XX市XX区XX路XX号\n  2. 场地面积：约XXXX平方米\n  3. 场地用途：XXXXXXXX（如：仓储、停车、经营等）\n  4. 租赁期限：X年（自XXXX年XX月XX日至XXXX年XX月XX日）\n  5. 租金底价：XXXX元/年\n\n二、承租人资格要求\n  1. 具有独立承担民事责任能力的自然人、法人或其他组织。\n  2. 具有良好的商业信誉和健全的财务会计制度。\n  3. 具有履行租赁合同所必需的经营能力和场地使用能力。\n  4. 近X年内无重大违法记录。\n\n三、招标文件的获取\n  1. 时间：XXXX年XX月XX日至XXXX年XX月XX日\n  2. 地点：XXXXXXXX\n  3. 报名时须携带：有效身份证件、营业执照（单位）等。\n\n四、投标文件的递交\n  1. 截止时间：XXXX年XX月XX日XX时XX分\n  2. 递交地点：XXXXXXXX\n\n五、开标时间及地点\n  1. 时间：XXXX年XX月XX日XX时XX分\n  2. 地点：XXXXXXXX\n\n六、联系方式\n  ${companyName}\n  联系人：XXX  电话：XXXX-XXXXXXXX\n  XXXX年XX月XX日`;
  }

  // ==================== 2. 采购、供应商招标 ====================
  if (name === '采购招标公告') {
    return `采购招标公告\n\n${companyName}现就"XXXX采购项目"进行公开招标，欢迎符合条件的供应商参加投标。\n\n一、项目概况\n  1. 项目名称：XXXX采购项目\n  2. 采购内容：XXXXXXXX\n  3. 采购数量：XXXXXXXX\n  4. 交货地点：XXXXXXXX\n  5. 交货期：合同签订后XX日内交货\n\n二、供应商资格要求\n  1. 具有独立法人资格，持有有效营业执照。\n  2. 具有相应的经营范围和供货能力。\n  3. 近X年内具有类似项目供货业绩。\n  4. 供应商未被列入"信用中国"网站失信被执行人名单。\n  5. 本项目不接受联合体投标。\n\n三、招标文件的获取\n  1. 时间：XXXX年XX月XX日至XXXX年XX月XX日\n  2. 地点：XXXXXXXX\n  3. 售价：XXXX元/份\n\n四、投标文件的递交\n  1. 截止时间：XXXX年XX月XX日XX时XX分\n  2. 递交地点：XXXXXXXX\n\n五、开标时间及地点\n  1. 时间：XXXX年XX月XX日XX时XX分\n  2. 地点：XXXXXXXX\n\n六、联系方式\n  ${companyName}\n  联系人：XXX  电话：XXXX-XXXXXXXX\n  ${tenderingUnit}\n  联系人：XXX  电话：XXXX-XXXXXXXX\n\n${companyName}\nXXXX年XX月XX日`;
  }

  if (name === '供应商招标公告') {
    return `供应商招标公告\n\n${companyName}现就"XXXX项目供应商入围"进行公开招标，现邀请符合条件的供应商参加投标。\n\n一、项目概况\n  1. 项目名称：${companyName}XXXX项目供应商入围招标\n  2. 入围数量：按综合评分排名，入围X家\n  3. 服务期限：X年（自XXXX年XX月XX日至XXXX年XX月XX日）\n  4. 招标内容：XXXXXXXX\n\n二、供应商资格要求\n  1. 具有独立法人资格，持有有效营业执照。\n  2. 具有相应的经营范围和服务能力。\n  3. 近X年内具有类似项目服务业绩。\n  4. 具有完善的质量保证体系和售后服务体系。\n  5. 供应商未被列入"信用中国"网站失信被执行人名单。\n\n三、招标文件的获取\n  1. 时间：XXXX年XX月XX日至XXXX年XX月XX日\n  2. 地点：XXXXXXXX\n\n四、投标文件的递交\n  1. 截止时间：XXXX年XX月XX日XX时XX分\n  2. 递交地点：XXXXXXXX\n\n五、开标时间及地点\n  1. 时间：XXXX年XX月XX日XX时XX分\n  2. 地点：XXXXXXXX\n\n六、联系方式\n  ${companyName}\n  联系人：XXX  电话：XXXX-XXXXXXXX\n\n${companyName}\nXXXX年XX月XX日`;
  }

  // ==================== 3. 招聘、通用招标 ====================
  if (name === '社会招聘招标公告') {
    return `社会招聘公告\n\n${companyName}因业务发展需要，现面向社会公开招聘工作人员，现将有关事项公告如下：\n\n一、招聘原则\n  坚持公开、平等、竞争、择优的原则。\n\n二、招聘岗位及人数\n  XXXX岗位：X名\n  XXXX岗位：X名\n  （详见招聘岗位表）\n\n三、招聘条件\n  1. 具有中华人民共和国国籍。\n  2. 遵守宪法和法律，具有良好的品行。\n  3. 具备岗位所需的专业、学历、技能等条件。\n  4. 身体健康，能适应岗位要求。\n\n四、招聘程序\n  1. 报名：XXXX年XX月XX日至XXXX年XX月XX日，采用网上报名方式。\n  2. 资格审查：对报名人员进行资格审查，符合条件的进入考试环节。\n  3. 考试：采取笔试+面试的方式进行。\n  4. 体检、考察：根据考试成绩确定体检和考察人选。\n  5. 公示、聘用：对拟聘用人员进行公示，公示期满无异议的，办理聘用手续。\n\n五、待遇\n  聘用人员享受国家法定节假日及${companyName}规定的薪酬福利待遇。\n\n六、联系方式\n  联系人：XXX  电话：XXXX-XXXXXXXX\n  邮箱：XXXX@XXXX.com\n  ${companyName}\n  XXXX年XX月XX日`;
  }

  if (name === '招标公告') {
    return `招标公告\n\n${companyName}现就"XXXX项目"进行公开招标，欢迎符合条件的投标人参加投标。\n\n一、项目概况\n  1. 项目名称：XXXX项目\n  2. 项目地点：XXXXXXXX\n  3. 招标范围：XXXXXXXX\n  4. 服务/工期：XXXXXXXX\n\n二、投标人资格要求\n  1. 具有独立法人资格，持有有效营业执照。\n  2. 具有相应的资质和能力。\n  3. 近X年内具有类似项目业绩。\n  4. 投标人未被列入"信用中国"网站失信被执行人名单。\n\n三、招标文件的获取\n  1. 时间：XXXX年XX月XX日至XXXX年XX月XX日\n  2. 地点：XXXXXXXX\n  3. 售价：XXXX元/份\n\n四、投标文件的递交\n  1. 截止时间：XXXX年XX月XX日XX时XX分\n  2. 递交地点：XXXXXXXX\n\n五、开标时间及地点\n  1. 时间：XXXX年XX月XX日XX时XX分\n  2. 地点：XXXXXXXX\n\n六、联系方式\n  ${companyName}\n  联系人：XXX  电话：XXXX-XXXXXXXX\n\n${companyName}\nXXXX年XX月XX日`;
  }

  // 默认兜底
  return `${companyName}\n\n招标公告\n\n${companyName}现就"XXXX项目"进行公开招标，欢迎符合条件的投标人参加投标。\n\n一、项目概况：XXXXXXXX\n二、投标人资格要求：XXXXXXXX\n三、招标文件的获取：XXXXXXXX\n四、投标文件的递交：XXXXXXXX\n五、开标时间及地点：XXXXXXXX\n六、联系方式：XXXXXXXX\n\n${companyName}\nXXXX年XX月XX日`;
}

module.exports = { categories, generateContent, getTotalCount };
