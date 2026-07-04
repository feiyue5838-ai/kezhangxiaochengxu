var smartReplace = require('./utils/smart-replace.js');

// 详细追踪个人证件模板的替换过程
var input = '在XXXXXXXX遗失了XXX证件。';
console.log('输入:', input);
console.log('');

// 手动模拟替换过程
var rules = [
  '日期替换',
  '18位身份证号',
  '8X地点',
  '8X证件',
  '4X通用',
  '3X姓名'
];

// 直接测试
var result = smartReplace.doSmartReplace(input, '个人证件');
console.log('最终输出:', result);
console.log('');

// 检查规则
var fs = require('fs');
var c = fs.readFileSync('utils/smart-replace.js', 'utf8');
console.log('规则检查:');
console.log('  1. XXXXXXXX证件规则存在:', c.indexOf('XXXXXXXX证件') >= 0 ? '✅' : '❌');
console.log('  2. XXX证件规则存在:', c.indexOf('XXX证件') >= 0 ? '✅' : '❌');
console.log('  3. 个人证件分类规则存在:', c.indexOf("'个人证件'") >= 0 ? '✅' : '❌');
