/**
 * 债权债务 - 分类配置
 * 4大一级分类，generateContent 根据模板类型生成对应报纸内容
 */

const categories = [
  {
    id: 1, name: '债权债务综合清算', color: '#5B6FE8',
    desc: '债权债务清理公告', hot: true,
    docs: [
      { name: '债权债务清理公告', sub: '综合清算' },
      { name: '债权债务公告', sub: '综合清算' },
    ]
  },
  {
    id: 2, name: '债权转让公告催收', color: '#5B6FE8',
    desc: '纯转让 · 转让+催收 · 通知送达 · 应收账款', hot: true,
    docs: [
      // 2-1 纯债权转让
      { name: '债权转让公告', sub: '纯债权转让' },
      { name: '债权转让公告（详细版）', sub: '纯债权转让' },
      // 2-2 转让+催收合并
      { name: '债权转让及催收公告', sub: '转让+催收合并' },
      { name: '债权转让暨催告公告', sub: '转让+催收合并' },
      { name: '债权转让暨债务催收联合公告', sub: '转让+催收合并' },
      { name: '债权转让暨债务催收通知书', sub: '转让+催收合并' },
      // 2-3 债权转让通知书
      { name: '债权转让通知', sub: '债权转让通知' },
      { name: '债权转让通知书', sub: '债权转让通知' },
      { name: '债权转让通知书（详细版）', sub: '债权转让通知' },
      // 2-4 专项债权转让
      { name: '应收账款转让公告', sub: '应收账款转让' },
    ]
  },
  {
    id: 3, name: '贷款违约公告', color: '#5B6FE8',
    desc: '违约贷款公告', hot: false,
    docs: [
      { name: '违约贷款公告', sub: '贷款违约' },
    ]
  },
  {
    id: 4, name: '金融保险债权解除', color: '#5B6FE8',
    desc: '投保人解除保险合同', hot: false,
    docs: [
      { name: '投保人解除保险合同', sub: '金融保险解除' },
    ]
  }
];

/**
 * 根据模板名称生成报纸内容
 */
