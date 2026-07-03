var fs = require('fs');
var f = 'D:\\刻章软件\\rongcheng-miniprogram\\pages\\newspaper\\content-edit\\index.js';
var c = fs.readFileSync(f, 'utf8');

// Fix company: add full suffix (）有限公司) and dedup
// Old: result = result.replace(/XXXX公司/g, '（示例：XX公司');
var oldLine = "    result = result.replace(/XXXX公司/g, '（示例：XX公司');";
var newLine = "    result = result.replace(/XXXX公司/g, '（示例：XX公司）有限公司');\n    result = result.replace(/（示例：XX公司）有限公司）有限公司/g, '（示例：XX公司）有限公司');";
c = c.replace(oldLine, newLine);

fs.writeFileSync(f, c);
console.log('done');
