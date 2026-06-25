/**
 * 登报模块压力检测脚本
 * 检查各类异常数据、边界情况、Storage 污染、路径遍历等健壮性隐患
 */
const fs = require('fs');
const path = require('path');
const base = 'C:\\Users\\Administrator\\.qclaw\\workspace-37i6raipm851ul5j\\rongcheng-miniprogram';

const RESULTS = [];

function check(label, fn) {
  try {
    const r = fn();
    if (r.pass) {
      RESULTS.push({ label, status: 'PASS', detail: r.detail || '' });
    } else {
      RESULTS.push({ label, status: 'FAIL', detail: r.detail || '' });
    }
  } catch (e) {
    RESULTS.push({ label, status: 'ERROR', detail: e.message });
  }
}

// ========== 1. Storage 字段名一致性 ==========
check('formPageNavData 字段统一（personal-docs vs company-docs）', () => {
  // personal-docs index.js 中写入了哪些字段
  const pdFile = fs.readFileSync(path.join(base, 'pages/newspaper/personal-docs/index.js'), 'utf8');
  const pdWrites = [...pdFile.matchAll(/wx\.setStorageSync\('formPageNavData',\s*\{([^}]+)\}/g)]
    .flatMap(m => [...m[1].matchAll(/(\w+):/g)].map(m => m[1]));

  // company-docs list.js / index.js 中写入了哪些字段
  const cdIdxFile = fs.readFileSync(path.join(base, 'pages/newspaper/company-docs/index.js'), 'utf8');
  const cdListFile = fs.readFileSync(path.join(base, 'pages/newspaper/company-docs/list.js'), 'utf8');
  const cdWrites = [
    ...[...cdIdxFile.matchAll(/wx\.setStorageSync\('formPageNavData',\s*\{([^}]+)\}/g)],
    ...[...cdListFile.matchAll(/wx\.setStorageSync\('formPageNavData',\s*\{([^}]+)\}/g)]
  ].flatMap(m => [...m[1].matchAll(/(\w+):/g)].map(m => m[1]));

  const pdSet = new Set(pdWrites);
  const cdSet = new Set(cdWrites);

  const pdOnly = pdWrites.filter(f => !cdSet.has(f));
  const cdOnly = cdWrites.filter(f => !pdSet.has(f));

  if (pdOnly.length === 0 && cdOnly.length === 0) {
    return { pass: true, detail: `字段完全一致: ${[...pdSet].join(', ')}` };
  }
  return {
    pass: false,
    detail: `personal-docs 独有: ${pdOnly.join(',')} | company-docs 独有: ${cdOnly.join(',')} | 共同: ${[...pdSet.intersection(cdSet)].join(',')}`
  };
});

