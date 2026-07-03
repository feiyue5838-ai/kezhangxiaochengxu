var fs=require('fs');
var c=fs.readFileSync('D:\\刻章软件\\rongcheng-miniprogram\\_env.js','utf8');
// Remove the line with 【部门\\/岗位】 which has invalid regex (unneeded for env)
c=c.replace(/  r=r\.replace\(\/\u3010\u90e8\u9580\\\\\/\u5c97\u4f4d\u3011\/g.*/,'');
fs.writeFileSync('D:\\刻章软件\\rongcheng-miniprogram\\_env.js',c);
console.log('ok');
