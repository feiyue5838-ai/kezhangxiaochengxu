var fs = require('fs');
var c = fs.readFileSync('utils/newspaper-papers.js', 'utf8');

// 修复 filterPapers 函数
var oldFilter = `  // 根据省份、城市、类型筛选报纸\n  filterPapers(province, city, type) {\n    return this.papers.filter(p => {\n      const provinceMatch = province === '全部' || p.province === province;\n      const cityMatch = city === '全部' || p.city === city || p.city === '全部';\n      const typeMatch = type === '全部' || !p.type || p.type === type;\n      return provinceMatch && cityMatch && typeMatch;\n    });\n  }`;

var newFilter = `  // 根据省份、城市、类型筛选报纸\n  filterPapers(province, city, type) {\n    return this.papers.filter(p => {\n      // 省份匹配\n      const provinceMatch = p.province === province || p.province === '全国性';\n      \n      // 城市匹配（直辖市的"直辖市"匹配该省所有报纸）\n      const cityMatch = city === '直辖市' || !p.city || p.city === city;\n      \n      // 类型匹配\n      const typeMatch = type === '全部' || !p.type || p.type === type;\n      \n      return provinceMatch && cityMatch && typeMatch;\n    });\n  }`;

if (c.includes(oldFilter)) {
  c = c.replace(oldFilter, newFilter);
  fs.writeFileSync('utils/newspaper-papers.js', c, 'utf8');
  console.log('✅ filterPapers 已修复');
} else {
  console.log('⚠️ 未找到旧代码，检查文件...');
  // 尝试查找 filterPapers 函数
  var idx = c.indexOf('filterPapers');
  if (idx >= 0) {
    console.log('找到 filterPapers 位置:', idx);
    console.log(c.substring(idx, idx + 300));
  }
}
