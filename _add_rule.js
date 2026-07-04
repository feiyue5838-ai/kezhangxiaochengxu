var fs = require('fs');
var c = fs.readFileSync('utils/smart-replace.js', 'utf8');

// 在通用8X兜底之前添加 XXXXXXXX证件 规则
var oldText = '  // ══════════════════════════════════════════════════════\n  // 7. 通用 8X 兜底（排除年、数字、中文）\n  // ══════════════════════════════════════════════════════\n  r = r.replace(/XXXXXXXX(?![年\\d一-龥])/g, \'（示例：请填写）\');';

var newText = '  // ══════════════════════════════════════════════════════\n  // 7. 特殊 8X 模式（证件类，必须在通用兜底之前）\n  // ══════════════════════════════════════════════════════\n  r = r.replace(/XXXXXXXX证件/g, \'（示例：XX）证件\');\n  \n  // ══════════════════════════════════════════════════════\n  // 8. 通用 8X 兜底（排除年、数字、中文）\n  // ══════════════════════════════════════════════════════\n  r = r.replace(/XXXXXXXX(?![年\\d一-龥])/g, \'（示例：请填写）\');';

if (c.includes(oldText)) {
  c = c.replace(oldText, newText);
  fs.writeFileSync('utils/smart-replace.js', c, 'utf8');
  console.log('✅ 已添加 XXXXXXXX证件 规则');
} else {
  console.log('⚠️ 未找到目标代码');
}
