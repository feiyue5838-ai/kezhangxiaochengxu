var fs=require('fs'),d='D:\\刻章软件\\rongcheng-miniprogram\\';
['_ld.js','_ld2.js','_extract.js'].forEach(function(f){try{fs.unlinkSync(d+f);}catch(e){}});
console.log('ok');
