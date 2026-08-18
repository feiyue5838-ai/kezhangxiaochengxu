/**
 * 法院公告 - 分类配置
 * 9大一级分类，generateContent 根据模板类型生成对应报纸内容
 */

const categories = [
  {
    id: 1, name: '债权债务与催收', color: '#5B6FE8',
    desc: '债权转让、欠款催告', hot: true,
    docs: [
      { name: '债权转让公告', sub: '债权转让类' },
      { name: '债权转让暨催收公告', sub: '债权转让类' },
      { name: '催告函', sub: '欠款催告类' },
      { name: '催促还款公告', sub: '欠款催告类' },
    ]
  },
  {
    id: 2, name: '破产与清算', color: '#5B6FE8',
    desc: '破产公告、重整招募、债权核查', hot: true,
    docs: [
      { name: '法院破产公告', sub: '破产基础公告' },
      { name: '破产财产分配公告', sub: '破产基础公告' },
      { name: '重整投资人招募公告', sub: '企业重整公告' },
      { name: '债权核查公示', sub: '债权核查与清算交接' },
      { name: '清算组移交公告', sub: '债权核查与清算交接' },
      { name: '合并破产案债权人会议公告', sub: '债权核查与清算交接' },
    ]
  },
  {
    id: 3, name: '仲裁与送达', color: '#5B6FE8',
    desc: '仲裁文书、开庭传票、送达公告', hot: true,
    docs: [
      { name: '仲裁文书送达公告', sub: '仲裁纠纷送达' },
      { name: '民间借贷仲裁送达公告', sub: '仲裁纠纷送达' },
      { name: '劳动仲裁送达公告', sub: '仲裁纠纷送达' },
      { name: '合同纠纷仲裁送达公告', sub: '仲裁纠纷送达' },
      { name: '开庭传票公告', sub: '仲裁全套配套' },
      { name: '仲裁公告', sub: '仲裁全套配套' },
    ]
  },
  {
    id: 4, name: '行政处罚送达', color: '#5B6FE8',
    desc: '人社、税务、消防、卫生行政处罚', hot: false,
    docs: [
      { name: '行政处罚事先告知书送达公告', sub: '行政处罚告知类' },
      { name: '行政处罚决定书送达公告', sub: '行政处罚决定类' },
      { name: '行政处罚决定催告书', sub: '行政处罚催告类' },
      { name: '行政处罚听证告知书送达公告', sub: '行政处罚听证类' },
      { name: '安全生产教育行政处罚决定送达公告', sub: '行业专项执法' },
      { name: '火灾事故认定送达公告', sub: '行业专项执法' },
      { name: '卫生健康行政处罚决定书送达公告', sub: '行业专项执法' },
      { name: '行政处罚强制执行前催告书', sub: '行政强制执行催告' },
    ]
  },
  {
    id: 5, name: '民事诉讼纠纷', color: '#5B6FE8',
    desc: '合同、劳务、借贷、物权纠纷诉讼', hot: true,
    docs: [
      { name: '买卖合同纠纷诉讼', sub: '合同纠纷' },
      { name: '劳务合同纠纷诉讼', sub: '合同纠纷' },
      { name: '金融借款合同纠纷诉讼', sub: '合同纠纷' },
      { name: '建设工程合同纠纷诉讼', sub: '合同纠纷' },
      { name: '物业服务合同纠纷诉讼', sub: '合同纠纷' },
      { name: '装饰装修合同纠纷诉讼', sub: '合同纠纷' },
      { name: '教育培训合同纠纷诉讼', sub: '合同纠纷' },
      { name: '保险人代位求偿权纠纷诉讼', sub: '合同纠纷' },
      { name: '保险合同解除声明', sub: '合同纠纷' },
      { name: '债权人代位权纠纷诉讼', sub: '债权票据纠纷' },
      { name: '票据追索权纠纷诉讼', sub: '债权票据纠纷' },
      { name: '追偿权纠纷诉讼', sub: '债权票据纠纷' },
      { name: '离婚纠纷诉讼', sub: '婚姻家庭' },
      { name: '抚养费纠纷诉讼', sub: '婚姻家庭' },
      { name: '机动车交通事故责任纠纷诉讼', sub: '侵权纠纷' },
      { name: '财产纠纷诉讼', sub: '物权权属' },
      { name: '占有物返还纠纷诉讼', sub: '物权权属' },
      { name: '变更登记纠纷公告', sub: '登记变更' },
    ]
  },
  {
    id: 6, name: '司法拍卖与资产处置', color: '#5B6FE8',
    desc: '房产、车辆、资产拍卖认领', hot: false,
    docs: [
      { name: '司法拍卖公告', sub: '不动产资产拍卖' },
      { name: '资产处置公告', sub: '不动产资产拍卖' },
      { name: '车辆拍卖公告', sub: '车辆拍卖认领' },
      { name: '无主车认领公告', sub: '车辆拍卖认领' },
      { name: '非法改装运油车辆扣押认领公告', sub: '车辆拍卖认领' },
    ]
  },
  {
    id: 7, name: '补偿提存与领取', color: '#5B6FE8',
    desc: '补偿款、提存款、集体资产领取', hot: false,
    docs: [
      { name: '领取丧葬费和抚恤金通知', sub: '补偿款领取' },
      { name: '领取房屋补偿款通知书', sub: '补偿款领取' },
      { name: '领取提存款公告', sub: '提存类公告' },
      { name: '提存公告', sub: '提存类公告' },
      { name: '集体资产处置社员登记公告', sub: '集体资产处置' },
    ]
  },
  {
    id: 8, name: '寻人协查与司法文书', color: '#5B6FE8',
    desc: '寻亲、协查通报、宣告死亡', hot: false,
    docs: [
      { name: '寻找目击证人及死者家属启示', sub: '协查寻找' },
      { name: '找死者家属协查通报公告', sub: '协查寻找' },
      { name: '寻亲公告', sub: '寻亲寻人' },
      { name: '宣告死亡公告', sub: '宣告死亡' },
      { name: '申请死亡公告', sub: '宣告死亡' },
      { name: '遗赠公证公告', sub: '公证文书' },
      { name: '图书更名声明', sub: '著作更名' },
    ]
  },
  {
    id: 9, name: '行政监管与企业公告', color: '#5B6FE8',
    desc: '海关、人防、股权、律师声明', hot: false,
    docs: [
      { name: '海关走私货物认领公告', sub: '海关查扣财物' },
      { name: '人防工程易地建设费催缴公告', sub: '人防规费催缴' },
      { name: '注销非法户口公告', sub: '户籍注销' },
      { name: '损害社会公共利益公告', sub: '公共利益声明' },
      { name: '经营证券期货业务许可证遗失公告', sub: '金融许可遗失' },
      { name: '召开股东大会公告', sub: '股东会召集' },
      { name: '律师授权声明', sub: '律师授权' },
      { name: '放弃公司股份公告', sub: '股权变更' },
      { name: '房屋征收强制执行事先催告书送达公告', sub: '房屋征收强制执行' },
      { name: '涉案财物处理公告', sub: '司法涉案财物' },
      { name: '骨灰存放公告', sub: '殡葬' },
      { name: '户口迁移公告', sub: '户籍迁移' },
    ]
  }
];

