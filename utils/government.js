/**
 * 政府送达 - 分类配置
 * 4大一级分类，与后端对齐
 */

const categories = [
  {
    id: 1, name: '检察司法类公告', color: '#722ED1',
    desc: '人民检察院公告', hot: false,
    docs: [
      { name: '人民检察院公告' },
    ]
  },
  {
    id: 2, name: '劳动仲裁送达公告', color: '#5B6FE8',
    desc: '劳动仲裁、人事仲裁送达', hot: true,
    docs: [
      { name: '劳动仲裁公告' },
      { name: '劳动人事仲裁委员会公告' },
      { name: '仲裁委员会公告函' },
    ]
  },
  {
    id: 3, name: '规划行政许可公示', color: '#0FCB7D',
    desc: '规划设计条件变更公示', hot: false,
    docs: [
      { name: '规划设计条件变更公示' },
    ]
  },
  {
    id: 4, name: '公证遗嘱类公告', color: '#FA8E17',
    desc: '遗嘱公告', hot: false,
    docs: [
      { name: '遗嘱公告' },
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
  const companyName = 'XXXX单位';
  const personName = 'XXX';
  const court = 'XX市XX区人民检察院';

  // 1. 检察司法类
  if (name === '人民检察院公告') {
    return `${court}\n\n本院依法对XXX（身份证号：XXXXXXXXXXXXXX）涉嫌XXX罪一案进行审查。现根据《中华人民共和国刑事诉讼法》相关规定，依法公告通知相关当事人。本案涉及XXX事项，如有知情者请及时与本院联系。\n\n联系电话：XXXX-XXXXXXXX\nXXXX年XX月XX日`;
  }

  // 2. 行政处罚全套送达催告
  if (name === '行政处罚事先告知书送达公告') {
    return 'XX市XX局\n\n当事人XXX（身份证号：XXXXXXXXXXXXXX）：你（单位）涉嫌【违法行为】，本局依据《中华人民共和国行政处罚法》第四十四条之规定，拟对你作出行政处罚决定。现依法向你送达《行政处罚事先告知书》（X市监罚告字〔XXXX〕XX号）。你依法享有陈述和申辩的权利，请自收到本告知书之日起五个工作日内向本局提出陈述和申辩，逾期视为放弃。\n\n地址：XXXX，联系电话：XXXX-XXXXXXXX';
  }
  if (name === '听证告知书送达公告') {
    return 'XX市XX局\n\n当事人XXX（身份证号：XXXXXXXXXXXXXX）：本局拟对你作出【听证适用行政处罚种类】，根据《中华人民共和国行政处罚法》第六十三条、第六十四条规定，你有权要求听证。现依法向你送达《听证告知书》。请自收到本告知书之日起五个工作日内向本局书面申请听证，逾期视为放弃听证权利。\n\n地址：XXXX，联系电话：XXXX-XXXXXXXX';
  }
  if (name === '撤销行政许可听证告知书送达公告') {
    return 'XX市XX局\n\n当事人XXX（身份证号：XXXXXXXXXXXXXX）：你单位持有的【许可证名称】（许可证号：XXXXXXXXXXXXXX）经查存在XXX情形，本局依据《中华人民共和国行政许可法》第六十九条规定，拟作出撤销行政许可的处罚决定。现依法向你送达《撤销行政许可听证告知书》。你有权在五个工作日内申请听证，逾期视为放弃。\n\n地址：XXXX，联系电话：XXXX-XXXXXXXX';
  }
  if (name === '行政处罚决定书送达公告') {
    return 'XX市XX局\n\n当事人XXX（身份证号：XXXXXXXXXXXXXX）：本局已于XXXX年XX月XX日依法作出《行政处罚决定书》（X市监罚决字〔XXXX〕XX号），决定对你（单位）处以罚款人民币【】元。因无法直接送达，现依法公告送达上述处罚决定书。自本公告见报之日起六十日视为送达。如不服本决定，可在收到决定书之日起六十日内向XX市人民政府申请行政复议，或六个月内向XX市XX区人民法院提起行政诉讼。\n\nXX市XX局\nXXXX年XX月XX日';
  }
  if (name === '履行行政处罚决定催告书送达公告') {
    return 'XX市XX局\n\n当事人XXX（身份证号：XXXXXXXXXXXXXX）：本局于XXXX年XX月XX日对你作出了《行政处罚决定书》（X市监罚决字〔XXXX〕XX号），你未在规定期限内履行该决定所确定的义务。现依据《中华人民共和国行政强制法》第五十四条规定，向你发出履行催告。请自收到本催告书之日起十个工作日内到本局（地址：XXXX）缴纳罚款及加处罚款，逾期不履行的，本局将依法申请人民法院强制执行。\n\n联系电话：XXXX-XXXXXXXX';
  }
  if (name === '行政处罚决定履行催告书送达公告') {
    return 'XX市XX局\n\n当事人XXX（身份证号：XXXXXXXXXXXXXX）：你在规定期限内未履行本局《行政处罚决定书》（X市监罚决字〔XXXX〕XX号）所确定的罚款义务，现依法向你发出催告。限你自收到本催告书之日起十个工作日内履行缴纳义务，逾期本局将依法申请人民法院强制执行，并可能依法采取查封、扣押等强制措施，由此产生的一切费用由你承担。\n\nXX市XX局\n联系电话：XXXX-XXXXXXXX';
  }
  if (name === '行政处罚罚款催告书送达公告') {
    return 'XX市XX局\n\n当事人XXX（身份证号：XXXXXXXXXXXXXX）：你尚未履行本局《行政处罚决定书》（X市监罚决字〔XXXX〕XX号）确定的罚款人民币【】元。本局现依法向你发出催告，限你自收到本催告书之日起七日内到指定银行（户名：XXXX，账号：XXXXXXXX）缴纳罚款，或到本局（地址：XXXX）办理缴纳手续。逾期仍未履行的，本局将依法申请强制执行，并按日加处百分之三的罚款。\n\n联系电话：XXXX-XXXXXXXX';
  }

  // 3. 劳动仲裁送达公告
  if (name === '劳动仲裁公告') {
    return 'XX市劳动人事争议仲裁委员会\n\n被申请人XXX（身份证号：XXXXXXXXXXXXXX）：本委已受理XXX（申请人）诉你方劳动争议一案（案号：XXXX劳人仲字第XX号），案由：XXX。现依法向你方送达仲裁申请书副本及相关证据材料。自本公告见报之日起六十日视为送达。届时请准时到本委（地址：XXXX）参加庭审，如无正当理由拒不到庭，本委将依法缺席裁决。\n\n联系电话：XXXX-XXXXXXXX';
  }
  if (name === '劳动人事仲裁委员会公告') {
    return 'XX市劳动人事争议仲裁委员会\n\nXXX（身份证号：XXXXXXXXXXXXXX）：本委已受理XXX与你就XXX（案由）争议一案（案号：XXXX劳人仲字第XX号）。本委依法向你送达仲裁文书及开庭通知，请于XX日XX时到本委（地址：XXXX）参加庭审。逾期不到庭不影响案件审理。\n\n联系电话：XXXX-XXXXXXXX';
  }
  if (name === '仲裁委员会公告函') {
    return 'XX仲裁委员会\n\nXXX（身份证号/注册号：XXXXXXXXXXXXXX）：本会已受理XXX与你就XXX争议一案（XXXXXX字第XX号）。现依法向你送达仲裁规则、仲裁员名册及仲裁通知书，请你方自收到本公告之日起十五日内选定仲裁员并提交答辩材料，逾期由本会主任指定。\n\n地址：XXXX，联系电话：XXXX-XXXXXXXX';
  }

  // 4. 规划行政许可公示
  if (name === '规划设计条件变更公示') {
    return 'XX市自然资源局\n\n依据《中华人民共和国城乡规划法》及《XX市城市规划管理技术规定》，现对以下地块规划设计条件变更进行公示：\n地块编号：XXX\n位置：XX市XX区XX路XX号\n原规划条件：XXX\n变更后规划条件：XXX\n\n相关利益人如有异议，请在公示之日起十五日内持有效身份证明及权属证明文件向本局提出书面意见。逾期未提出的，视为无异议。\n\n公示期：XXXX年XX月XX日至XXXX年XX月XX日\n联系电话：XXXX-XXXXXXXX';
  }

  // 5. 公证遗嘱类
  if (name === '遗嘱公告') {
    return 'XX公证处\n\n立遗嘱人XXX（身份证号：XXXXXXXXXXXXXX）于XXXX年XX月XX日在本处订立公证遗嘱一份（遗嘱编号：XXXX），主要内容为：XXX（遗嘱概要，如房产、存款等财产分配意向）。现依法进行公告，如任何单位或个人对该遗嘱有异议，请在见报之日起三十日内向本处书面提出，逾期本处将依法出具遗嘱公证书。\n\nXX公证处\n地址：XXXX\n联系电话：XXXX-XXXXXXXX';
  }

  // 默认兜底
  return '公告\n\nXXX（身份证号/注册号：XXXXXXXXXXXXXX）就XXX事项依法公告如下：XXX（具体内容）。如对此公告有异议，请在见报之日起三十日内向有关部门提出，逾期视为无异议。\n\n联系电话：XXXX-XXXXXXXX\nXXXX年XX月XX日';
}

module.exports = { categories, generateContent, getTotalCount };
