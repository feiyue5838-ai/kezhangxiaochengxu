/**
 * Clean up dead code from newspaper page JS files.
 * Removes: searchKey, floatBtnTop, onSearch, onFloatTouchStart, 
 * onFloatTouchMove, onFloatTouchEnd, contactService, _floatDragStart/_floatMoved
 */
const fs = require('fs');
const path = require('path');

const pages = [
  'personal-docs', 'invoice-receipt', 'confession',
  'announcement', 'court', 'government',
  'creditor', 'labor-dispute', 'env-assessment',
  'auction', 'apology', 'praise',
  'publicity', 'bidding'
];

const baseDir = 'D:\\刻章软件\\rongcheng-miniprogram\\pages\\newspaper';

// Methods to remove entirely (function definitions)
const removeMethods = [
  'onSearch', 'onFloatTouchStart', 'onFloatTouchMove', 'onFloatTouchEnd', 'contactService'
];

let totalStats = {};

for (const page of pages) {
  const filePath = path.join(baseDir, page, 'index.js');
  let content = fs.readFileSync(filePath, 'utf-8');
  const original = content;
  const stats = { removed: [], count: 0 };

  // 1. Remove data.searchKey: ''
  if (content.includes("searchKey: ''")) {
    // Remove the line containing searchKey: '' and preceding comma+newline
    content = content.replace(/,\s*\n\s+searchKey:\s*''/g, '');
    stats.removed.push("data.searchKey: ''");
    stats.count++;
  }

  // 2. Remove data.floatBtnTop: NNN
  if (/floatBtnTop:\s*\d+/.test(content)) {
    content = content.replace(/,\s*\n\s+floatBtnTop:\s*\d+/g, '');
    stats.removed.push('data.floatBtnTop');
    stats.count++;
  }

  // 3. Remove _floatDragStart = null; and _floatMoved = false; in onLoad
  const floatAssignRe = /(\n\s+)this\._floatDragStart\s*=\s*null;\s*\n\s+this\._floatMoved\s*=\s*false;/;
  if (floatAssignRe.test(content)) {
    content = content.replace(floatAssignRe, '');
    stats.removed.push('onLoad: _floatDragStart/_floatMoved');
    stats.count++;
  }
  // Handle single remaining references
  if (/this\._floatDragStart\s*=\s*null;/.test(content)) {
    content = content.replace(/\n\s+this\._floatDragStart\s*=\s*null;/g, '');
    stats.removed.push('_floatDragStart = null');
    stats.count++;
  }
  if (/this\._floatMoved\s*=\s*false;/.test(content)) {
    content = content.replace(/\n\s+this\._floatMoved\s*=\s*false;/g, '');
    stats.removed.push('_floatMoved = false');
    stats.count++;
  }

  // 4. Remove _floatTouch assignments (announcement, court, creditor variant)
  if (/this\._floatTouch\s*=/.test(content)) {
    content = content.replace(/\n\s+this\._floatTouch\s*=\s*null;/g, '');
    stats.removed.push('_floatTouch = null');
    stats.count++;
  }

  // 5. Remove searchKey from closeDocPicker setData
  const closeDocPickerRe = /(closeDocPicker\s*\(\s*\)\s*\{[^}]*?),?\s*\n?\s*searchKey:\s*''([^}]*\})/;
  if (closeDocPickerRe.test(content)) {
    content = content.replace(closeDocPickerRe, (match, before, after) => {
      // Remove the trailing comma before searchKey unless it's the only item
      let cleaned = before.replace(/,\s*$/, '') + after;
      return cleaned;
    });
    stats.removed.push('closeDocPicker: searchKey: \'\'');
    stats.count++;
  }

  // 6. Remove searchKey from openDocPicker setData as well (since onSearch is gone)
  // Only for multi-line setData where searchKey: '' appears
  if (content.includes('searchKey')) {
    // More aggressive: remove searchKey and preceding comma from any setData
    let prevContent = '';
    while (prevContent !== content) {
      prevContent = content;
      content = content.replace(/(setData\(\{[^}]*?),\s*\n?\s*searchKey:\s*''/, '$1');
    }
    // Don't add to stats here since this may overlap with earlier removals
  }

  // 7. Remove entire onSearch method (multi-line)
  const onSearchRe = /,\s*\n\s+onSearch\s*\(e\)\s*\{[\s\S]*?\n\s+\},/;
  if (onSearchRe.test(content)) {
    content = content.replace(onSearchRe, ',');
    stats.removed.push('onSearch method');
    stats.count++;
  }

  // 8. Remove entire onFloatTouchStart one-liner methods
  const oneLineMethods = [
    /,\s*\n\s+onFloatTouchStart\s*\(e\)\s*\{[^}]*\},/g,
    /,\s*\n\s+onFloatTouchMove\s*\(e\)\s*\{[^}]*\},/g,
    /,\s*\n\s+onFloatTouchEnd\s*\(\)\s*\{[^}]*\},/g,
  ];
  for (const re of oneLineMethods) {
    if (re.test(content)) {
      content = content.replace(re, ',');
    }
  }

  // 9. Remove multi-line onFloatTouchStart/Move/End methods
  const multiLineFloatRe = /,\s*\n\s+onFloatTouch(Start|Move|End)\s*\([^)]*\)\s*\{[\s\S]*?\n\s+\},/g;
  let m;
  while ((m = multiLineFloatRe.exec(content)) !== null) {
    content = content.replace(m[0], ',');
    multiLineFloatRe.lastIndex = 0;
  }

  // 10. Remove contactService method (multi-line or one-liner)
  const contactRe = /,\s*\n\s+contactService\s*\(\)\s*\{[\s\S]*?\n\s+\}/;
  if (contactRe.test(content)) {
    content = content.replace(contactRe, '');
    stats.removed.push('contactService method');
    stats.count++;
  }

  // 11. Clean up: fix trailing commas before closing braces
  content = content.replace(/,\s*\n\s+\}/g, '\n  }');

  // 12. Clean up empty lines left behind
  content = content.replace(/\n{3,}/g, '\n\n');

  // 13. Also clean _floatMoved references in contactService
  if (/this\._floatMoved/.test(content)) {
    content = content.replace(/\n\s+if\s*\(this\._floatMoved\)\s*return;/g, '');
    stats.removed.push('_floatMoved guard');
    stats.count++;
  }

  // Write back
  fs.writeFileSync(filePath, content, 'utf-8');

  totalStats[page] = stats;
  console.log(`\n=== ${page} ===`);
  console.log(`  Removed: ${stats.removed.join(', ')}`);
  console.log(`  Total items removed: ${stats.count}`);
  console.log(`  Original: ${original.length} bytes → Final: ${content.length} bytes`);
}

// Summary
console.log('\n\n========================================');
console.log('CLEANUP SUMMARY');
console.log('========================================');
let totalItems = 0;
for (const [page, stats] of Object.entries(totalStats)) {
  console.log(`  ${page.padEnd(20)} ${stats.count} item(s) removed [${stats.removed.join(', ')}]`);
  totalItems += stats.count;
}
console.log(`  ${'─'.repeat(40)}`);
console.log(`  TOTAL: ${totalItems} dead code items removed across 14 files`);