/**
 * 根据模板名称生成报纸内容
 * params: { type, name, companyName, personName, court, caseNo, amount, date, content, reason }
 */
function generateContent(params) {
  const { name = '' } = params;
  const companyName = params.companyName || 'XXXX有限公司';
  const _personName = params.personName || 'XXX';
  const court = params.court || 'XX市XX区人民法院';
  const _caseNo = params.caseNo || '（XXXX）XX民初XXX号';
  const _amount = params.amount || 'XXXXX';
  const _date = params.date || 'XXXX年XX月XX日';

  // 1. 债权债务与催收
  if (name === '债权转让公告') {
    return `${companyName}（统一社会信用代码：XXXXXXXX）依法将本公司对以下债务人享有的债权依法转让给受让方，现公告通知各债务人：债务人XXX尚欠本公司款项人民币【】元，请债务人立即向债权受让方履行还款义务。联系人：XXX，电话：XXXX-XXXXXXXX。`;
  }
  if (name === '债权转让暨催收公告') {
    return `${companyName}依法将本公司对债务人XXX享有的债权转让给受让方XXX（身份证号：XXXXXXXXXXXXXX）。现公告通知债务人XXX，限其自公告之日起十五日内向债权受让方履行全部还款义务，逾期依法追究。联系人：XXX，电话：XXXX-XXXXXXXX。`;
  }
  if (name === '催告函') {
    return `催 告 函\n\nXXX（身份证号：XXXXXXXXXXXXXX）：\n\n本公司（${companyName}）与你方于XXXX年XX月XX日签订【合同名称】，你方尚欠款项人民币【】元，已逾期XX天。限你方自收到本催告函之日起七日内清偿全部欠款，否则本公司将依法采取法律手段追究你的违约责任。\n\n${companyName}\nXXXX年XX月XX日`;
  }
  if (name === '催促还款公告') {
    return '催促还款公告\n\n借款人XXX（身份证号：XXXXXXXXXXXXXX）于XXXX年XX月XX日向出借人借款人民币【】元，双方约定还款日期为XXXX年XX月XX日。借款到期后借款人未依约还款，出借人依法公告催促，限借款人自本公告见报之日起十五日内归还全部借款本息。逾期将依法追究借款人法律责任。\n\n出借人：XXX\n联系电话：XXXX-XXXXXXXX\nXXXX年XX月XX日';
  }

  // 2. 破产与清算
  if (name === '法院破产公告') {
    return `${court}于XXXX年XX月XX日作出（XXXX）XX破字第XX号民事裁定，受理了${companyName}的破产清算申请。现公告如下：债权人就债权申报事宜请于XXXX年XX月XX日前向管理人（地址：XXXX，联系人：XXX，电话：XXXX-XXXXXXXX）申报债权。第一次债权人会议定于XXXX年XX月XX日XX时在XX地点召开，请准时出席。`;
  }
  if (name === '破产财产分配公告') {
    return `${court}（XXXX）XX破字第XX号案件破产财产分配方案已经债权人会议表决通过，现依法予以公告。管理人将于XXXX年XX月XX日起对已确认债权依法进行分配，请各债权人关注管理人就分配事宜的具体通知。详细分配方案请向管理人索取。`;
  }
  if (name === '重整投资人招募公告') {
    return `${companyName}（统一社会信用代码：XXXXXXXX）因不能清偿到期债务，被${court}受理重整申请。为维护债权人和债务人的合法权益，现公开招募重整投资人。有意者请于XXXX年XX月XX日前向管理人提交重整投资方案及相关资质证明文件。联系人：XXX，电话：XXXX-XXXXXXXX。`;
  }
  if (name === '债权核查公示') {
    return `${court}（XXXX）XX破字第XX号关于${companyName}债权核查公示\n\n现就疑似债权申报情况进行公示，请各债权人对附件所列债权信息进行核实。如有异议，请于XXXX年XX月XX日前向管理人书面提出，逾期视为无异议。详细债权清单请至管理人办公地点查阅。`;
  }
  if (name === '清算组移交公告') {
    return `${court}（XXXX）XX清字第XX号\n\n义务人XXX（身份证号：XXXXXXXXXXXXXX）应向清算组移交公司全部公章证照、财务账册及相关文件，并就公司资产负债情况作出书面说明。限其自公告之日起七日内完成移交，逾期将依法追究相关人员责任。`;
  }
  if (name === '合并破产案债权人会议公告') {
    return `${court}（XXXX）XX破初字第XX号、XX号案件依法裁定合并破产。现定于XXXX年XX月XX日XX时在XX（地址）召开第二次债权人会议，审议合并破产财产分配方案等事项。请各债权人准时出席。联系人：XXX，电话：XXXX-XXXXXXXX。`;
  }

  // 3. 仲裁与送达
  if (name === '仲裁文书送达公告') {
    return `${court}依据《中华人民共和国民事诉讼法》相关规定，现公告送达XXX（身份证号：XXXXXXXXXXXXXX）仲裁文书（案号：XXXX民仲字第XX号）。自本公告见报之日起经过六十日，视为已送达。当事人可联系XX仲裁委员会（电话：XXXX-XXXXXXXX）领取文书。`;
  }
  if (name === '民间借贷仲裁送达公告') {
    return 'XX仲裁委员会（XXXX）民借仲字第XX号\n\n申请人XXX与被申请人XXX因民间借贷纠纷一案，现依法向被申请人送达仲裁申请书副本及证据材料。自本公告见报之日起六十日内被申请人未提出异议或答辩的，本委将依法缺席裁决。联系人：XXX，电话：XXXX-XXXXXXXX。';
  }
  if (name === '劳动仲裁送达公告') {
    return 'XX市劳动人事争议仲裁委员会\n\n被申请人XXX（身份证号：XXXXXXXXXXXXXX）：本委已受理XXX诉你方劳动争议一案（案号：XXXX劳人仲字第XX号），现依法向你方送达仲裁申请书副本及相关证据材料。自公告之日起六十日视为送达。逾期不到庭不影响本委依法裁决。联系电话：XXXX-XXXXXXXX。';
  }
  if (name === '合同纠纷仲裁送达公告') {
    return 'XX仲裁委员会\n\n被申请人XXX：申请人XXX依据双方签订之《合同》（合同编号：XXXXXXXX）中的仲裁条款，就合同纠纷向本委提起仲裁申请（XXXX合同仲字第XX号）。本委依法向你方送达仲裁文书，请于XX日内到本委领取，逾期视为送达。电话：XXXX-XXXXXXXX。';
  }
  if (name === '开庭传票公告') {
    return `${court}\n\n案号：（XXXX）XX民初XXX号\n\n原告XXX诉被告XXX【案由】一案，定于XXXX年XX月XX日XX时在XX法庭开庭审理。请当事人准时到庭，无正当理由拒不到庭的，将依法缺席审判。`;
  }
  if (name === '仲裁公告') {
    return 'XX仲裁委员会公告\n\nXXX（身份证号/注册号：XXXXXXXXXXXXXX）：本会已受理XXX与你就XXX争议一案的仲裁申请（XXXXXX字第XX号）。现依法向你送达仲裁规则及仲裁员名册，请你方自收到本公告之日起十五日内选定仲裁员，逾期由本会主任指定。联系电话：XXXX-XXXXXXXX。';
  }

  // 4. 行政处罚送达
  if (name === '行政处罚事先告知书送达公告') {
    return 'XX市XX局\n\n当事人XXX（身份证号：XXXXXXXXXXXXXX）：你（单位）涉嫌【违法行为】，本局依据《中华人民共和国行政处罚法》第XX条之规定，拟对你作出行政处罚决定。因无法直接送达，现依法公告送达《行政处罚事先告知书》（X市监罚告字〔XXXX〕XX号）。你依法享有陈述和申辩的权利，请自本公告见报之日起六十日内到本局（地址：XXXX）行使权利，逾期视为放弃。';
  }
  if (name === '行政处罚决定书送达公告') {
    return 'XX市XX局\n\n当事人XXX（身份证号：XXXXXXXXXXXXXX）：本局已于XXXX年XX月XX日依法作出《行政处罚决定书》（X市监罚决字〔XXXX〕XX号），决定对你（单位）处以罚款人民币【】元。因无法直接送达，现依法公告送达上述处罚决定书。自本公告见报之日起六十日视为送达。如不服本决定，可在收到决定书之日起六十日内向XX市人民政府申请行政复议，或六个月内向XX市XX区人民法院提起行政诉讼。';
  }
  if (name === '行政处罚决定催告书') {
    return 'XX市XX局\n\n当事人XXX：你在规定期限内未履行本局于XXXX年XX月XX日作出的《行政处罚决定书》（X市监罚决字〔XXXX〕XX号）所确定的罚款义务，现依法向你发出催告。自收到本催告书之日起十日内仍未履行义务的，本局将依法申请人民法院强制执行。联系电话：XXXX-XXXXXXXX。';
  }
  if (name === '行政处罚听证告知书送达公告') {
    return 'XX市XX局\n\n当事人XXX（身份证号：XXXXXXXXXXXXXX）：本局拟对你作出【行政处罚种类】，根据《中华人民共和国行政处罚法》第六十三条、第六十四条规定，你有权要求听证。请自本公告见报之日起五日内向本局书面申请听证，逾期视为放弃听证权利。地址：XXXX，联系电话：XXXX-XXXXXXXX。';
  }
  if (name === '安全生产教育行政处罚决定送达公告') {
    return 'XX市应急管理局\n\n当事人XXX（身份证号：XXXXXXXXXXXXXX）：你单位因违反《中华人民共和国安全生产法》第XX条规定，本局依法作出《行政处罚决定书》（X应急罚决字〔XXXX〕XX号），对你单位处以罚款人民币【】元，对主要负责人XXX处以罚款人民币【】元。现依法公告送达，如不服本决定可申请行政复议或提起行政诉讼。';
  }
  if (name === '火灾事故认定送达公告') {
    return 'XX市XX区消防救援大队\n\n当事人XXX（身份证号：XXXXXXXXXXXXXX）：本大队对XXXX年XX月XX日XX地点火灾事故作出《火灾事故认定书》（X消火认字〔XXXX〕第XX号），认定起火原因为XXX。现依法向你送达该认定书，自本公告见报之日起六十日视为送达。当事人对认定有异议的，可在收到之日起十五日内向XX市消防救援支队提出书面复核申请。';
  }
  if (name === '卫生健康行政处罚决定书送达公告') {
    return 'XX市XX区卫生健康委员会\n\n当事人XXX（身份证号：XXXXXXXXXXXXXX）：你因违反《医疗机构管理条例》第XX条规定，本委依法作出《行政处罚决定书》（X卫医罚字〔XXXX〕XX号），处以罚款人民币【】元。现依法公告送达，限你自收到本公告之日起十五日内缴纳罚款，逾期不缴将申请强制执行，并依法加处罚款。';
  }
  if (name === '行政处罚强制执行前催告书') {
    return 'XX县XX局\n\n当事人XXX：依据XXXX人民法院（XXXX）XX行执XX号《行政裁定书》，本局依法向你催告履行以下义务：【义务内容】。请自收到本催告书之日起十日内履行，逾期不履行的，本局将依法申请人民法院强制执行，由此产生的一切费用由你承担。联系电话：XXXX-XXXXXXXX。';
  }

  // 5. 民事诉讼纠纷
  if (name === '买卖合同纠纷诉讼') {
    return `${court}诉原告XXX（身份证号：XXXXXXXXXXXXXX）诉被告XXX（身份证号：XXXXXXXXXXXXXX）买卖合同纠纷一案（案号：（XXXX）XX民初XXX号），本院已依法受理。被告应自收到起诉状副本之日起十五日内提交答辩状。案件依法公开审理。`;
  }
  if (name === '劳务合同纠纷诉讼') {
    return `${court}原告XXX（身份证号：XXXXXXXXXXXXXX）诉被告XXX（身份证号：XXXXXXXXXXXXXX）劳务合同纠纷一案（案号：（XXXX）XX民初XXX号），本院已受理。被告应自收到起诉状副本之日起十五日内提交答辩状，逾期不影响案件审理。`;
  }
  if (name === '金融借款合同纠纷诉讼') {
    return `${court}原告XXX（身份证号：XXXXXXXXXXXXXX）诉被告XXX（身份证号：XXXXXXXXXXXXXX）金融借款合同纠纷一案（案号：（XXXX）XX民初XXX号），被告应偿还原告借款本金人民币【】元及利息。本院已受理，请被告依法应诉。`;
  }
  if (name === '建设工程合同纠纷诉讼') {
    return `${court}原告XXX（身份证号：XXXXXXXXXXXXXX）诉被告XXX（身份证号：XXXXXXXXXXXXXX）建设工程合同纠纷一案（案号：（XXXX）XX民初XXX号），涉及工程款人民币【】元。本院已受理，请当事人依法参加诉讼。`;
  }
  if (name === '物业服务合同纠纷诉讼') {
    return `${court}原告XXX物业管理有限公司诉被告XXX（身份证号：XXXXXXXXXXXXXX）物业服务合同纠纷一案（案号：（XXXX）XX民初XXX号），被告应支付物业费人民币【】元。本院已受理，请被告依法应诉。`;
  }
  if (name === '装饰装修合同纠纷诉讼') {
    return `${court}原告XXX（身份证号：XXXXXXXXXXXXXX）诉被告XXX（身份证号：XXXXXXXXXXXXXX）装饰装修合同纠纷一案（案号：（XXXX）XX民初XXX号），涉及装修款人民币【】元。本院已受理，请当事人依法应诉。`;
  }
  if (name === '教育培训合同纠纷诉讼') {
    return `${court}原告XXX（身份证号：XXXXXXXXXXXXXX）诉被告XXX（身份证号：XXXXXXXXXXXXXX）教育培训合同纠纷一案（案号：（XXXX）XX民初XXX号），涉及培训费人民币【】元。本院已受理，请当事人依法参加诉讼。`;
  }
  if (name === '保险人代位求偿权纠纷诉讼') {
    return `${court}原告XXX保险公司（统一社会信用代码：XXXXXXXX）诉被告XXX（身份证号：XXXXXXXXXXXXXX）保险人代位求偿权纠纷一案（案号：（XXXX）XX民初XXX号），代位求偿金额人民币【】元。本院已受理，请被告依法应诉。`;
  }
  if (name === '保险合同解除声明') {
    return '声明人XXX（身份证号：XXXXXXXXXXXXXX）于XXXX年XX月XX日与XXX保险公司签订的保险合同（保单号：XXXXXXXX），因被保险人XXX违反合同约定，现声明解除该保险合同，双方权利义务终止。\n\n声明人：XXX\nXXXX年XX月XX日';
  }
  if (name === '债权人代位权纠纷诉讼') {
    return `${court}原告XXX（身份证号：XXXXXXXXXXXXXX）诉被告XXX（身份证号：XXXXXXXXXXXXXX）债权人代位权纠纷一案（案号：（XXXX）XX民初XXX号）。原告依法代位行使债务人XXX对被告的债权，金额人民币【】元。本院已受理，请被告依法应诉。`;
  }
  if (name === '票据追索权纠纷诉讼') {
    return `${court}原告XXX（身份证号：XXXXXXXXXXXXXX）诉被告XXX（身份证号：XXXXXXXXXXXXXX）票据追索权纠纷一案（案号：（XXXX）XX民初XXX号）。涉案票据票号：XXXXXXXX，金额人民币【】元。本院已受理，请当事人依法应诉。`;
  }
  if (name === '追偿权纠纷诉讼') {
    return `${court}原告XXX（身份证号：XXXXXXXXXXXXXX）诉被告XXX（身份证号：XXXXXXXXXXXXXX）追偿权纠纷一案（案号：（XXXX）XX民初XXX号），追偿金额人民币【】元。本院已受理，请被告依法应诉。`;
  }
  if (name === '离婚纠纷诉讼') {
    return `${court}原告XXX（身份证号：XXXXXXXXXXXXXX）诉被告XXX（身份证号：XXXXXXXXXXXXXX）离婚纠纷一案（案号：（XXXX）XX民初XXX号）。本院已受理，请被告依法应诉。`;
  }
  if (name === '抚养费纠纷诉讼') {
    return `${court}原告XXX（身份证号：XXXXXXXXXXXXXX）诉被告XXX（身份证号：XXXXXXXXXXXXXX）抚养费纠纷一案（案号：（XXXX）XX民初XXX号），原告请求被告支付抚养费人民币【】元/月。本院已受理，请被告依法应诉。`;
  }
  if (name === '机动车交通事故责任纠纷诉讼') {
    return `${court}原告XXX（身份证号：XXXXXXXXXXXXXX）诉被告XXX（身份证号：XXXXXXXXXXXXXX）及XXX保险公司机动车交通事故责任纠纷一案（案号：（XXXX）XX民初XXX号），涉及赔偿金额人民币【】元。本院已受理，请当事人依法参加诉讼。`;
  }
  if (name === '财产纠纷诉讼') {
    return `${court}原告XXX（身份证号：XXXXXXXXXXXXXX）诉被告XXX（身份证号：XXXXXXXXXXXXXX）财产纠纷一案（案号：（XXXX）XX民初XXX号），涉及标的金额人民币【】元。本院已受理，请当事人依法应诉。`;
  }
  if (name === '占有物返还纠纷诉讼') {
    return `${court}原告XXX（身份证号：XXXXXXXXXXXXXX）诉被告XXX（身份证号：XXXXXXXXXXXXXX）占有物返还纠纷一案（案号：（XXXX）XX民初XXX号），涉案标的物：XXX（名称/数量）。本院已受理，请被告依法应诉。`;
  }
  if (name === '变更登记纠纷公告') {
    return `${court}（XXXX）XX行初XXX号\n\n原告XXX（身份证号：XXXXXXXXXXXXXX）诉被告XXX关于不动产权属变更登记纠纷一案，本院已受理。现依法公告通知相关权利人，相关权利人可向本院主张权益。`;
  }

  // 6. 司法拍卖与资产处置
  if (name === '司法拍卖公告') {
    return `${court}关于执行XXX（身份证号/注册号：XXXXXXXXXXXXXX）名下财产一案（案号：（XXXX）XX执XX号），本院依法对下列财产进行网络司法拍卖：\n1. 房产：XXX路XXX号XXX室（建筑面积XXX平方米）\n2. 其他财产：XXX\n\n评估价：人民币【】元，起拍价：人民币【】元。拍卖平台：阿里巴巴司法拍卖网（sf.taobao.com），拍卖时间：XXXX年XX月XX日XX时起。详情请登录拍卖平台查询。`;
  }
  if (name === '资产处置公告') {
    return `${court}（XXXX）XX执字第XX号\n\n本院依法对被执行人XXX（统一社会信用代码：XXXXXXXX）名下资产进行处置，现公告通知相关权利人。处置资产范围包括：XXX（具体描述）。请相关权利人于XXXX年XX月XX日前向本院申报权利。联系人：XXX，电话：XXXX-XXXXXXXX。`;
  }
  if (name === '车辆拍卖公告') {
    return `${court}关于XXX（身份证号：XXXXXXXXXXXXXX）名下车辆（车牌号：XXXXXX，车辆识别代号：XXXXXXXXXXXXXXXXX）一案，本院依法进行公开拍卖。车辆型号：XXX，起拍价：人民币【】元，拍卖平台：淘宝司法拍卖（paipai.taobao.com），拍卖时间：XXXX年XX月XX日XX时起。请有意竞买者登录拍卖平台详阅车辆瑕疵说明。`;
  }
  if (name === '无主车认领公告') {
    return 'XX市公安局交通警察支队\n\n我单位在处理交通事故/执法过程中依法扣押以下车辆（车牌号：XXXXXX，车架号：XXXXXXXXXXXXXXXXX，车型：XXX，颜色：XX）。现依法公告寻找车辆所有人或其他权利人。请相关权利人自本公告之日起六十日内持合法证明文件到XX市XX区XX路XX号认领，逾期无人认领的，将依法进行处理。联系电话：XXXX-XXXXXXXX。';
  }
  if (name === '非法改装运油车辆扣押认领公告') {
    return 'XX市交通运输综合行政执法支队\n\n我单位依法扣押非法改装运油车辆一辆（车牌号：XXXXXX，车架号：XXXXXXXXXXXXXXXXX）。车辆涉嫌违反《中华人民共和国道路交通安全法》相关规定。现依法公告寻找车辆所有人，请相关权利人持有效证件及车辆合法证明于本公告见报之日起六十日内到本支队（地址：XXXX）接受处理，逾期将依法拍卖处置。联系电话：XXXX-XXXXXXXX。';
  }

  // 7. 补偿提存与领取
  if (name === '领取丧葬费和抚恤金通知') {
    return `${companyName}（或XX单位）\n\nXXX（原系本单位职工，于XXXX年XX月XX日去世）的遗属：依据国家和地方相关规定，请下列遗属（死者配偶/子女/父母等）持死者死亡证明、亲属关系证明及本人有效身份证件到本单位人力资源部办理丧葬费及抚恤金领取手续。领取期限：XXXX年XX月XX日前。地址：XXXX，联系人：XXX，电话：XXXX-XXXXXXXX。`;
  }
  if (name === '领取房屋补偿款通知书') {
    return '被征收人XXX（身份证号：XXXXXXXXXXXXXX）：\n\n因XX项目建设，你的房屋（位于XX市XX区XX路XX号）已依法征收，征收补偿款人民币【】元已专户存储。现通知你持本人有效身份证件、房屋产权证明及征收补偿协议到XX市XX区XX局（地址：XXXX）领取补偿款。领取期限：XXXX年XX月XX日前。联系电话：XXXX-XXXXXXXX。';
  }
  if (name === '领取提存款公告') {
    return 'XX公证处\n\nXXX（身份证号：XXXXXXXXXXXXXX）于XXXX年XX月XX日将款项人民币【】元提存于本处（提存原因：XXX）。现公告通知债权人/受益人XXX自本公告见报之日起六十日内持有效证件到本处领取，逾期无人领取的，依据《提存公证规则》依法处理。地址：XXXX，联系人：XXX，电话：XXXX-XXXXXXXX。';
  }
  if (name === '提存公告') {
    return 'XX公证处\n\n依据《提存公证规则》，本处对债务人XXX（身份证号：XXXXXXXXXXXXXX）提存的款项/物品予以公告公示。提存标的：XXX（金额或物品描述），提存日期：XXXX年XX月XX日。相关权利人请于见报之日起六十日内持合法依据到本处办理领取手续。联系电话：XXXX-XXXXXXXX。';
  }
  if (name === '集体资产处置社员登记公告') {
    return `${companyName}（农村集体经济组织名称）\n\n依据《农村集体资产管理条例》，本集体组织拟对以下资产进行处置：XXX（资产描述），资产估值人民币【】元。现依法进行公告，请本集体经济组织全体社员于XXXX年XX月XX日前携带社员证到村（居）委会进行权利登记，逾期未登记者视为无异议。联系电话：XXXX-XXXXXXXX。`;
  }

  // 8. 寻人协查与司法文书
  if (name === '寻找目击证人及死者家属启示') {
    return '寻人启示\n\nXXXX年XX月XX日XX时许，在XX市XX区XX路发生一起事故/事件，死者XXX（男/女，身份证号：XXXXXXXXXXXXXX）经抢救无效死亡。为查明案件真相，现寻找现场目击证人及死者家属。请知情者立即与XX市公安局XX分局联系，对提供有效线索者将给予适当奖励并为其保密。联系人：XXX警官，电话：XXXX-XXXXXXXX。';
  }
  if (name === '找死者家属协查通报公告') {
    return '协查通报\n\nXX市公安局XX分局\n\nXXXX年XX月XX日，在XX市XX区XX路发现一名死者（性别：X，年龄：XX岁左右，身高：XXXcm，体貌特征：XXX，穿XX色衣服，随身携带物品：XXX）。为查明死者身份及死因，现寻找死者家属。有知情者请速与警方联系，对提供有效信息者给予适当奖励并绝对保密。联系人：XXX，电话：XXXX-XXXXXXXX。';
  }
  if (name === '寻亲公告') {
    return '寻亲公告\n\n申请人XXX（身份证号：XXXXXXXXXXXXXX）申请寻找失散亲人XXX（原姓名/曾用名：XXX，性别：X，出生于XXXX年XX月XX日，原户籍地：XX省XX市XX区/县XX路XX号，最后联系时间：XXXX年）。如有知情者请与XX省XX市XX公证处联系，联系电话：XXXX-XXXXXXXX。本公告自见报之日起六十日视为送达。';
  }
  if (name === '宣告死亡公告') {
    return `${court}（XXXX）XX民特字第XX号\n\n申请人XXX（身份证号：XXXXXXXXXXXXXX）申请宣告XXX（身份证号：XXXXXXXXXXXXXX）死亡一案，本院已受理。因被申请人下落不明，现依法公告送达申请书副本，自公告之日起一年届满视为送达。被申请人或其他利害关系人对本案有异议的，请于一年内向本院提出。联系电话：XXXX-XXXXXXXX。`;
  }
  if (name === '申请死亡公告') {
    return `${court}（XXXX）XX民特字第XX号\n\n申请人XXX（身份证号：XXXXXXXXXXXXXX）申请宣告XXX（身份证号：XXXXXXXXXXXXXX）死亡。本院依法进行公告送达，请被申请人XXX的利害关系人在公告期内向本院提出异议。公告期一年，自XXXX年XX月XX日起算。联系电话：XXXX-XXXXXXXX。`;
  }
  if (name === '遗赠公证公告') {
    return 'XX公证处\n\n遗赠人XXX（身份证号：XXXXXXXXXXXXXX）于XXXX年XX月XX日订立公证遗嘱，将本人财产（位于XX市XX区XX路XX号房产，房产证号：XXXXXXXX）遗赠给XXX（身份证号：XXXXXXXXXXXXXX）。现依法公告通知相关继承人及利害关系人，如对此遗嘱有异议，请于见报之日起三十日内向本处书面提出，逾期无异议的，本处将依法为受遗赠人办理遗赠公证手续。';
  }
  if (name === '图书更名声明') {
    return '更名声明\n\nXXX出版社\n\n我出版社出版的《XXXX》（ISBN：XXXXXXXXXXXXXX）一书，因作者申请及出版社审核，现决定将该书书名更改为《XXXX》，原书名《XXXX》自XXXX年XX月XX日起停止使用。更名后内容不变，书号不变。请读者和经销商注意识别。\n\nXXX出版社\nXXXX年XX月XX日';
  }

  // 9. 行政监管与企业公告
  if (name === '海关走私货物认领公告') {
    return 'XX海关\n\n我关依法在XX口岸查获走私货物/物品一批（详见清单），当事人不明。现依法公告寻找货物所有人或合法权利人。请相关权利人于本公告见报之日起六个月内持合法证明文件及货物权属证明到XX海关（地址：XXXX）办理认领手续，逾期无人认领的，我关将依法作出处理决定。联系电话：XXXX-XXXXXXXX。';
  }
  if (name === '人防工程易地建设费催缴公告') {
    return 'XX市人民防空办公室\n\nXXX单位（统一社会信用代码：XXXXXXXX）：你单位于XXXX年在XX地块建设的XXX项目，应按规定缴纳人防工程易地建设费人民币【】元，至今未缴纳。现依法向你单位发出催缴通知，限你单位自收到本通知之日起十五日内到XX市人防办（地址：XXXX，联系人：XXX，电话：XXXX-XXXXXXXX）缴纳，逾期将依法加处罚款并申请强制执行。';
  }
  if (name === '注销非法户口公告') {
    return 'XX市公安局XX分局\n\n经查，XXX（曾用名/别名：XXX，身份证号：XXXXXXXXXXXXXX）系使用虚假材料登记的非法户口，现依法予以注销。持证人持有的身份证件一律作废，不得使用。如有异议，请于本公告见报之日起三十日内持合法证明材料到XX公安分局户籍科申诉。联系电话：XXXX-XXXXXXXX。';
  }
  if (name === '损害社会公共利益公告') {
    return '声明人XXX（身份证号/注册号：XXXXXXXXXXXXXX）：\n\n就【事项描述】一事，现郑重声明如下：XXX（具体声明内容）。本声明旨在维护社会公共利益，如有虚假声明，声明人愿承担一切法律责任。\n\n声明人：XXX\nXXXX年XX月XX日';
  }
  if (name === '经营证券期货业务许可证遗失公告') {
    return `${companyName}\n\n本公司遗失中华人民共和国经营证券期货业务许可证（许可证编号：XXXXXXXXXXXXXX，机构名称：XXX证券期货有限公司），声明作废。\n\n公司郑重声明：任何单位或个人不得使用上述许可证从事证券期货经营活动，违者将依法追究其法律责任。如有拾获者，请联系本公司（电话：XXXX-XXXXXXXX）。\n\n${companyName}\nXXXX年XX月XX日`;
  }
  if (name === '召开股东大会公告') {
    return `${companyName}（统一社会信用代码：XXXXXXXX）\n\n公司定于XXXX年XX月XX日XX时在XX省XX市XX区XX路XX号（公司会议室）召开第XX次股东大会，会议主要议题：1. XXX；2. XXX。请全体股东准时出席，因故不能出席的股东请书面委托他人代为出席。联系人：XXX，电话：XXXX-XXXXXXXX。\n\n${companyName}\nXXXX年XX月XX日`;
  }
  if (name === '律师授权声明') {
    return '律师授权声明\n\nXXX（执业证号：XXXXXXXXXXXXXXXXXXX），系XXX（律师事务所名称）的执业律师。XXX（当事人姓名/公司名称）委托本律师就【案件/事项】提供法律服务。本律师声明：在代理期间，本律师有权代表委托人进行与本案/事项相关的诉讼、非诉讼及调解活动，其行为后果由委托人承担。\n\n授权范围：XXX\n\n授权期限：XXXX年XX月XX日至XXXX年XX月XX日\n\nXXX律师事务所\nXXX律师\nXXXX年XX月XX日';
  }
  if (name === '放弃公司股份公告') {
    return `${companyName}（统一社会信用代码：XXXXXXXX）\n\n股东XXX（身份证号：XXXXXXXXXXXXXX）现声明自愿放弃其持有的本公司股份XX万股（占公司注册资本XX%），该部分股份由公司其他股东/指定方按【价格/方式】受让。本声明经公告送达公司登记机关之日起生效，届时本公司将依法办理股权变更登记。\n\n股东：XXX\nXXXX年XX月XX日`;
  }
  if (name === '房屋征收强制执行事先催告书送达公告') {
    return 'XX市XX区人民政府\n\n被征收人XXX（身份证号：XXXXXXXXXXXXXX）：你名下位于XX市XX区XX路XX号的房屋已被依法征收，因你在法定期限内未完成搬迁，现依法向你发出强制执行前催告。限你自收到本催告书之日起十五日内完成房屋搬迁并交付拆除，逾期不履行的，本机关将依法申请人民法院强制执行，由此产生的一切后果由你承担。联系电话：XXXX-XXXXXXXX。';
  }
  if (name === '涉案财物处理公告') {
    return 'XX市公安局XX分局\n\n我单位在办理XXX案件（案号：XX公（XX）缴字〔XXXX〕XX号）过程中，依法扣押/追缴涉案财物一批（详见清单）。现依法公告寻找涉案财物合法所有人。请相关权利人于本公告见报之日起六十日内持合法证明文件到本局（地址：XXXX）办理认领手续，逾期无人认领的，本局将依法作出处理。联系电话：XXXX-XXXXXXXX。';
  }
  if (name === '骨灰存放公告') {
    return 'XX市XX殡仪馆/XX公墓\n\n逝者XXX（身份证号：XXXXXXXXXXXXXX）之骨灰存放于本馆（地址：XXXX），存放编号：XXXXXXXX。本馆依法公告通知逝者家属/继承人，请相关亲属于XXXX年XX月XX日前持亲属关系证明及本人身份证件到本馆办理骨灰续存或领取手续。逾期未办理且无法联系的，本馆将依法依规进行处理。联系电话：XXXX-XXXXXXXX。';
  }
  if (name === '户口迁移公告') {
    return 'XX市公安局XX派出所\n\n下列人员（名单附后）因【长期不在户籍地居住/未按规定进行人户分离登记/其他原因】，现依法将其户籍由本辖区迁移至XX市XX区XX路XX号（社区集体户）。如对户籍迁移有异议，请于本公告见报之日起三十日内持有效证明材料到本派出所（电话：XXXX-XXXXXXXX）提出申诉。';
  }

  // 默认兜底
  return '公告\n\nXXX（身份证号/注册号：XXXXXXXXXXXXXX）就XXX事项依法公告如下：XXX（具体内容）。如对此公告有异议，请在见报之日起三十日内向有关部门提出，逾期视为无异议。\n\n联系电话：XXXX-XXXXXXXX\nXXXX年XX月XX日';
}

module.exports = { categories, generateContent };