function generateContent(params) {
  const { name = '' } = params;
  const companyName = params.companyName || 'XXXX有限公司';
  const _personName = params.personName || 'XXX';
  const _date = params.date || 'XXXX年XX月XX日';

  // ========== 1. 债权债务综合清算 ==========
  if (name === '债权债务清理公告') {
    return `${companyName}（统一社会信用代码：XXXXXXXX）因经营调整/停业清算，现依法对公司债权债务进行全面清理。请公司各债权人于本公告见报之日起六十日内持债权凭证到本公司清算组（联系人：XXX，电话：XXXX-XXXXXXXX）申报债权，逾期未申报者按《中华人民共和国公司法》相关规定处理。请各债务人自公告之日起十五日内清偿全部欠款，逾期本公司将依法采取法律手段催收。\n\n清算组地址：XXXX\n${companyName}清算组\nXXXX年XX月XX日`;
  }
  if (name === '债权债务公告') {
    return `${companyName}（统一社会信用代码：XXXXXXXX）现依法进行债权债务公告。请债权人于见报之日起六十日内、债务人于十五日内到本公司办理相关手续，逾期后果自负。联系电话：XXXX-XXXXXXXX。\n\n${companyName}\nXXXX年XX月XX日`;
  }

  // ========== 2. 债权转让类公告 ==========
  if (name === '债权转让公告') {
    return `${companyName}（统一社会信用代码：XXXXXXXX）依法将本公司对以下债务人享有的债权转让给受让方XXX（身份证号/注册号：XXXXXXXX），现公告通知各债务人：债务人XXX尚欠本公司款项人民币【】元（大写：【】），请债务人立即向债权受让方履行还款义务。\n\n联系人：XXX，电话：XXXX-XXXXXXXX。\n\n${companyName}\nXXXX年XX月XX日`;
  }
  if (name === '债权转让公告（详细版）') {
    return `${companyName}（统一社会信用代码：XXXXXXXX）\n\n一、债权转让标的\n本公司依法将以下债权转让给受让方XXX（身份证号/注册号：XXXXXXXXXXXXXX）：\n1. 债务人：XXX（身份证号：XXXXXXXXXXXXXX）\n2. 债权本金：人民币【】元\n3. 债权产生时间：XXXX年XX月XX日\n4. 原合同/协议编号：XXXXXXXX\n\n二、转让条件\n债权转让对价为人民币【】元，双方已于XXXX年XX月XX日签订《债权转让协议》。\n\n三、催告事项\n请上述债务人自本公告见报之日起十五日内向债权受让方XXX（联系人：XXX，电话：XXXX-XXXXXXXX）履行全部债务，逾期受让方将依法追究债务人法律责任。\n\n${companyName}\nXXXX年XX月XX日`;
  }
  if (name === '债权转让及催收公告') {
    return `${companyName}（统一社会信用代码：XXXXXXXX）将本公司对XXX（身份证号：XXXXXXXXXXXXXX）享有的债权依法转让给XXX（身份证号/注册号：XXXXXXXXXXXXXX）。现公告通知债务人XXX，限其自本公告见报之日起十五日内向债权受让方履行全部还款义务，包括本金人民币【】元及相应利息。逾期未清偿的，受让方将依法启动诉讼程序。\n\n转让人联系人：XXX，电话：XXXX-XXXXXXXX\n受让人联系人：XXX，电话：XXXX-XXXXXXXX\n\n${companyName}\nXXXX年XX月XX日`;
  }
  if (name === '债权转让暨催告公告') {
    return `${companyName}（统一社会信用代码：XXXXXXXX）\n\n本公司依法将以下债权转让给受让方XXX（身份证号/注册号：XXXXXXXXXXXXXX），并就原债务一并催告：\n债务人：XXX（身份证号：XXXXXXXXXXXXXX）\n原欠款金额：人民币【】元\n利息计算至：XXXX年XX月XX日\n\n请债务人自本公告见报之日起十五日内向债权受让方XXX（联系电话：XXXX-XXXXXXXX）清偿全部债务，逾期依法追究。\n\n${companyName}\nXXXX年XX月XX日`;
  }
  if (name === '债权转让暨债务催收联合公告') {
    return `${companyName}（统一社会信用代码：XXXXXXXX）\n\n关于XXX（身份证号：XXXXXXXXXXXXXX）债权债务联合公告\n\n一、债权转让通知\n本公告通知人依法将本方对债务人XXX享有的债权（本金人民币【】元及利息）转让给XXX（身份证号/注册号：XXXXXXXXXXXXXX）。原债权人已书面确认债权真实有效，转让行为合法有效。\n\n二、债务催收通知\n鉴于债务人XXX未在约定期限内履行还款义务，现再次公告催收，限其自本公告见报之日起十五日内清偿全部欠款，否则受让方将依法采取诉讼或其他法律手段追究其违约责任。\n\n联系人：XXX，电话：XXXX-XXXXXXXX\n\n${companyName}（转让人）\nXXX（受让人）\nXXXX年XX月XX日`;
  }
  if (name === '债权转让暨债务催收通知书') {
    return `债权转让暨债务催收通知书\n\n债务人XXX（身份证号：XXXXXXXXXXXXXX）：\n\n一、债权转让通知\n本函通知你：本公司（转让人：${companyName}）已将对你享有的债权（本金人民币【】元及利息，详见附件）依法转让给受让人XXX（身份证号/注册号：XXXXXXXXXXXXXX）。自本通知到达你方之日起，你方应向受让人XXX履行全部还款义务。\n\n二、债务催收\n你方在原《借款/货款/服务合同》（编号：XXXXXXXX）约定的还款期限已届满，至今未清偿欠款。现正式催告，限你方自收到本通知书之日起七日内向受让人XXX（联系人：XXX，电话：XXXX-XXXXXXXX）一次性清偿全部欠款本息。逾期受让人将依法启动诉讼程序，届时你方除偿还本金及利息外，还须承担诉讼费、律师费及一切相关费用。\n\n转让人：${companyName}\n受让人：XXX\nXXXX年XX月XX日`;
  }
  if (name === '债权转让通知') {
    return `债权转让通知\n\nXXX（身份证号：XXXXXXXXXXXXXX）：\n\n本公司（${companyName}）与你方于XXXX年XX月XX日签订【合同名称】（编号：XXXXXXXX），你方尚欠本公司款项人民币【】元。现本公司依法将该债权转让给XXX（身份证号/注册号：XXXXXXXXXXXXXX），请债务人自收到本通知之日起直接向债权受让方XXX（联系人：XXX，电话：XXXX-XXXXXXXX）履行还款义务。\n\n${companyName}\nXXXX年XX月XX日`;
  }
  if (name === '债权转让通知书') {
    return `债权转让通知书\n\n致：XXX（身份证号：XXXXXXXXXXXXXX）\n\n通知人：${companyName}（统一社会信用代码：XXXXXXXX）\n\n根据《中华人民共和国民法典》第五百四十五条及相关规定，本公司已将对你方享有的全部债权（人民币【】元及相应利息）依法转让给XXX（身份证号/注册号：XXXXXXXXXXXXXX）。自本通知书送达之日起，你方应直接向受让人XXX履行债务。\n\n受让人信息：\n姓名/名称：XXX\n联系方式：XXXX-XXXXXXXX\n收款账户：XXXXXXXX\n\n${companyName}\nXXXX年XX月XX日`;
  }
  if (name === '债权转让通知书（详细版）') {
    return `债权转让通知书\n\n编号：（XXXX）债转字第XX号\n\n债务人：XXX（身份证号：XXXXXXXXXXXXXX）\n原债权人：${companyName}（统一社会信用代码：XXXXXXXX）\n债权受让人：XXX（身份证号/注册号：XXXXXXXXXXXXXX）\n\n一、债权基本信息\n1. 原合同/协议名称：【】\n2. 合同编号：XXXXXXXX\n3. 签订日期：XXXX年XX月XX日\n4. 原约定还款日期：XXXX年XX月XX日\n5. 欠款本金：人民币【】元\n6. 欠款利息（截至XXXX年XX月XX日）：人民币【】元\n7. 欠款合计：人民币【】元\n\n二、债权转让声明\n本债权人郑重声明，上述债权真实、合法、有效，不存在任何权利瑕疵。本债权人已依法将上述全部债权转让给受让人XXX，转让行为已生效。\n\n三、债务人须知\n1. 请债务人自收到本通知书之日起，直接向受让人XXX履行上述全部债务清偿义务\n2. 付款时请注明"归还（${companyName}）债权转让款（编号：XXXXXXXX）"\n3. 如有任何疑问，请联系原债权人：XXX，电话：XXXX-XXXXXXXX\n\n四、法律后果提示\n根据《中华人民共和国民法典》第五百四十六条之规定，债务人接到债权转让通知后，债务人对债权人的抗辩可以向受让人主张。请债务人依法妥善处理。\n\n原债权人：${companyName}（公章）\n授权代表：XXX\nXXXX年XX月XX日`;
  }
  if (name === '应收账款转让公告') {
    return `${companyName}（统一社会信用代码：XXXXXXXX）\n\n关于应收账款转让登记公告\n\n根据《中华人民共和国民法典》及相关法律法规，本公司依法将以下应收账款（AR）进行转让登记：\n\n一、应收账款信息\n1. 应收账款编号：XXXXXXXX\n2. 债务人名称：XXX（统一社会信用代码/身份证号：XXXXXXXXXXXXXX）\n3. 原始应收账款金额：人民币【】元\n4. 应收账款到期日：XXXX年XX月XX日\n5. 合同/协议编号：XXXXXXXX\n\n二、受让方信息\n受让人名称：XXX（统一社会信用代码/身份证号：XXXXXXXXXXXXXX）\n联系人：XXX，电话：XXXX-XXXXXXXX\n\n三、公告目的\n请上述债务人自本公告见报之日起直接向应收账款受让方履行付款义务。如债务人已向原债权人（转让人）清偿全部或部分账款，请及时向受让人出示还款凭证。\n\n本公告同时在"中征应收账款融资服务平台"进行应收账款转让登记，登记证明编号：XXXXXXXX。\n\n${companyName}\nXXXX年XX月XX日`;
  }

  // ========== 3. 贷款违约类 ==========
  if (name === '违约贷款公告') {
    return '违约贷款公告\n\n借款人XXX（身份证号：XXXXXXXXXXXXXX）于XXXX年XX月XX日与本行/本公司签订《贷款合同》（合同编号：XXXXXXXX），贷款本金人民币【】元，约定还款方式为XXXX，贷款到期日为XXXX年XX月XX日。该借款人自XXXX年XX月XX日起未能依约履行还款义务，截至XXXX年XX月XX日尚欠本金人民币【】元、利息人民币【】元。\n\n本行/本公司现依法向借款人XXX公告催收，限其自本公告见报之日起十五日内清偿全部欠款本息。逾期本行/本公司将依法采取诉讼、申请强制执行等措施追究其违约责任，由此产生的一切法律后果由借款人承担。\n\n贷款机构：XXX\n联系电话：XXXX-XXXXXXXX\nXXXX年XX月XX日';
  }

  // ========== 4. 金融保险债权解除 ==========
  if (name === '投保人解除保险合同') {
    return '声明人XXX（身份证号：XXXXXXXXXXXXXX）\n\n本人于XXXX年XX月XX日在XXX保险公司（保险公司统一社会信用代码：XXXXXXXX）投保了XXX保险（保单号：XXXXXXXXXXXXXX），保险期间自XXXX年XX月XX日起至XXXX年XX月XX日止。\n\n现本人依据《中华人民共和国保险法》第十五条之规定，自愿解除上述保险合同。声明自XXXX年XX月XX日起，上述保单下本人与保险公司的保险合同关系终止，双方权利义务即行终结。\n\n声明人：XXX\nXXXX年XX月XX日';
  }

  // 默认兜底
  return '公告\n\nXXX（身份证号/注册号：XXXXXXXXXXXXXX）就XXX事项依法公告如下：XXX（具体内容）。如对此公告有异议，请在见报之日起三十日内向有关部门提出，逾期视为无异议。\n\n联系电话：XXXX-XXXXXXXX\nXXXX年XX月XX日';
}

module.exports = { categories, generateContent };
