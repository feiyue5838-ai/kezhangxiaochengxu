var fs = require('fs');
var c = fs.readFileSync('D:\\刻章软件\\rongcheng-miniprogram\\pages\\newspaper\\content-edit\\index.js', 'utf8');

// Find smartReplace function
var start = c.indexOf('smartReplace(content) {');
if (start === -1) { console.log('not found'); return; }
start = c.indexOf('{', start);

// Find matching closing brace
var depth = 0, end = start;
for (var i = start; i < c.length; i++) {
  if (c[i] === '{') depth++;
  if (c[i] === '}') { depth--; if (depth === 0) { end = i; break; } }
}

var fn = 'function smartReplace(c){' + c.substring(start + 1, end) + '\n  return result;\n}';

// Write a standalone test
var labor = require('D:\\刻章软件\\rongcheng-miniprogram\\utils\\labor-dispute.js');
var test = [
  'var smartReplace = ' + fn + ';',
  'var pass=0,fail=0;',
  'var labor=require("D:\\\\刻章软件\\\\rongcheng-miniprogram\\\\utils\\\\labor-dispute.js");',
  'labor.categories.forEach(function(cat){',
  '  cat.docs.forEach(function(doc){',
  '    var r=smartReplace(labor.generateContent(doc));',
  '    var clean=r.replace(/（示例：[^）]+）/g,"").replace(/（请填写[^）]+）/g,"").replace(/（日期：[^）]+）/g,"");',
  '    if(/[^（《\\[]XXX(?!X)/.test(clean)){fail++;console.log("FAIL "+doc+": XXX残留");}',
  '    else{pass++;console.log("OK "+doc);}',
  '  });',
  '});',
  'console.log("\\n=== "+pass+"/"+(pass+fail)+" ===");'
].join('\n');

fs.writeFileSync('D:\\刻章软件\\rongcheng-miniprogram\\_ld2.js', test);
console.log('written, length=' + test.length);
