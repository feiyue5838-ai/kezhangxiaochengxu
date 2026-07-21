/**
 * 宣传稿 - 分类配置
 * 涵盖个人、企业、政府、普法公益、项目工程等
 */

const categories = [
  // ==================== 一级大类1：按主体分类 ====================
  {
    id: 1,
    name: '个人主体',
    color: '#FA8C16',
    desc: '个人宣传、文章发表',
    hot: true,
    docs: [
      { name: '个人宣传稿' },
      { name: '中小学文章发表' },
      { name: '人物专访稿' },
    ]
  },
  {
    id: 2,
    name: '企业主体',
    color: '#5B6FE8',
    desc: '企业形象、品牌宣传',
    hot: true,
    docs: [
      { name: '企业宣传稿' },
      { name: '企业形象宣传稿' },
      { name: '企业品牌宣传稿' },
    ]
  },
  {
    id: 3,
    name: '政府主体',
    color: '#52C41A',
    desc: '政府形象、机关宣传',
    hot: false,
    docs: [
      { name: '政府形象宣传稿' },
    ]
  },
  // ==================== 一级大类2：普法、专项公益宣传稿 ====================
  {
    id: 4,
    name: '普法公益',
    color: '#EB2F96',
    desc: '法制宣传、公益公告',
    hot: true,
    docs: [
      { name: '法制宣传稿' },
      { name: '防诈骗宣传公告' },
      { name: '廉洁活动宣传稿' },
      { name: '禁毒宣传稿' },
      { name: '精准帮扶宣传稿' },
    ]
  },
  // ==================== 一级大类3：项目、工程、商业类宣传公告 ====================
  {
    id: 5,
    name: '项目工程',
    color: '#722ED1',
    desc: '项目招商、工程宣传',
    hot: false,
    docs: [
      { name: '大棚招租' },
      { name: '工程开通宣传稿' },
      { name: '电影项目宣传稿' },
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

  // ==================== 1. 个人主体 ====================
  if (name === '个人宣传稿') {
    return `宣传稿

${personName}同志先进事迹宣传

${personName}，男/女，XXXX年XX月出生，XXXXXXXX（职业/职务），长期以来在XXXXXXXX领域表现突出，取得了优异成绩。

一、个人简介
${personName}同志于XXXX年XX月参加工作，现就职于XXXXXXXX，担任XXXXXXXX职务。

二、主要事迹
  1. XXXXXXXX
  2. XXXXXXXX
  3. XXXXXXXX

三、所获荣誉
  XXXXXXXX

希望广大群众以${personName}同志为榜样，XXXXXXXX。

XXXXXXXX
XXXX年XX月XX日`;
  }

  if (name === '中小学文章发表') {
    return `文章发表

${personName}同学作品刊登

学校：XXXXXXXX
班级：XXXX年级XX班
姓名：${personName}
指导老师：XXX

作品标题：《XXXXXXXX》

作品内容：
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

特此刊登，以资鼓励。

XXXXXXXX报社
XXXX年XX月XX日`;
  }

  if (name === '人物专访稿') {
    return `人物专访

走近${personName}——XXXXXXXX

【人物简介】
${personName}，XXXXXXXX（职业/身份），XXXX年从事XXXXXXXX工作，现任XXXXXXXX。

【专访内容】

问：请您介绍一下您的工作经历？
答：XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

问：在工作中遇到的最大挑战是什么？如何克服的？
答：XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

问：对年轻人有什么建议？
答：XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

【记者手记】
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

XXXXXXXX报社
XXXX年XX月XX日`;
  }

  // ==================== 2. 企业主体 ====================
  if (name === '企业宣传稿') {
    return `宣传稿

${companyName}——XXXXXXXX行业的领军企业

${companyName}成立于XXXX年XX月，是一家专注于XXXXXXXX领域的专业化企业。公司秉承"XXXXXXXX"的经营理念，致力于为客户提供优质的产品和服务。

一、公司简介
${companyName}位于XX省XX市XX区XX路XX号，注册资本XXXX万元，现有员工XXX余人，其中专业技术人员XX余人。公司拥有XXXXXXXX（资质/认证）。

二、主营业务
公司主营业务包括：
  1. XXXXXXXX
  2. XXXXXXXX
  3. XXXXXXXX

三、企业优势
  1. 技术实力雄厚，拥有XX项专利技术。
  2. 服务团队专业，响应迅速。
  3. 质量管控严格，产品品质优良。

四、联系方式
  地址：XX省XX市XX区XX路XX号
  电话：XXXX-XXXXXXXX
  邮箱：XXXX@XXXX.com

${companyName}期待与您携手合作，共创美好未来！

${companyName}
XXXX年XX月XX日`;
  }

  if (name === '企业形象宣传稿') {
    return `企业形象宣传稿

${companyName}——诚信经营，品质为本

${companyName}自成立以来，始终坚持以客户为中心、以质量求生存、以信誉谋发展的经营方针，在XXXXXXXX行业树立了良好的企业形象。

一、企业资质
公司持有XXXXXXXX（资质证书），并通过了ISOXXXX质量管理体系认证，为产品质量提供了坚实保障。

二、企业荣誉
多年来，公司先后获得"XXXXXXXX""XXXXXXXX"等荣誉称号，得到了业界和客户的广泛认可。

三、企业文化
公司秉承"XXXXXXXX"的企业精神，倡导"XXXXXXXX"的核心价值观，致力于打造一支团结进取、专业高效的团队。

四、社会责任
公司积极履行社会责任，参与XXXXXXXX（公益活动/慈善事业），回馈社会，传递正能量。

${companyName}将继续秉承诚信经营的理念，为广大客户提供更优质的产品和服务！

${companyName}
XXXX年XX月XX日`;
  }

  if (name === '企业品牌宣传稿') {
    return `品牌宣传稿

${companyName}——打造XXXXXXXX行业标杆品牌

${companyName}旗下品牌"XXXXXXXX"，历经XX年的发展与沉淀，已成为XXXXXXXX行业的知名品牌。

一、品牌故事
"XXXXXXXX"品牌创立于XXXX年，以"XXXXXXXX"为品牌理念，致力于为消费者提供XXXXXXXX（产品/服务）。

二、品牌优势
  1. 品质卓越：严格的质量管控体系，确保产品品质。
  2. 创新驱动：持续研发投入，引领行业发展。
  3. 服务贴心：专业服务团队，为客户提供全方位支持。

三、品牌愿景
"XXXXXXXX"将继续深耕XXXXXXXX领域，努力成为行业标杆品牌，为客户创造更大价值。

${companyName}
XXXX年XX月XX日`;
  }

  // ==================== 3. 政府/机关主体 ====================
  if (name === '政府形象宣传稿') {
    return `政府形象宣传稿

XXXXXXXX（政府/机关单位）——XXXXXXXX

XXXXXXXX（政府/机关单位）始终坚持"XXXXXXXX"的工作理念，致力于XXXXXXXX，为人民群众提供优质高效的服务。

一、单位简介
XXXXXXXX（政府/机关单位）位于XX省XX市XX区XX路XX号，主要职责包括：
  1. XXXXXXXX
  2. XXXXXXXX
  3. XXXXXXXX

二、工作成效
近年来，XXXXXXXX（政府/机关单位）在XXXXXXXX方面取得了显著成效：
  1. XXXXXXXX
  2. XXXXXXXX

三、服务承诺
  1. XXXXXXXX
  2. XXXXXXXX

四、联系方式
  地址：XX省XX市XX区XX路XX号
  电话：XXXX-XXXXXXXX

XXXXXXXX（政府/机关单位）
XXXX年XX月XX日`;
  }

  // ==================== 4. 普法、专项公益宣传稿 ====================
  if (name === '法制宣传稿') {
    return `法制宣传稿

XXXXXXXX单位法制宣传教育活动

为深入贯彻落实习近平法治思想，提高全民法治意识，XXXXXXXX单位开展法制宣传教育活动：

一、宣传主题
XXXXXXXX

二、宣传内容
  1. XXXXXXXX
  2. XXXXXXXX
  3. XXXXXXXX

三、宣传时间：XXXX年XX月XX日至XXXX年XX月XX日

四、宣传地点：XXXXXXXX

五、参与方式
广大市民可前往XXXXXXXX参与活动，了解法律知识，增强法治观念。

六、联系方式
  电话：XXXX-XXXXXXXX
  地址：XXXXXXXX

普法教育，人人有责。欢迎广大市民积极参与！

XXXXXXXX单位
XXXX年XX月XX日`;
  }

  if (name === '防诈骗宣传公告') {
    return `防诈骗宣传公告

广大市民朋友：

近年来，电信网络诈骗案件频发，为保护人民群众财产安全，特此公告：

一、常见诈骗手段
  1. 冒充公检法诈骗
  2. 刷单返利诈骗
  3. 虚假投资理财诈骗
  4. 冒充熟人诈骗
  5. 虚假贷款诈骗

二、防骗提醒
  1. 不轻信陌生来电和短信
  2. 不向陌生账户转账汇款
  3. 不点击不明链接
  4. 不泄露个人信息和验证码
  5. 遇到可疑情况及时报警

三、报警电话：110

四、反诈专线：96110

请广大市民提高警惕，谨防上当受骗！

XXXXXXXX单位
XXXX年XX月XX日`;
  }

  if (name === '廉洁活动宣传稿') {
    return `廉洁活动宣传稿

XXXXXXXX单位廉洁文化建设活动

为深入推进党风廉政建设和反腐败斗争，XXXXXXXX单位开展廉洁文化建设活动：

一、活动主题
XXXXXXXX

二、活动内容
  1. XXXXXXXX
  2. XXXXXXXX
  3. XXXXXXXX

三、活动时间：XXXX年XX月XX日至XXXX年XX月XX日

四、活动地点：XXXXXXXX

五、参与对象：XXXXXXXX

六、活动意义
通过本次活动，进一步增强党员干部廉洁自律意识，营造风清气正的良好氛围。

七、联系方式
  电话：XXXX-XXXXXXXX
  地址：XXXXXXXX

廉洁从政，清廉为民。欢迎广大党员干部积极参与！

XXXXXXXX单位
XXXX年XX月XX日`;
  }

  if (name === '禁毒宣传稿') {
    return `禁毒宣传稿

XXXXXXXX单位禁毒宣传教育活动

珍爱生命，远离毒品。为增强全民禁毒意识，XXXXXXXX单位开展禁毒宣传教育活动：

一、宣传主题
XXXXXXXX

二、宣传内容
  1. 毒品的种类及危害
  2. 如何识别毒品
  3. 如何防范毒品侵害
  4. 禁毒法律法规

三、宣传时间：XXXX年XX月XX日至XXXX年XX月XX日

四、宣传地点：XXXXXXXX

五、参与方式
广大市民可前往XXXXXXXX参与活动，了解禁毒知识，增强防毒意识。

六、举报电话：110

禁毒工作，人人有责。让我们共同行动，创建无毒社会！

XXXXXXXX单位
XXXX年XX月XX日`;
  }

  if (name === '精准帮扶宣传稿') {
    return `精准帮扶宣传稿

XXXXXXXX单位精准帮扶活动

为贯彻落实国家精准帮扶政策，XXXXXXXX单位开展精准帮扶活动：

一、帮扶对象
XXXXXXXX

二、帮扶内容
  1. XXXXXXXX
  2. XXXXXXXX
  3. XXXXXXXX

三、帮扶时间：XXXX年XX月XX日至XXXX年XX月XX日

四、帮扶方式
  1. XXXXXXXX
  2. XXXXXXXX

五、申请条件
  1. XXXXXXXX
  2. XXXXXXXX

六、联系方式
  电话：XXXX-XXXXXXXX
  地址：XXXXXXXX

精准帮扶，温暖人心。欢迎符合条件的群众前来咨询申请！

XXXXXXXX单位
XXXX年XX月XX日`;
  }

  // ==================== 5. 项目、工程、商业类 ====================
  if (name === '大棚招租') {
    return `大棚招租

XXXXXXXX大棚出租公告

现有位于XXXXXXXX的大棚对外出租，具体情况如下：

一、大棚信息
  数量：XX个
  面积：每个约XX平方米
  结构：XXXXXXXX（钢架/竹架等）
  设施：XXXXXXXX（水/电/灌溉等）

二、出租条件
  1. 租金：XX元/年/个
  2. 租期：XX年
  3. 押金：XX元

三、适合种植
  XXXXXXXX

四、联系方式
  联系人：XXX
  电话：XXXXXXXXXXX
  地址：XXXXXXXX

有意者请联系洽谈，先到先得！

XXXXXXXX
XXXX年XX月XX日`;
  }

  if (name === '工程开通宣传稿') {
    return `工程开通宣传稿

XXXXXXXX工程正式开通

经过XX个月的紧张施工，XXXXXXXX工程将于XXXX年XX月XX日正式开通运行：

一、工程概况
  工程名称：XXXXXXXX
  建设地点：XXXXXXXX
  投资规模：XXXXXXXX
  建设周期：XXXX年XX月至XXXX年XX月

二、工程意义
该工程的建成将：
  1. XXXXXXXX
  2. XXXXXXXX
  3. XXXXXXXX

三、开通时间：XXXX年XX月XX日XX时

四、开通地点：XXXXXXXX

五、参加单位
  1. XXXXXXXX
  2. XXXXXXXX

六、欢迎广大市民前来参观！

XXXXXXXX单位
XXXX年XX月XX日`;
  }

  if (name === '电影项目宣传稿') {
    return `电影项目宣传稿

电影《XXXXXXXX》项目启动

由XXXXXXXX公司出品的电影《XXXXXXXX》项目正式启动：

一、影片信息
  片名：《XXXXXXXX》
  类型：XXXXXXXX（剧情/喜剧/动作等）
  时长：约XX分钟
  拍摄地点：XXXXXXXX

二、主创团队
  导演：XXX
  编剧：XXX
  主演：XXX、XXX

三、剧情简介
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

四、拍摄计划
  开机时间：XXXX年XX月XX日
  杀青时间：XXXX年XX月XX日
  预计上映：XXXX年XX月

五、投资合作
欢迎有意向的投资方、赞助商洽谈合作。
  联系人：XXX
  电话：XXXXXXXXXXX
  邮箱：XXXX@XXXX.com

敬请期待！

XXXXXXXX公司
XXXX年XX月XX日`;
  }

  // 默认兜底
  return `${companyName}

宣传稿

鉴于XXXXXXXX在XXXXXXXX中的出色表现，特此予以宣传。

希望继续保持优良作风，再创佳绩！

${companyName}
XXXX年XX月XX日`;
}

module.exports = { categories, generateContent, getTotalCount };
