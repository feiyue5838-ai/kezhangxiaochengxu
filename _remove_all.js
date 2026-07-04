var fs = require('fs');
var content = fs.readFileSync('utils/region-data.js', 'utf8');

// 移除 '全部': ['全部'], 这一行
content = content.replace(/\s*'全部':\s*\[\s*'全部'\s*\],\s*\n/g, '');

// 移除每个城市数组中的第一个 '全部',
// 模式：在 cities: { 之后，每个数组中的 '全部', 
// 简单处理：把 \n    '全部',\n 替换成 \n（只替换每行的第一个）
content = content.replace(/\n    '全部',\n/g, '\n');

// 但这样会误伤 provinces，所以需要更精确的方式
// 重新读取，逐行处理
var lines = content.split('\n');
var inCities = false;
var result = [];
for (var i = 0; i < lines.length; i++) {
  var line = lines[i];
  if (line.trim() === 'cities: {') {
    inCities = true;
    result.push(line);
    continue;
  }
  if (inCities && line.trim() === '}') {
    inCities = false;
    result.push(line);
    continue;
  }
  if (inCities && line.trim() === "'全部': ['全部'],") {
    // 跳过这一行
    continue;
  }
  if (inCities && line.trim().startsWith("'") && line.includes("['")) {
    // 这是城市数组开始，需要移除数组中的 '全部',
    // 简单处理：这行之后到 ] 之前，移除 '全部',
    result.push(line);
    // 标记：需要移除下一行的 '全部',
    var j = i + 1;
    while (j < lines.length && !lines[j].trim().startsWith(']')) {
      if (lines[j].trim() === "'全部',") {
        // 跳过这一行
        j++;
        continue;
      }
      result.push(lines[j]);
      j++;
    }
    i = j;
    continue;
  }
  result.push(line);
}

var newContent = result.join('\n');
fs.writeFileSync('utils/region-data.js', newContent, 'utf8');
console.log('done');
