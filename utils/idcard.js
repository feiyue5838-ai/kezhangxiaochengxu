// utils/idcard.js - 身份证挂失模板配置

function toDocs(arr) {
  return arr.map(function (name) {
    return { name: name };
  });
}

// 企业证件页面的 12 色方案（统一配色）
var _COLORS_12 = [
  '#5B6FE8', '#FA8C16', '#52C41A', '#9BA8FF',
  '#13C2C2', '#EB2F96', '#F5222D', '#FAAD14',
  '#7B8FF7', '#A0D911', '#5B6FE8', '#8C8C8C'
];

var CATEGORIES = [
  {
    id: 'simple',
    name: '简单版',
    desc: '基础个人信息',
    color: '#5B6FE8',
    hot: true,
    docs: toDocs([
      '身份证(简单版)'
    ])
  },
  {
    id: 'concise',
    name: '精简版',
    desc: '精简描述',
    color: '#5B6FE8',
    hot: false,
    docs: toDocs([
      '身份证(精简版)'
    ])
  },
  {
    id: 'basic',
    name: '基础版',
    desc: '标准格式',
    color: '#5B6FE8',
    hot: false,
    docs: toDocs([
      '身份证(基础版)'
    ])
  },
  {
    id: 'lawyer',
    name: '律师版',
    desc: '含法律声明',
    color: '#5B6FE8',
    hot: false,
    docs: toDocs([
      '身份证(律师版)'
    ])
  }
];

// 模板内容映射（用于生成 content-edit 页面内容）
var TEMPLATE_CONTENT = {
  '身份证(简单版)': '遗失声明\n\n本人XXX于XXXX年XX月XX日不慎遗失身份证件，证号：XXX，现声明作废。\n本人不承担因此证被他人使用而产生的任何法律责任。\n特此声明。\n\n声明人：XXX\n联系电话：XXXX',
  '身份证(精简版)': '本人XXX遗失身份证，证号XXX，即日起声明作废。',
  '身份证(基础版)': '遗失声明\n\n本人XXX，身份证号码：XXX，于XXXX年XX月XX日不慎遗失身份证。\n自遗失之日起，该证件一切使用行为均与本人无关。\n特此声明。\n\n声明人：XXX\n联系电话：XXXX\n日期：XXXX年XX月XX日',
  '身份证(律师版)': '遗失声明\n\n本人XXX，身份证号码：XXX，于XXXX年XX月XX日在XXXX不慎遗失身份证。\n\n一、本人郑重声明：自遗失之日起，上述身份证件一切法律行为均与本人无关。\n\n二、若有单位或个人违法使用该证件从事活动，由此产生的一切法律责任由行为人自行承担，与本人无任何关系。\n\n三、本人已向公安机关报案并申请补办。\n\n特此声明！\n\n声明人：XXX\n联系电话：XXXX\n日期：XXXX年XX月XX日'
};

function generateContent(docName) {
  return TEMPLATE_CONTENT[docName] || docName;
}

module.exports = {
  categories: CATEGORIES,
  generateContent: generateContent
};
