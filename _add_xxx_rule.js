var fs = require('fs');
var c = fs.readFileSync('utils/smart-replace.js', 'utf8');

// 在 XXX 姓名规则之前添加 XXX证件 规则
var oldText = "  // ══════════════════════════════════════════════════════\n  // 10. 姓名类标签（label: XXX）\n  // ══════════════════════════════════════════════════════";

var newText = "  // ══════════════════════════════════════════════════════\n  // 9.5. XXX证件 规则（必须在姓名规则之前）\n  // ══════════════════════════════════════════════════════\n  r = r.replace(/XXX证件/g, '（示例：身份证）证件');\n  \n  // ══════════════════════════════════════════════════════\n  // 10. 姓名类标签（label: XXX）\n  // ══════════════════════════════════════════════════════";

if (c.includes(oldText)) {
  c = c.replace(oldText, newText);
  fs.writeFileSync('utils/smart-replace.js', c, 'utf8');
  console.log('✅ 已添加 XXX证件 规则');
} else {
  console.log('⚠️ 未找到目标位置，直接添加到文件末尾');
  // 在文件末尾之前添加
  var insertIdx = c.lastIndexOf('module.exports');
  if (insertIdx >= 0) {
    var before = c.substring(0, insertIdx);
    var after = c.substring(insertIdx);
    var added = '  // XXX证件 规则\n  r = r.replace(/XXX证件/g, \'（示例：身份证）证件\');\n\n';
    c = before + added + after;
    fs.writeFileSync('utils/smart-replace.js', c, 'utf8');
    console.log('✅ 已添加 XXX证件 规则（添加到末尾）');
  }
}
