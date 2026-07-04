var fs = require('fs');
var c = fs.readFileSync('utils/smart-replace.js', 'utf8');

// 修复：地点类规则需要替换全部8个X
var oldRule1 = "r = r.replace(/在XXXXXXXX发布了/g, '在（示例：XX平台）发布了');";
var newRule1 = "r = r.replace(/在XXXXXXXX发布了/g, '在（示例：XX平台）（平台/场合）发布了');";

var oldRule2 = "r = r.replace(/在XXXXXXXX中/g, '在（示例：XX事件）中');";
var newRule2 = "r = r.replace(/在XXXXXXXX中/g, '在（示例：XX事件）（事件）中');";

var count = 0;
if (c.includes(oldRule1)) {
  c = c.replace(oldRule1, newRule1);
  count++;
}
if (c.includes(oldRule2)) {
  c = c.replace(oldRule2, newRule2);
  count++;
}

if (count > 0) {
  fs.writeFileSync('utils/smart-replace.js', c, 'utf8');
  console.log('✅ 已修复地点类规则（' + count + '处）');
} else {
  console.log('⚠️ 未找到地点类规则');
}
