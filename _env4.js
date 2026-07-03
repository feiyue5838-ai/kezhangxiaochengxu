var env = require('D:\\刻章软件\\rongcheng-miniprogram\\utils\\env-assessment.js');

function smartReplace(c){
  var D=new Date(),y=D.getFullYear(),m=String(D.getMonth()+1).padStart(2,'0'),d=String(D.getDate()).padStart(2,'0'),ds=y+'年'+m+'月'+d+'日',r=c;
  r=r.replace(/XXXX年XX月XX日/g,ds);
  r=r.replace(/本人XXX/g,'本人（示例：张三）');
  r=r.replace(/声明单位：XXX有限公司/g,'声明单位：（示例：XX有限公司）');
  ['声明人','致歉人','联系人','法定代表人','债权申报联系人','申请人','被申请人','当事人','负责人','声明人（单位）','新郎','新娘','学生','学子','祝福人','祝福你的人','永远的朋友','家人','家长','出借人','借款人','股东','权利人'].forEach(function(f){r=r.replace(new RegExp(f+'：XXX','g'),f+'：（示例：张三）');});
  r=r.replace(/XXX（[^）]*）/g,'（示例：张三）');
  r=r.replace(/XXX (?=先生|女士|老师|小姐|公子|寿星|喜结连理)/g,'张三 ');
  r=r.replace(/致我最好的朋友 XXX/g,'致我最好的朋友 张三');
  r=r.replace(/(亲爱的|敬爱的) XXX/g,'$1 张三');
  r=r.replace(/致 XXX/g,'致 （示例：张三）');
  r=r.replace(/XXX的/g,'（示例：张三）的');
  r=r.replace(/XXX您好/g,'（示例：张三）您好');
  r=r.replace(/致歉人：XXX/g,'致歉人：（示例：张三）');
  r=r.replace(/致 XXX/g,'致 （示例：张三）');
  r=r.replace(/债权人：XXX/g,'债权人：（示例：张三）');
  r=r.replace(/债务人：XXX/g,'债务人：（示例：张三）');
  r=r.replace(/【声明人】/g,'（示例：张三）');
  r=r.replace(/【姓名】/g,'（示例：张三）');
  r=r.replace(/【债权人】/g,'（示例：张三）');
  r=r.replace(/【债务人】/g,'（示例：张三）');
  r=r.replace(/【原告】/g,'（示例：张三）');
  r=r.replace(/【被告】/g,'（示例：张三）');
  r=r.replace(/XXX/g,'（示例：张三）');
  r=r.replace(/XXXX年XX月XX日/g,ds);
  r=r.replace(/本人XXX/g,'本人（示例：张三）');
  r=r.replace(/声明单位：XXX有限公司/g,'声明单位：（示例：XX有限公司）');
  ['声明人','致歉人','联系人','法定代表人','债权申报联系人'].forEach(function(f){r=r.replace(new RegExp(f+'：XXX','g'),f+'：（示例：张三）');});
  r=r.replace(/XXX名称/g,'（示例：XX名称）');
  r=r.replace(/XXX概要/g,'（示例：XX概要）');
  r=r.replace(/XXXX公司/g,'（示例：XX公司）有限公司');
  r=r.replace(/XXXX有限公司/g,'（示例：XX公司）有限公司');
  r=r.replace(/XXXXXX/g,'（示例：518000）');
  r=r.replace(/XXXXXXX/g,'（示例：518000）');
  r=r.replace(/XXXXXXXX/g,'（示例：518000）');
  r=r.replace(/XXXXX(?!\d)/g,'（示例：138****5678）');
  r=r.replace(/XXXX(?!\d)/g,'（示例：138****5678）');
  r=r.replace(/XXX(?!\d)/g,'（示例：110101199001011234）');
  r=r.replace(/X{10,}/g,'（请填写完整信息）');
  return r;
}

var cats = env.categories;
var allPassed = true;
cats.forEach(function(cat){
  cat.docs.forEach(function(doc){
    var content = env.generateContent(doc.name);
    var replaced = smartReplace(content);
    // Check: no naked XXX/XXXX in output (allow inside URLs/email-like)
    var naked = replaced.match(/[^（\n]XXX(?![\d）\u4e00-\u9fa5])|XXX([^）\u4e00-\u9fa5]|$)/g);
    var naked2 = replaced.match(/[^（\n]XXXX(?![\d）\u4e00-\u9fa5])|XXXX([^）\u4e00-\u9fa5]|$)/g);
    if(naked || naked2){
      console.log('FAIL '+doc.name);
      if(naked)console.log('  naked XXX:',naked.join(', '));
      if(naked2)console.log('  naked XXXX:',naked2.join(', '));
      allPassed = false;
    } else {
      console.log('OK '+doc.name);
    }
  });
});
console.log(allPassed ? '\nAll tests passed!' : '\nSome tests FAILED!');
