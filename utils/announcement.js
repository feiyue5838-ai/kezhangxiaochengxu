// utils/announcement.js - 公告声明模板配置
// 共 17 大类，涵盖公司工商、工程房产、公章证件、债权债务、经营许可、人事招聘等

function toDocs(arr) {
  return arr.map(function (name) {
    return { name: name };
  });
}

var CATEGORIES = [
  {
    id: 'company',
    name: '公司工商变更类',
    desc: '股权 · 法人 · 名称 · 清算',
    color: '#5B6FE8',
    hot: true,
    docs: toDocs([
      '减资公告', '清算公告', '吸收合并公告', '分立公告', '法人变更公告',
      '公司名称变更', '个体工商户转变企业组织形式公告', '转型升级公告',
      '分公司设立公告', '股权变更公告', '股权转让公告',
      '股东会议通知', '股东决议公告', '合并破产重整会议通知',
      '注销公告', '简易注销公告', '清算组备案债权人公告',
      '撤销清算组备案及债权人公告', '股东出资催缴通知',
      '股权优先购买转让通知', '合伙企业变更合伙人通知',
      '变更执行事务合伙人通知', '个体工商户转型升级更正公告',
      '股权变更更正公告', '出资人变更公告', '新设分立公告',
      '合并新设公告', '债权债务申报登记公告'
    ])
  },
  {
    id: 'estate',
    name: '工程房产物业类',
    desc: '工程款 · 竣工 · 交房 · 拆迁',
    color: '#5B6FE8',
    hot: true,
    docs: toDocs([
      '工程款结算公告', '竣工验收公告', '交房公告', '道路封闭公告',
      '房屋租赁催告', '限期腾房通知', '租赁合同解除通知书',
      '门面租赁声明', '物业招租', '房屋产权转让公告', '土地证明',
      '安置房相关公告', '拆迁寻人启事', '苗木迁移公告',
      '工程尾款办理公告', '物业招标公告', '车库使用权转让通知',
      '市政改造工程招标公告'
    ])
  },
  {
    id: 'seal',
    name: '公章/证件遗失免责',
    desc: '公章 · 证照 · 身份证 · 免责',
    color: '#5B6FE8',
    hot: true,
    docs: toDocs([
      '合同作废声明', '未备案公章免责声明', '身份证冒用免责声明',
      '公司印章声明', '公章被盗免责声明', '公章更换声明',
      '证照印章作废公告', '解除股东资格公告', '指定承租人刊登公告',
      '代开发票专用章遗失公告', '品牌授权作废声明'
    ])
  },
  {
    id: 'debt',
    name: '债权债务/催收/催告函',
    desc: '债权转让 · 催收 · 资产处置',
    color: '#5B6FE8',
    hot: true,
    docs: toDocs([
      '催告函', '债务逾期催收通知书', '货款催收公告', '借款逾期催收函',
      '关于退回专项资金催告函', '债权转让公告', '预收款项清欠公告',
      '资产处置公告', '财产份额转让告知书'
    ])
  },
  {
    id: 'license',
    name: '经营许可/备案/注销',
    desc: '办学 · 食品 · 资质 · 许可',
    color: '#5B6FE8',
    hot: false,
    docs: toDocs([
      '终止办学公告', '食品召回公告', '解除公告', '减资撤销公告',
      '民办非企业注销', '社会团体注销', '退出市场公告',
      '取消加盟公告', '解除合伙通知书', '弃货处理公告',
      '经营地址变更公告', '《保险兼业代理业务许可证》延续公告',
      '换证公告', '商标通知', '道路运输经营许可变更公告',
      '各类资质延续/遗失公告'
    ])
  },
  {
    id: 'hr',
    name: '人事/招聘/劳务仲裁',
    desc: '招聘 · 求职 · 社保 · 仲裁',
    color: '#5B6FE8',
    hot: false,
    docs: toDocs([
      '招聘公告', '求职公告', '劳动人事争议仲裁委员会公告', '社保减员公告'
    ])
  },
  {
    id: 'lost',
    name: '遗失/寻人/寻物启事',
    desc: '寻人 · 寻车 · 寻找责任人',
    color: '#5B6FE8',
    hot: false,
    docs: toDocs([
      '寻人启事', '寻车启事', '寻找责任人公告'
    ])
  },
  {
    id: 'terminate',
    name: '合作解除/终止/澄清',
    desc: '解除代理 · 严正声明 · 澄清',
    color: '#5B6FE8',
    hot: false,
    docs: toDocs([
      '解除委托代理公告', '解除代持公告', '关于防止诈骗的严正声明',
      '严正声明', '合作协议解除书', '产品合格证声明', '货物认领公告',
      '解除承包合同声明', '澄清公告', '关于公司名称混淆声明',
      '非本公司法人执行董事声明'
    ])
  },
  {
    id: 'property',
    name: '不动产/土地/产权公示',
    desc: '宅基地 · 土地使用权 · 产权交易',
    color: '#5B6FE8',
    hot: false,
    docs: toDocs([
      '不动产公开挂牌转让公告', '宅基地使用权确权公告',
      '土地使用权相关公示', '产权交易公告'
    ])
  },
  {
    id: 'notify',
    name: '各类通知/公示/备案',
    desc: '限期返岗 · 除名 · 户口 · 债权申报',
    color: '#5B6FE8',
    hot: false,
    docs: toDocs([
      '限期返岗通知', '接受遗赠声明', '网签合同撤销公示',
      '除名通知书', '户口迁走通知声明', '保管箱停止服务公告',
      '车辆报废声明', '解除车辆挂靠合同公告', '无主人行天桥认领公告',
      '无主财务公告', '债权申报公告'
    ])
  },
  {
    id: 'auction',
    name: '拍卖/招标/竞价类',
    desc: '暂停拍卖 · 竞价公告',
    color: '#5B6FE8',
    hot: false,
    docs: toDocs([
      '暂停拍卖通知', '竞价公告'
    ])
  },
  {
    id: 'org',
    name: '机构设立/开业/解散',
    desc: '公益中心 · 商会 · 学校 · 分支机构',
    color: '#5B6FE8',
    hot: false,
    docs: toDocs([
      '公益志愿服务中心成立公告', '商会成立公告', '学校成立公告',
      '开业公告', '分支机构设立公告'
    ])
  },
  {
    id: 'stock',
    name: '产权/股权/股票相关',
    desc: '回购股票 · 商铺租赁 · 涉案账户',
    color: '#5B6FE8',
    hot: false,
    docs: toDocs([
      '关于回购限制性股票的减资公告', '核查开设赌场涉案账户公告',
      '商铺租赁合同解除公告'
    ])
  },
  {
    id: 'notary',
    name: '公证/遗嘱/法律文书',
    desc: '遗嘱公证 · 公证告示',
    color: '#5B6FE8',
    hot: false,
    docs: toDocs([
      '遗嘱公证公告', '遗嘱公证告示'
    ])
  },
  {
    id: 'vehicle',
    name: '车辆/船舶相关',
    desc: '三无船舶 · 车辆报废',
    color: '#5B6FE8',
    hot: false,
    docs: toDocs([
      '寻三无船舶船主公告'
    ])
  },
  {
    id: 'special',
    name: '特殊行业专项公告',
    desc: '保险 · 设备招标 · 营业场所变更',
    color: '#5B6FE8',
    hot: false,
    docs: toDocs([
      '保险销售人员执业证作废公告', '设备招标公告',
      '保险机构营业场所变更公告', '领取保险许可证公告'
    ])
  },
  {
    id: 'other',
    name: '其他综合公告声明',
    desc: '迁坟 · 并购 · 致歉 · 破产清算',
    color: '#5B6FE8',
    hot: false,
    docs: toDocs([
      '公告', '迁坟公告', '并购公告', '停业生产经营声明', '更正声明',
      '致歉信', '不合格产品召回公告', '火灾公告', '施工公告',
      '破产清算公告', '个体企业清算公告', '收费通知', '催告搬迁通知',
      '协商函', '请求维护公司权利函', '协议终止通知函', '关闭公告',
      '工伤认定送达公告', '品牌授权作废公告', '住房公积金管理中心公告',
      '欠费通知', '担保相关公告', '行政处罚事先告知', '中标公告',
      '债务清偿声明', '保险许可证公告', '各类经营许可延续公告',
      '解除抵押权公告', '解除商品房买卖合同通知', '更正公告',
      '撤销注销公告', '债权债务申报登记', '派生分立公告',
      '清算公告（外资清算）', '外商投资企业吸收合并公告',
      '股东会议决议公告', '临时股东大会公告', '保险股份公司资产处置公告',
      '保险有限公司新设公告'
    ])
  }
];

