// utils/invoice-receipt.js - 发票收据票据模板配置
// 去重后的完整列表，按业务场景分组

function toDocs(arr) { return arr.map(function(name) { return { name: name }; }); }

var CATEGORIES = [
  {
    id: 'receipt',
    name: '收据类',
    desc: '往来 / 押金 / 医疗 / 公益',
    color: '#5B6FE8',
    hot: true,
    docs: toDocs(['收据','收款收据','收费收据','专用收据','收款专用收据','收款专用票据','资金往来收据','资金往来专用收据','购房交款收据','购房收据','房屋收款收据','装修押金收据','医疗机构住院收费收据','医疗基金缴款专用定额收据','垃圾清运费收据','公益事业捐赠专用收据'])
  },
  {
    id: 'check',
    name: '支票、存根结算凭证',
    desc: '支票及结算凭证',
    color: '#5B6FE8',
    hot: false,
    docs: toDocs(['支票','转账支票','存根联'])
  },
  {
    id: 'realestate',
    name: '房产不动产发票',
    desc: '购房及不动产票据',
    color: '#5B6FE8',
    hot: true,
    docs: toDocs(['购房发票','销售不动产专用发票','销售不动产统一发票'])
  },
  {
    id: 'medical',
    name: '保险医疗票据',
    desc: '保险及医疗票据',
    color: '#5B6FE8',
    hot: false,
    docs: toDocs(['保险发票','商业险发票'])
  },
  {
    id: 'vehicle',
    name: '机动车 / 车船税费票据',
    desc: '购车及车船税票据',
    color: '#5B6FE8',
    hot: true,
    docs: toDocs(['购车发票','机动车销售统一发票','机动车销售发票','车辆购置税发票','车船税发票'])
  },
  {
    id: 'general',
    name: '通用基础发票',
    desc: '税控 / 网络 / 定额 / 空白',
    color: '#5B6FE8',
    hot: false,
    docs: toDocs(['发票','空白发票','定额发票','通用机打发票','通用网络发票','通用税控发票','网络在线通用发票','财政票据','政府性基金（资金）通用票据'])
  },
  {
    id: 'special',
    name: '专用发票（收票/开票方）',
    desc: '按收票开票方区分',
    color: '#5B6FE8',
    hot: false,
    docs: toDocs(['专用发票（开票方）','普通发票（收票方）','专用发票（收票方）','普票发票（收票方）','代开统一发票','代开专用发票（发票联）','代开专用发票（抵扣联）'])
  },
  {
    id: 'service',
    name: '建筑、服务业行业发票',
    desc: '建筑及服务业票据',
    color: '#5B6FE8',
    hot: false,
    docs: toDocs(['建筑业统一发票','建筑安装业统一发票','服务业平推式发票'])
  },
  {
    id: 'trade',
    name: '进出口外贸发票',
    desc: '进出口贸易票据',
    color: '#5B6FE8',
    hot: false,
    docs: toDocs(['出口商品发票','出口货物专用发票'])
  },
  {
    id: 'management',
    name: '发票管理配套凭证',
    desc: '发票领购及管理凭证',
    color: '#5B6FE8',
    hot: false,
    docs: toDocs(['发票领购簿'])
  }
];

// 去重：提取所有唯一票据名称
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

// 热门票据（置顶）
var HOT_DOCS = ['购房发票', '购车发票', '转账支票', '收款收据', '收据', '发票', '定额发票'];

module.exports = {
  categories: CATEGORIES,
  allDocs: ALL_DOCS,
  hotDocs: HOT_DOCS,
  getTotalCount: function () {
    return ALL_DOCS.length;
  },
  generateContent: function (docName) {
    return '遗失声明\n\n本人/本单位于XXXX年XX月XX日不慎遗失' + docName + '（票据号码：XXX），特此声明作废。\n本人/本单位不承担因该票据被他人使用而产生的任何法律责任。\n\n声明人（单位）：XXX\n联系电话：XXXX';
  }
};