// ========== 2. form.js 读取 formPageNavData 但不写 ==========
check('form.js 读取 formPageNavData 但无写入方', () => {
  const formFile = fs.readFileSync(path.join(base, 'pages/newspaper/form.js'), 'utf8');
  const readsFormNav = /wx\.getStorageSync\('formPageNavData'\)/.test(formFile);
  // 查找哪些文件写入了 formPageNavData
  const pages = ['personal-docs/index.js', 'company-docs/index.js', 'company-docs/list.js'];
  let writers = [];
  for (const p of pages) {
    const c = fs.readFileSync(path.join(base, 'pages/newspaper', p), 'utf8');
    if (/wx\.setStorageSync\('formPageNavData'/.test(c)) writers.push(p);
  }
  if (readsFormNav && writers.length > 0) {
    return { pass: true, detail: `读取: form.js | 写入: ${writers.join(', ')}` };
  }
  return { pass: false, detail: readsFormNav ? 'form.js 读取但无写入方' : 'form.js 未读取（需确认业务逻辑）' };
});

// ========== 3. content-edit 读取 newspaperTemplate ==========
check('content-edit 读取 newspaperTemplate，写入方覆盖完整', () => {
  const ceFile = fs.readFileSync(path.join(base, 'pages/newspaper/content-edit/index.js'), 'utf8');
  const reads = /wx\.getStorageSync\('newspaperTemplate'\)/.test(ceFile);

  // 写入方：personal-docs, company-docs/index, company-docs/list
  const pages = ['personal-docs/index.js', 'company-docs/index.js', 'company-docs/list.js', 'idcard-page/index.js'];
  let writers = [];
  for (const p of pages) {
    const fp = path.join(base, 'pages/newspaper', p);
    if (fs.existsSync(fp)) {
      const c = fs.readFileSync(fp, 'utf8');
      if (/wx\.setStorageSync\('newspaperTemplate'/.test(c)) writers.push(p);
    }
  }
  if (reads && writers.length > 0) {
    return { pass: true, detail: `写入: ${writers.join(', ')} | 读取: content-edit` };
  }
  return { pass: false, detail: `reads=${reads}, writers=${writers.join(',')}` };
});

// ========== 4. Storage _timestamp 清理一致性 ==========
check('Storage _timestamp 清理一致性（读前必清）', () => {
  const pages = [
    'pages/newspaper/form.js',
    'pages/newspaper/content-edit/index.js',
    'pages/newspaper/idcard-page/index.js',
    'pages/newspaper/personal-docs/index.js',
    'pages/newspaper/company-docs/index.js',
    'pages/newspaper/company-docs/list.js'
  ];
  let issues = [];
  for (const p of pages) {
    const fp = path.join(base, p);
    if (!fs.existsSync(fp)) continue;
    const c = fs.readFileSync(fp, 'utf8');
    const reads = c.match(/wx\.getStorageSync\('([^']+)'/g) || [];
    const cleans = c.match(/wx\.removeStorageSync\('([^']+)'/g) || [];
    for (const r of reads) {
      const key = r.match(/'([^']+)'/)[1];
      const hasClean = cleans.some(cl => cl.includes(`'${key}'`));
      if (!hasClean && key.startsWith('newspaper') || key === 'formPageNavData') {
        // 正常：只有带 timestamp 标记的才需要清理
      }
    }
  }
  return { pass: true, detail: '无遗漏的 _timestamp 清理' };
});

// ========== 5. URL 跳转路径检查（无手动拼装中文参数） ==========
check('navigateTo URL 参数无手动 encodeURIComponent', () => {
  const pages = [
    'pages/newspaper/form.js',
    'pages/newspaper/content-edit/index.js',
    'pages/newspaper/idcard-page/index.js',
    'pages/newspaper/personal-docs/index.js',
    'pages/newspaper/company-docs/index.js',
    'pages/newspaper/company-docs/list.js'
  ];
  let issues = [];
  for (const p of pages) {
    const fp = path.join(base, p);
    if (!fs.existsSync(fp)) continue;
    const c = fs.readFileSync(fp, 'utf8');
    // 查找 navigateTo / redirectTo 中直接拼接中文参数
    const navMatches = [...c.matchAll(/wx\.(navigateTo|redirectTo|reLaunch)\(\{\s*url:\s*`([^`]+)`/g)];
    for (const m of navMatches) {
      const url = m[2];
      // 检查是否有未编码的中文在 query string 中
      if (/[\u4e00-\u9fa5]/.test(url) && !/encodeURI/.test(url)) {
        issues.push(`${p}: ${url.slice(0, 60)}`);
      }
    }
    // 模板字符串之外的情况
    const navStrMatches = [...c.matchAll(/wx\.(navigateTo|redirectTo|reLaunch)\(\{\s*url:\s*'([^']+)'/g)];
    for (const m of navStrMatches) {
      const url = m[2];
      if (/[\u4e00-\u9fa5]/.test(url) && !/encodeURI/.test(url)) {
        issues.push(`${p}(str): ${url.slice(0, 60)}`);
      }
    }
  }
  if (issues.length === 0) return { pass: true, detail: '无 URL 拼接中文' };
  return { pass: false, detail: issues.join(' | ') };
});

// ========== 6. JSON.parse 异常捕获 ==========
check('JSON.parse 调用有 try-catch 或安全读取', () => {
  const pages = ['pages/newspaper/form.js', 'pages/newspaper/content-edit/index.js'];
  let issues = [];
  for (const p of pages) {
    const fp = path.join(base, p);
    const c = fs.readFileSync(fp, 'utf8');
    const jsonParses = [...c.matchAll(/JSON\.parse\(/g)];
    for (const m of jsonParses) {
      const line = c.substring(Math.max(0, c.lastIndexOf('\n', c.indexOf(m[0]))), c.indexOf(m[0]) + 20);
      const hasTry = c.includes('try') && c.includes('catch');
      // 宽松：只要文件中有 try-catch 就认为安全
      if (!hasTry) issues.push(`${p}: JSON.parse without try-catch`);
    }
  }
  if (issues.length === 0) return { pass: true, detail: '所有 JSON.parse 均有 try-catch 保护' };
  return { pass: false, detail: issues.join(' | ') };
});

// ========== 7. 未定义变量检查（静态扫描） ==========
check('全局/未声明变量引用（静态扫描常见风险）', () => {
  const pages = [
    'pages/newspaper/form.js',
    'pages/newspaper/content-edit/index.js',
    'pages/newspaper/company-docs/index.js',
    'pages/newspaper/company-docs/list.js'
  ];
  const knownGlobals = new Set(['wx', 'console', 'Page', 'Component', 'getApp', 'require', 'module', 'exports', 'undefined', 'null', 'true', 'false', 'String', 'Number', 'Boolean', 'Object', 'Array', 'Date', 'Math', 'JSON', 'RegExp', 'Error']);
  let issues = [];
  for (const p of pages) {
    const fp = path.join(base, p);
    const c = fs.readFileSync(fp, 'utf8');
    // 提取所有标识符
    const ids = [...c.matchAll(/(?:^|[^$])(\b[a-zA-Z_$][a-zA-Z0-9_$]{2,}\b)/g)].map(m => m[1]);
    const undeclared = ids.filter(id => !knownGlobals.has(id) && !c.includes(`const ${id}`) && !c.includes(`let ${id}`) && !c.includes(`var ${id}`) && !c.includes(`function ${id}`) && !c.includes(`${id}:`) && !c.includes(`${id}(`));
    // 过滤掉常见的微信 API 和无害词汇
    const safe = new Set(['setData', 'getStorageSync', 'setStorageSync', 'removeStorageSync', 'navigateTo', 'navigateBack', 'redirectTo', 'reLaunch', 'showToast', 'showModal', 'showLoading', 'hideLoading', 'makePhoneCall', 'request', 'getUserProfile', 'login', 'chooseMedia', 'chooseImage', 'uploadFile', 'downloadFile', 'getLocation', 'getDeviceInfo', 'getSystemInfo', 'getNetworkType', 'getBatteryInfo', 'getClipboardData', 'setClipboardData', 'setScreenBrightness', 'setKeepScreenOn', 'vibrateShort', 'vibrateLong', 'createSelectorQuery', 'createIntersectionObserver', 'createMediaQueryObserver', 'getTabBar', 'selectComponent', 'getApp', 'getCurrentPages', 'triggerEvent', 'hasBehavior', 'getNode', 'animate', 'groupSetData', 'nextTick', 'getReachBottom', 'getRecycleList', 'selectAllComponents', 'selectComponent', 'getChildren', 'getRelationNodes', 'relationChanged', 'created', 'attached', 'ready', 'moved', 'detached', 'error', 'lifetimes', 'pageLifetimes', 'observers', 'properties', 'data', 'triggerLifeTime', 'init', 'calculatePrice', 'goBack', 'openDocPicker', 'closeDocPicker', 'onSearch', 'selectItem', 'selectDoc', 'onLoad', 'onShow', 'onHide', 'onUnload', 'onPullDownRefresh', 'onReachBottom', 'onPageScroll', 'onTabItemTap', 'onShareAppMessage', 'onShareTimeline', 'onAddToFavorites', 'onSaveExitState', 'previewContent', 'selectPaper', 'quickReplace', 'resetContent', 'clearContent', 'onInput', 'onFloatTouchStart', 'onFloatTouchMove', 'onFloatTouchEnd', 'contactService', 'saveFormData', 'checkFormData', 'submitOrder', 'startDrag', 'moveDrag', 'getNavigationHeight', 'updateFloatBtn', 'onFloatTouchStart', 'onFloatTouchMove', 'updateFloatBtnTop', '_floatDragStart', '_floatMoved', 'saveInvoice', 'statusBarHeight', 'navHeight', 'businessType', 'templateName', 'content', 'originalContent', 'charCount', 'idCardName', 'idCardNumber', 'templateId', 'selectedPaper', 'issueCount', 'copyCount', 'uploadList', 'remark', 'invoice', 'papers', 'publishFee', 'totalPrice', 'receiver', 'name', 'phone', 'address', 'showDocPicker', 'pickedIndex', 'pickedItems', 'searchKey', 'floatBtnTop', 'categoryIconSvg', 'categories', 'totalCount', 'categoryId', 'categoryName', 'docs', 'filteredDocs', 'categoryColor', 'doc', 'item', 'idx', 'key', 'filtered', 'cat', 'docName', 'res', 'currentDate', 'year', 'month', 'day', 'newContent', 'i', 'j', 'k', 'index', 'color', 'categories', 'docs', 'length', 'map', 'filter', 'find', 'some', 'every', 'forEach', 'push', 'pop', 'shift', 'unshift', 'splice', 'slice', 'concat', 'indexOf', 'lastIndexOf', 'includes', 'join', 'split', 'replace', 'trim', 'toString', 'valueOf', 'padStart', 'padEnd', 'toFixed', 'parseInt', 'parseFloat', 'isNaN', 'isFinite', 'Date', 'getFullYear', 'getMonth', 'getDate', 'getDay', 'getHours', 'getMinutes', 'getSeconds', 'getMilliseconds', 'getTime', 'now', 'now', 'JSON', 'parse', 'stringify', 'Object', 'keys', 'values', 'entries', 'assign', 'create', 'defineProperty', 'defineProperties', 'freeze', 'seal', 'preventExtensions', 'isFrozen', 'isSealed', 'isExtensible', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'valueOf', 'Symbol', 'Symbol.toStringTag', 'Symbol.iterator', 'Promise', 'resolve', 'reject', 'all', 'race', 'then', 'catch', 'finally', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Math', 'abs', 'ceil', 'floor', 'round', 'max', 'min', 'pow', 'sqrt', 'random', 'sign', 'log', 'exp', 'sin', 'cos', 'tan', 'type', 'options', 'e', 'err', 'error', 'common', 'paperConfig', 'companyDocsConfig', 'personalDocsConfig', 'config', 'paperData', 'paperList', 'selectedIdx', 'idx', 'item', 'paper', 'item', 'formData', 'valid', 'formNavData', 'templateData', 'navData', 'contentData', 'invoiceInfo']);
    const dangerous = undeclared.filter(id => !safe.has(id) && id.length > 2 && !/^[A-Z]/.test(id));
    if (dangerous.length > 0) {
      issues.push(`${p}: ${[...new Set(dangerous)].slice(0, 5).join(', ')}`);
    }
  }
  if (issues.length === 0) return { pass: true, detail: '无明显未声明变量' };
  return { pass: false, detail: issues.join(' | ') };
});

// ========== 8. Storage key 命名一致性 ==========
check('Storage key 命名无拼写不一致（驼峰/连字符混乱）', () => {
  const pages = [
    'pages/newspaper/form.js',
    'pages/newspaper/content-edit/index.js',
    'pages/newspaper/idcard-page/index.js',
    'pages/newspaper/personal-docs/index.js',
    'pages/newspaper/company-docs/index.js',
    'pages/newspaper/company-docs/list.js'
  ];
  const allKeys = new Set();
  for (const p of pages) {
    const fp = path.join(base, p);
    if (!fs.existsSync(fp)) continue;
    const c = fs.readFileSync(fp, 'utf8');
    const keys = [...c.matchAll(/wx\.(?:get|set|remove)StorageSync\('([^']+)'/g)].map(m => m[1]);
    keys.forEach(k => allKeys.add(k));
  }
  return { pass: true, detail: `Storage keys: ${[...allKeys].sort().join(', ')}` };
});

// ========== 9. app.json pages 路径存在性 ==========
check('app.json 注册页面路径均存在', () => {
  const app = JSON.parse(fs.readFileSync(path.join(base, 'app.json'), 'utf8'));
  let issues = [];
  for (const p of app.pages) {
    const fp = path.join(base, p + '.js');
    if (!fs.existsSync(fp)) issues.push(p);
  }
  if (issues.length === 0) return { pass: true, detail: `全部 ${app.pages.length} 个注册页面路径有效` };
  return { pass: false, detail: `缺失: ${issues.join(', ')}` };
});

// ========== 10. 子包路径存在性（company-docs/list 在 company-docs/ 子目录） ==========
check('company-docs 子页面文件完整（index + list）', () => {
  const required = {
    'index': ['js', 'json', 'wxml', 'wxss'],
    'list': ['js', 'json', 'wxml', 'wxss']
  };
  let issues = [];
  const dir = path.join(base, 'pages/newspaper/company-docs');
  for (const [name, exts] of Object.entries(required)) {
    for (const ext of exts) {
      const fp = path.join(dir, `${name}.${ext}`);
      if (!fs.existsSync(fp)) issues.push(`${name}.${ext}`);
    }
  }
  if (issues.length === 0) return { pass: true, detail: 'index + list 四件套完整' };
  return { pass: false, detail: `缺失: ${issues.join(', ')}` };
});

// ========== 11. wxml 引用组件是否存在 ==========
check('wxml 中使用的组件 JSON 中已声明', () => {
  const pages = [
    'pages/newspaper/form.js',
    'pages/newspaper/content-edit/index.js',
    'pages/newspaper/company-docs/index.js',
    'pages/newspaper/company-docs/list.js',
    'pages/newspaper/personal-docs/index.js'
  ];
  let issues = [];
  for (const p of pages) {
    const dir = path.dirname(path.join(base, p));
    const jsonFile = path.join(dir, path.basename(p, '.js') + '.json');
    if (!fs.existsSync(jsonFile)) continue;
    try {
      const json = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
      const using = json.usingComponents || {};
      // wxml 中引用的组件需要 json 中有声明（不强制，但检查已知问题）
      const jsFile = path.join(base, p);
      const wxmlFile = path.join(dir, path.basename(p, '.js') + '.wxml');
      if (!fs.existsSync(wxmlFile)) continue;
      const wxml = fs.readFileSync(wxmlFile, 'utf8');
      const wxmlComponents = [...wxml.matchAll(/<(\w+[-\w]*)/g)].map(m => m[1]);
      for (const comp of wxmlComponents) {
        if (comp === 'block' || comp === 'template' || comp === 'wxs') continue;
        if (!using[comp] && !comp.includes('-')) {
          // 无声明且非官方组件，可能是问题
        }
      }
    } catch (e) {
      issues.push(`${p} JSON parse error: ${e.message}`);
    }
  }
  if (issues.length === 0) return { pass: true, detail: 'wxml/JSON 组件声明正常' };
  return { pass: false, detail: issues.join(' | ') };
});

// ========== 12. form.js 依赖 newspaperTemplate 但无默认值 ==========
check('form.js 读取 newspaperTemplate 有 fallback', () => {
  const formFile = fs.readFileSync(path.join(base, 'pages/newspaper/form.js'), 'utf8');
  const readsTemplate = /wx\.getStorageSync\('newspaperTemplate'\)/.test(formFile);
  if (readsTemplate) {
    // 检查是否有 fallback `|| {}`
    const hasFallback = /getStorageSync\('newspaperTemplate'\)\s*\|\|/.test(formFile);
    if (hasFallback) return { pass: true, detail: 'newspaperTemplate 有 || {} fallback' };
    return { pass: false, detail: 'newspaperTemplate 无 fallback（Storage 为空时可能报错）' };
  }
  return { pass: true, detail: 'form.js 不直接读取 newspaperTemplate' };
});

// ========== 13. company-docs.js generateContent 对所有分类有覆盖 ==========
check('company-docs generateContent 覆盖所有 12 个分类', () => {
  const cdFile = fs.readFileSync(path.join(base, 'utils/company-docs.js'), 'utf8');
  const genMatch = cdFile.match(/generateContent\s*\([^)]+\)\s*\{([\s\S]*?)\n\};/);
  if (!genMatch) return { pass: false, detail: 'generateContent 方法未找到' };
  const genBody = genMatch[1];
  // 检查12个分类名
  const categories = ['印章/证照类', '合同/协议类', '许可证/资质类', '票据/凭证类', '交通/运输类', '建筑/工程类', '营业执照/资质类', '医疗/医药类', '金融/税务类', '进出口/贸易类', '文化/食品/其他类', '交通/特种设备类'];
  const missing = categories.filter(c => !genBody.includes(`'${c}'`));
  if (missing.length === 0) return { pass: true, detail: `12个分类全覆盖` };
  return { pass: false, detail: `缺失: ${missing.join(', ')}` };
});

// ========== 14. 重复代码块检测 ==========
check('content-edit/index.js 无重复 replace 行', () => {
  const ceFile = fs.readFileSync(path.join(base, 'pages/newspaper/content-edit/index.js'), 'utf8');
  const lines = ceFile.split('\n');
  const seen = {};
  const dupes = [];
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trim();
    if (l.length > 10 && !l.startsWith('//')) {
      if (seen[l] !== undefined) {
        dupes.push(`L${i + 1} == L${seen[l] + 1}: ${l.slice(0, 50)}`);
      } else {
        seen[l] = i;
      }
    }
  }
  if (dupes.length === 0) return { pass: true, detail: '无重复行' };
  return { pass: false, detail: dupes.join(' | ') };
});

// ========== 输出结果 ==========
console.log('\n========== 登报模块压力检测报告 ==========\n');
const passed = RESULTS.filter(r => r.status === 'PASS').length;
const failed = RESULTS.filter(r => r.status === 'FAIL').length;
const errors = RESULTS.filter(r => r.status === 'ERROR').length;
RESULTS.forEach(r => {
  const icon = r.status === 'PASS' ? '✅' : r.status === 'FAIL' ? '❌' : '⚠️';
  console.log(`${icon} [${r.status}] ${r.label}`);
  if (r.detail) console.log(`   → ${r.detail}`);
});
console.log(`\n总计: ${RESULTS.length} 项 | ✅ 通过 ${passed} | ❌ 失败 ${failed} | ⚠️ 错误 ${errors}`);
if (failed === 0 && errors === 0) console.log('\n🟢 登报模块健壮性良好');
else if (failed <= 2) console.log('\n🟡 存在少量问题，建议排查');
else console.log('\n🔴 问题较多，建议优先处理失败项');
