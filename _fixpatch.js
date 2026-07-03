var fs = require('fs');
var f = 'D:\\刻章软件\\rongcheng-miniprogram\\pages\\newspaper\\content-edit\\index.js';
var c = fs.readFileSync(f, 'utf8');

// Fix 1: email pattern - remove '.' from negated char class
// The old char class [^\s，,。.！!？?\n] has '.' which matches any char
// We need to exclude '.' explicitly
var oldEmailPattern = "/XXXX@[^\s，,。.！!？?\n]+/g";
var newEmailPattern = "/XXXX@[^\\\\s，。、！？:;\"\"''()（）【】\\\\n]+/g";
var oldEmailLine = "    result = result.replace(/XXXX@[^\s，,。.！!？?\n]+/g, '（示例：test@example.com）');";
var newEmailLine = "    result = result.replace(/XXXX@[^\\\\s，。、！？:;\"\"''()（）【】\\\\n]+/g, '（示例：test@example.com）');";
c = c.replace(oldEmailLine, newEmailLine);

// Fix 2: company name - replace dangling XXXX公司 pattern
var oldCompanyLine = "    result = result.replace(/XXXX公司(?![A-Z])/g, '（示例：XX公司）');";
var newCompanyLines = "    result = result.replace(/XXXX公司/g, '（示例：XX公司）有限公司');\n    result = result.replace(/（示例：XX公司）有限公司有限公司/g, '（示例：XX公司）有限公司');";
c = c.replace(oldCompanyLine, newCompanyLines);

fs.writeFileSync(f, c);
console.log('done');
