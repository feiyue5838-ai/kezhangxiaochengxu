/**
 * Fix remaining issues in cleanup:
 * 1. confession: still has onSearch, floatBtnTop:700, onFloatTouchStart
 * 2. announcement/court/creditor: leftover float methods
 * 3. Various: truncated methods or leftover dead code
 */
const fs = require('fs');
const path = require('path');

const baseDir = 'D:\\刻章软件\\rongcheng-miniprogram\\pages\\newspaper';

// Fix confession - has the most remaining issues
{
  const filePath = path.join(baseDir, 'confession', 'index.js');
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Remove floatBtnTop: 700, (special case - no comma before it since searchKey was already removed)
  content = content.replace(/floatBtnTop:\s*\d+,?\s*\n/, '');
  // Clean up blank line left behind
  content = content.replace(/\n\s*\n\s*\/\/ Sheet/, '\n    // Sheet');
  
  // Remove entire onSearch method
  const onSearchRe = /,\s*\n\s+\/\/ 弹窗内搜索\n\s+onSearch\s*\(e\)\s*\{[\s\S]*?\n\s+\},/;
  content = content.replace(onSearchRe, ',');
  
  // Remove onFloatTouchStart method  
  const floatStartRe = /,\s*\n\s+\/\/ 浮动按钮拖拽\n\s+onFloatTouchStart\s*\(e\)\s*\{[\s\S]*?\n\s+\}/;
  content = content.replace(floatStartRe, '');
  
  // Clean trailing commas before }
  content = content.replace(/,\s*\n\s+\}/g, '\n  }');
  content = content.replace(/\n{3,}/g, '\n\n');
  
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('Fixed confession');
}

// Fix announcement - leftover float methods
{
  const filePath = path.join(baseDir, 'announcement', 'index.js');
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Remove leftover onFloatTouchEnd
  content = content.replace(/,\s*\n\s+onFloatTouchEnd\s*\(\)\s*\{\s*\}\s*\n/, '\n');
  content = content.replace(/,\s*\n\s+\}/g, '\n  }');
  content = content.replace(/\n{3,}/g, '\n\n');
  
  // Check for any remaining float-related or searchKey
  content = content.replace(/,\s*\n\s+onFloatTouchStart\s*\([^)]*\)\s*\{[\s\S]*?\n\s+\},?/g, '');
  content = content.replace(/,\s*\n\s+onFloatTouchMove\s*\([^)]*\)\s*\{[\s\S]*?\n\s+\},?/g, '');
  
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('Fixed announcement');
}

// Fix court - same pattern as announcement
{
  const filePath = path.join(baseDir, 'court', 'index.js');
  let content = fs.readFileSync(filePath, 'utf-8');
  
  content = content.replace(/,\s*\n\s+onFloatTouchEnd\s*\(\)\s*\{\s*\}\s*\n/, '\n');
  content = content.replace(/,\s*\n\s+onFloatTouchStart\s*\([^)]*\)\s*\{[\s\S]*?\n\s+\},?/g, '');
  content = content.replace(/,\s*\n\s+onFloatTouchMove\s*\([^)]*\)\s*\{[\s\S]*?\n\s+\},?/g, '');
  content = content.replace(/,\s*\n\s+\}/g, '\n  }');
  content = content.replace(/\n{3,}/g, '\n\n');
  
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('Fixed court');
}

// Fix creditor - same pattern
{
  const filePath = path.join(baseDir, 'creditor', 'index.js');
  let content = fs.readFileSync(filePath, 'utf-8');
  
  content = content.replace(/,\s*\n\s+onFloatTouchEnd\s*\(\)\s*\{\s*\}\s*\n/, '\n');
  content = content.replace(/,\s*\n\s+onFloatTouchStart\s*\([^)]*\)\s*\{[\s\S]*?\n\s+\},?/g, '');
  content = content.replace(/,\s*\n\s+onFloatTouchMove\s*\([^)]*\)\s*\{[\s\S]*?\n\s+\},?/g, '');
  content = content.replace(/,\s*\n\s+\}/g, '\n  }');
  content = content.replace(/\n{3,}/g, '\n\n');
  
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('Fixed creditor');
}

// Check ALL files for any remaining float-related methods, onSearch, contactService
console.log('\nChecking all files for remaining dead code...');
const pages = [
  'personal-docs', 'invoice-receipt', 'confession',
  'announcement', 'court', 'government',
  'creditor', 'labor-dispute', 'env-assessment',
  'auction', 'apology', 'praise',
  'publicity', 'bidding'
];

for (const page of pages) {
  const filePath = path.join(baseDir, page, 'index.js');
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;

  // Remove any remaining onFloatTouchXxx, onSearch, contactService definitions
  const deadMethods = ['onSearch', 'onFloatTouchStart', 'onFloatTouchMove', 'onFloatTouchEnd', 'contactService'];
  
  for (const method of deadMethods) {
    // Match method definitions: ,\n  method(params) { ... body ... }
    const multiRe = new RegExp(`,\\s*\\n\\s+${method}\\s*\\([^)]*\\)\\s*\\{[\\s\\S]*?\\n\\s+\\}(,?)`, 'g');
    if (multiRe.test(content)) {
      // Reset lastIndex and replace
      content = content.replace(multiRe, (match, comma) => comma || '');
      console.log(`  ${page}: removed remaining ${method}`);
      modified = true;
    }
    
    // Also try one-liner: ,\n  method(params) { ... },
    const oneRe = new RegExp(`,\\s*\\n\\s+${method}\\s*\\([^)]*\\)\\s*\\{[^}]*\\},?`, 'g');
    if (oneRe.test(content)) {
      content = content.replace(oneRe, ',');
      console.log(`  ${page}: removed one-liner ${method}`);
      modified = true;
    }
  }
  
  if (modified) {
    // Clean up trailing commas before }
    content = content.replace(/,\s*\n\s+\}/g, '\n  }');
    content = content.replace(/\n{3,}/g, '\n\n');
    fs.writeFileSync(filePath, content, 'utf-8');
  }
}

console.log('\nFix complete.');