// 去重提取所有唯一名称
var ALL_DOCS = [];
var seen = {};
CATEGORIES.forEach(function (cat) {
  cat.docs.forEach(function (doc) {
    if (!seen[doc.name]) {
      seen[doc.name] = true;
      ALL_DOCS.push(doc.name);
    }
  });
});

// 热门置顶
var HOT_DOCS = [
  '减资公告', '清算公告', '注销公告', '股权转让公告',
  '债权转让公告', '公章更换声明', '寻人启事', '开业公告'
];

module.exports = {
  categories: CATEGORIES,
  allDocs: ALL_DOCS,
  hotDocs: HOT_DOCS,
  getTotalCount: function () {
    return ALL_DOCS.length;
  },
  generateContent: function (docName) {
    // 根据名称关键字智能生成内容
    if (docName.indexOf('遗失') !== -1 || docName.indexOf('挂失') !== -1) {
      return '遗失声明\n\n' +
        '本人/本单位于XXXX年XX月XX日不慎遗失' + docName.replace('遗失声明', '').replace('挂失', '') + '（证件号码：XXX），' +
        '声明作废。\n' +
        '如有拾得者，请联系本人/本单位，对拾得者协助归还的行为深表感谢。\n' +
        '本人/本单位不承担因该证件被他人非法使用而产生的任何法律责任。\n\n' +
        '声明人：XXX\n' +
        '联系电话：XXXX\n' +
        '联系地址：XXXX\n' +
        'XXXX年XX月XX日';
    }
    if (docName.indexOf('公告') !== -1) {
      return '公告\n\n' +
        docName + '\n\n' +
        'XXX（单位/个人）依据相关法律法规的规定，现发布本公告。\n' +
        '相关内容如下：XXXXXXXXXXXXXXXXXXXXXXXXXXXX。\n' +
        '请相关利害关系人在本公告刊登之日起XX日内与本单位/本人联系，逾期将依法处理。\n\n' +
        '公告单位：XXX\n' +
        '联系人：XXX\n' +
        '联系电话：XXXX\n' +
        'XXXX年XX月XX日';
    }
    if (docName.indexOf('变更') !== -1 || docName.indexOf('转让') !== -1 || docName.indexOf('注销') !== -1) {
      return '变更（转让/注销）公告\n\n' +
        'XXX公司（统一社会信用代码：XXXX）经股东会（董事会）决议，' +
        '现将有关' + docName + '事项公告如下：\n\n' +
        'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX。\n\n' +
        '债权人自本公告刊登之日起45日内，有权要求本公司清偿债务或提供相应担保。\n' +
        '逾期未主张者，视为放弃相关权利。\n\n' +
        '特此公告。\n\n' +
        'XXX公司\n' +
        '法定代表人：XXX\n' +
        '联系电话：XXXX\n' +
        'XXXX年XX月XX日';
    }
    if (docName.indexOf('致歉') !== -1 || docName.indexOf('道歉') !== -1) {
      return '致歉声明\n\n' +
        '本人/本单位对XXXX（事项/行为）给XXXX（相关方）造成的困扰和影响，深表遗憾和歉意。\n\n' +
        '经认真反思，本人/本单位已充分认识到自身的错误，并郑重承诺：\n' +
        '1. XXXXXXXXXXXXXXXXXXXXX\n' +
        '2. XXXXXXXXXXXXXXXXXXXXX\n' +
        '3. XXXXXXXXXXXXXXXXXXXXX\n\n' +
        '本人/本单位诚挚接受社会各界的监督，今后将严格自律，避免此类事件再次发生。\n\n' +
        '再次向受影响的各方致以最诚挚的歉意。\n\n' +
        '致歉人：XXX\n' +
        'XXXX年XX月XX日';
    }
    if (docName.indexOf('债权') !== -1 || docName.indexOf('债务') !== -1 || docName.indexOf('催') !== -1) {
      return '债权（债务）公告\n\n' +
        'XXX公司（统一社会信用代码：XXXX）依法进入XX程序，现通知各债权人申报债权。\n\n' +
        '请各债权人于XXXX年XX月XX日前，持有效债权凭证及相关资料，向本公司管理人申报债权。\n' +
        '逾期未申报者，按照《中华人民共和国企业破产法》相关规定处理。\n\n' +
        '债权申报联系人：XXX\n' +
        '联系电话：XXXX\n' +
        '联系地址：XXXX\n\n' +
        '特此公告。\n\n' +
        'XXX公司管理人\n' +
        'XXXX年XX月XX日';
    }
    if (docName.indexOf('通知') !== -1) {
      return docName + '\n\n' +
        '致：XXX\n\n' +
        '因XXXXXXXXXXXXX，现通知如下：\n\n' +
        '1. XXXXXXXXXXXXXXXXXXXXX\n' +
        '2. XXXXXXXXXXXXXXXXXXXXX\n' +
        '3. XXXXXXXXXXXXXXXXXXXXX\n\n' +
        '请于XXXX年XX月XX日前完成相关事项，逾期将按相关规定处理。\n\n' +
        '特此通知。\n\n' +
        '通知人：XXX\n' +
        '联系电话：XXXX\n' +
        'XXXX年XX月XX日';
    }
    if (docName.indexOf('声明') !== -1) {
      return docName + '\n\n' +
        'XXX（单位/个人）特此声明：\n\n' +
        'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX。\n' +
        '相关内容及说明：XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX。\n\n' +
        '如有异议，请在公告之日起XX日内与本单位/本人联系。\n\n' +
        '声明人：XXX\n' +
        '联系电话：XXXX\n' +
        '联系地址：XXXX\n' +
        'XXXX年XX月XX日';
    }
    // 默认模板
    return docName + '\n\n' +
      'XXX（单位/个人）现就' + docName + '相关事项公告如下：\n\n' +
      'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX。\n\n' +
      '如有异议，请在本公告刊登之日起XX日内联系本单位/本人。\n\n' +
      '联系人：XXX\n' +
      '联系电话：XXXX\n' +
      'XXXX年XX月XX日';
  }
};
