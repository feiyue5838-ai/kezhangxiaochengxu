const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'pages');
let fileCount = 0;
let blockCount = 0;

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (entry.name.endsWith('.wxss')) {
      const n = processFile(full);
      if (n > 0) { fileCount++; blockCount += n; }
    }
  }
}

function processFile(file) {
  let lines = fs.readFileSync(file, 'utf8').split('\n');
  let original = lines.join('\n');
  let removed = 0;
  let i = 0;
  let out = [];

  while (i < lines.length) {
    const line = lines[i];
    const blockMatch = line.match(/^\s*\.nav-bar\s*\{/);
    if (blockMatch) {
      const start = i;
      let depth = 1;
      i++;
      while (i < lines.length && depth > 0) {
        const l = lines[i].trim();
        if (l.includes('{')) depth += (l.match(/\{/g) || []).length;
        if (l.includes('}')) depth -= (l.match(/\}/g) || []).length;
        i++;
      }
      // Log what was removed
      const block = lines.slice(start, i).join('\n');
      const rel = path.relative(__dirname, file);
      console.log(`  REMOVE ${rel}:${start + 1}`);
      removed++;
      continue; // skip this block
    }
    out.push(lines[i]);
    i++;
  }

  if (removed > 0) {
    let content = out.join('\n').replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
    fs.writeFileSync(file, content, 'utf8');
  }

  return removed;
}

walk(dir);
console.log(`\nDone: ${fileCount} files, ${blockCount} .nav-bar blocks removed.`);
