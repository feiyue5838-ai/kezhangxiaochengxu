var fs = require('fs');
var file = 'D:\\刻章软件\\rongcheng-miniprogram\\pages\\newspaper\\content-edit\\index.js';
var c = fs.readFileSync(file, 'utf8');

// Fix 1: email pattern - remove '.' from negated char class to avoid matching '.com' partially
// Old: /XXXX@[^\s，,。.！!？?\n]+/g
// New: /XXXX@[^\s，。、！？:;""''（）【】\n]+/g
c = c.replace(
  /result = result\.replace\(\/XXXX@\[\\?s，,。.！!？\?\\?n\]\+\/g, '（示例：test@example\.com）'\);/,
  "result = result.replace(/XXXX@[^\\\\s，。、！？:;\"\"''（）【】\\\\n]+/g, '（示例：test@example.com）');"
);

// Fix 2: company name suffix - replace dangling pattern with full suffix version
// Old: result = result.replace(/XXXX公司(?![A-Z])/g, '（示例：XX公司）');
// New: replace XXXX公司 with full "（示例：XX公司）有限公司" + dedup
c = c.replace(
  "result = result.replace(/XXXX公司(?![A-Z])/g, '（示例：XX公司）');",
  "result = result.replace(/XXXX公司/g, '（示例：XX公司）有限公司');\n    result = result.replace(/（示例：XX公司）有限公司有限公司/g, '（示例：XX公司）有限公司');"
);

fs.writeFileSync(file, c);
console.log('ok');
