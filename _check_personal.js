var smartReplace = require('./utils/smart-replace.js');

// 测试个人证件模板的各个字段
var tests = [
  { name: '姓名', input: '本人XXX，', cat: '个人证件' },
  { name: '身份证号', input: '身份证号：XXXXXXXXXXXXXXXXXX。', cat: '个人证件' },
  { name: '日期', input: 'XXXX年XX月XX日', cat: '个人证件' },
  { name: '地点', input: '在XXXXXXXX遗失了', cat: '个人证件' },
  { name: '证件', input: 'XXX证件。', cat: '个人证件' },
  { name: '全部', input: '本人XXX，身份证号：XXXXXXXXXXXXXXXXXX。\n本人于XXXX年XX月XX日在XXXXXXXX遗失了XXX证件。', cat: '个人证件' }
];

console.log('=== 个人证件模板字段替换检查 ===\n');
tests.forEach(function(t) {
  var result = smartReplace.doSmartReplace(t.input, t.cat);
  console.log('【' + t.name + '】');
  console.log('  输入:', t.input);
  console.log('  输出:', result);
  console.log('');
});
