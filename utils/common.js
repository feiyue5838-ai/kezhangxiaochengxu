/**
 * 公共工具函数
 * 抽取各页面中重复的逻辑
 */

// 四川省城市列表（多页面共用）
const CITIES = ['成都市','自贡市','攀枝花市','泸州市','德阳市','绵阳市','广元市','遂宁市','内江市','乐山市','南充市','眉山市','宜宾市','广安市','达州市','巴中市','雅安市','资阳市','阿坝州','甘孜州','凉山州'];

/**
 * 表单校验 - U-04: 使用统一 validatePhone
 * @param {Object} form - { title, content, phone, name }
 * @returns {{ valid: boolean, msg: string }}
 */
function validateForm(form) {
  if (!form.title || !form.title.trim()) return { valid: false, msg: '请输入标题' };
  if (!form.content || !form.content.trim()) return { valid: false, msg: '请输入登报内容' };
  // U-04: 使用统一 validatePhone
  const phoneResult = validatePhone(form.phone);
  if (!phoneResult.valid) return phoneResult;
  return { valid: true, msg: '' };
}

/**
 * 计算登报价格
 * 基础价98 + 每字 1.5 + 排版费20
 * @param {string} content
 * @returns {number} 四舍五入整数
 */
function calcPrice(content) {
  var charCount = (content || '').length;
  return Math.round(98 + charCount * 1.5 + 20);
}

/**
 * 城市切换处理（多页面共用）
 * @param {Function} setData - Page.setData 引用
 * @param {Array} cities
 * @param {Object} e - picker change event
 */
function handleCityChange(setData, cities, e) {
  var city = cities[e.detail.value];
  setData({ city: city });
  wx.showToast({ title: '已切换至' + city, icon: 'none' });
}

/**
 * 通用 onInput 处理（data-field 驱动）
 * @param {Function} setData
 * @param {Object} e
 * @param {Function} [afterChange] - 可选回调，传入更新后的 form
 */
function handleInput(setData, e, afterChange) {
  var field = e.currentTarget.dataset.field;
  setData({ ['form.' + field]: e.detail.value });
  if (typeof afterChange === 'function') {
    afterChange();
  }
}

/**
 * TabBar 选中状态设置（多页面共用）
 * @param {number} index - tabBar 索引
 */
function setTabBarSelected(index) {
  if (typeof this.getTabBar === 'function' && this.getTabBar()) {
    this.getTabBar().setData({ selected: index });
  }
}

/**
 * 悬浮客服按钮拖拽 - 开始
 * @param {Object} page - Page 实例
 * @param {Object} e
 */
function startDrag(page, e) {
  page._floatDragStart = { y: e.touches[0].clientY, top: page.data.floatBtnTop || 700 };
  page._floatMoved = false;
}

/**
 * 悬浮客服按钮拖拽 - 移动
 * @param {Object} page - Page 实例
 * @param {Object} e
 */
function moveDrag(page, e) {
  if (!page._floatDragStart) return;
  var dy = e.touches[0].clientY - page._floatDragStart.y;
  if (Math.abs(dy) > 5) page._floatMoved = true;
  var newTop = page._floatDragStart.top + dy * 2;
  newTop = Math.max(200, Math.min(newTop, 1200));
  page.setData({ floatBtnTop: newTop });
}

/**
 * 保存订单到本地存储
 * @param {Object} orderData - { type, desc, paper, price, content, phone, name, title }
 * @returns {string} 订单ID
 */
function saveOrder(orderData) {
  var STORAGE_KEY = 'newspaper_orders';
  try {
    var orders = wx.getStorageSync(STORAGE_KEY) || [];
    var order = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
      type: orderData.type || '登报服务',
      desc: (orderData.desc || orderData.content || '').substring(0, 50),
      paper: orderData.paper || '待选择',
      price: orderData.price || '0.00',
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      statusText: '待支付',
      statusClass: 'pending',
      detail: {
        title: orderData.title || '',
        content: orderData.content || '',
        phone: orderData.phone || '',
        name: orderData.name || ''
      },
      invoice: orderData.invoice || null
    };
    orders.unshift(order);
    wx.setStorageSync(STORAGE_KEY, orders);
    return order.id;
  } catch (_e) {
    return null;
  }
}

/**
 * 防重复提交装饰器
 * @param {Object} page - Page 实例
 * @param {string} methodName - 方法名
 */
function preventDuplicateSubmit(page, methodName) {
  const originalMethod = page[methodName];
  page[methodName] = function(e) {
    if (page.data.isSubmitting) {
      wx.showToast({ title: '请求处理中，请稍候', icon: 'none' });
      return;
    }
    page.setData({ isSubmitting: true });
    const result = originalMethod.call(this, e);
    // 如果返回 Promise，则在 finally 解锁
    if (result && typeof result.then === 'function') {
      result.finally(() => {
        page.setData({ isSubmitting: false });
      });
    } else {
      // 同步方法默认 2 秒后解锁
      setTimeout(() => {
        page.setData({ isSubmitting: false });
      }, 2000);
    }
    return result;
  };
}

/**
 * 图片大小验证
 * @param {number} size - 文件大小（字节）
 * @param {number} maxMB - 最大MB
 * @returns {{ valid: boolean, msg: string }}
 */
function validateImageSize(size, maxMB = 5) {
  const maxSize = maxMB * 1024 * 1024;
  if (size > maxSize) {
    return { valid: false, msg: `图片大小不能超过${maxMB}MB` };
  }
  return { valid: true, msg: '' };
}

/**
 * 手机号格式验证 - U-04: 统一为严格校验
 * @param {string} phone
 * @returns {{ valid: boolean, msg: string }}
 */
function validatePhone(phone) {
  if (!phone || !phone.trim()) {
    return { valid: false, msg: '请输入手机号' };
  }
  const trimmed = phone.trim();
  // U-04: 统一使用严格的正则
  if (!/^1[3-9]\d{9}$/.test(trimmed)) {
    return { valid: false, msg: '手机号格式不正确' };
  }
  return { valid: true, msg: '' };
}

/**
 * 身份证号格式验证 - U-05: 增强校验（出生日期 + 校验码）
 * @param {string} idCard
 * @returns {{ valid: boolean, msg: string }}
 */
function validateIdCard(idCard) {
  if (!idCard || !idCard.trim()) {
    return { valid: false, msg: '请输入身份证号' };
  }
  const s = idCard.trim().toUpperCase();
  // U-05: 使用严格正则（18位 + 出生日期 + 校验码）
  if (!/^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dX]$/.test(s)) {
    return { valid: false, msg: '身份证号格式不正确' };
  }
  // U-05: 校验码验证 (ISO 7064:1983 MOD 11-2)
  const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  const checkCodes = '10X98765432';
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    sum += weights[i] * parseInt(s[i], 10);
  }
  if (checkCodes[sum % 11] !== s[17]) {
    return { valid: false, msg: '身份证号校验位错误' };
  }
  return { valid: true, msg: '' };
}

/**
 * 收件人信息验证
 * @param {Object} receiver - { name, phone, address }
 * @returns {{ valid: boolean, msg: string }}
 */
function validateReceiver(receiver) {
  if (!receiver.name || !receiver.name.trim()) {
    return { valid: false, msg: '请输入收件人姓名' };
  }
  const phoneResult = validatePhone(receiver.phone);
  if (!phoneResult.valid) {
    return phoneResult;
  }
  if (!receiver.address || !receiver.address.trim()) {
    return { valid: false, msg: '请输入收件人地址' };
  }
  return { valid: true, msg: '' };
}

/**
 * 计算导航栏高度（状态栏 + 导航栏，与胶囊按钮底部对齐）
 * @returns {{ statusBarHeight: number, navHeight: number }}
 *   navHeight = 胶囊按钮底部距离视口顶部的距离（即导航栏总高度）
 */
function getNavigationHeight() {
  let statusBarHeight = 20;
  let navContentHeight = 44;
  try {
    const sysInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
    statusBarHeight = sysInfo.statusBarHeight || 20;
    try {
      const menuButton = wx.getMenuButtonBoundingClientRect();
      if (menuButton && menuButton.height) {
        // 底部对齐公式：navHeight = menuButton.top + menuButton.height
        // 减去 statusBarHeight 后得到内容区高度，再减去 capsule 自身高度，
        // 剩下的是状态栏到胶囊顶部之间的间隙
        navContentHeight = menuButton.height + (menuButton.top - statusBarHeight);
      } else {
        navContentHeight = 44;
      }
    } catch (_e2) {
      navContentHeight = 44;
    }
  } catch (_e) {
    // 兜底：用固定值
    statusBarHeight = 20;
    navContentHeight = 44;
  }
  const navHeight = statusBarHeight + navContentHeight;
  return { statusBarHeight, navHeight };
}

/**
 * 检查材料是否完整
 * @param {Object} materials - { license, idCardFront, idCardBack, photo }
 * @param {Object} options - { isPersonal, isElectronic, needPhoto }
 * @returns {boolean}
 */
// ============ 刻章主体类型与材料规则（S-13/S-14 单一数据源）============
// 主体类型枚举（与后端 SystemConfig.subjectTypes 保持一致；前端亦作为兜底）
const SUBJECT_TYPES = [
  { value: 'company',     label: '企业刻章',   licenseLabel: '营业执照',             licenseRequired: true,  extraDocs: [] },
  { value: 'individual',  label: '个体工商户', licenseLabel: '营业执照',             licenseRequired: true,  extraDocs: [] },
  { value: 'government',  label: '政府机关',   licenseLabel: '统一社会信用代码证',   licenseRequired: true,  extraDocs: ['刻章申请函', '介绍信'] },
  { value: 'institution', label: '事业单位',   licenseLabel: '事业单位法人证书',     licenseRequired: true,  extraDocs: ['刻章申请函', '介绍信'] },
  { value: 'social_org',  label: '社会团体',   licenseLabel: '社会团体法人登记证书', licenseRequired: true,  extraDocs: ['刻章申请函', '介绍信'] },
  { value: 'personal',    label: '个人印章',   licenseLabel: '',                    licenseRequired: false, extraDocs: [] },
  { value: 'electronic',  label: '电子印章',   licenseLabel: '营业执照',             licenseRequired: true,  extraDocs: [] }
];

function getSubjectType(value) {
  return SUBJECT_TYPES.find(t => t.value === value) || SUBJECT_TYPES[0];
}

// api.getConfig 解包后返回的是配置对象 { value: [...] }，需读 .value 才是真实数组
// （直接 Array.isArray(cfg) 永远为 false，这是后端白名单此前一直没生效的根因）
function configToArray(cfg, fallback) {
  if (!cfg) return fallback;
  let v = cfg;
  if (typeof cfg === 'object' && cfg !== null && typeof cfg.value !== 'undefined') v = cfg.value;
  if (typeof v === 'string') {
    try { v = JSON.parse(v); } catch (_e) { return fallback; }
  }
  if (!Array.isArray(v)) return fallback;
  return v;
}

function inRegion(region, cities) {
  if (!region || !Array.isArray(cities)) return false;
  return cities.some(c => (region || '').indexOf(c) >= 0);
}

// 计算某订单所需的材料字段清单（单一数据源，取代 material-upload.checkSubmitStatus 与旧 checkMaterialsComplete 的重复/冲突逻辑）
// @returns {{ required: string[], licenseLabel: string, licenseRequired: boolean, extraDocs: string[] }}
function getRequiredMaterials(o) {
  o = o || {};
  const subjectType = o.subjectType;
  const isElectronic = !!o.isElectronic || subjectType === 'electronic';
  const hasProfessional = !!o.hasProfessional;
  const hasSignature = !!o.hasSignature;
  const region = o.region;
  const legalPhotoCities = o.legalPhotoCities || [];
  const handheldIdCities = o.handheldIdCities || [];

  if (subjectType === 'personal') {
    // 个人印章：后端拒绝上传 idCardFront/idCardBack/license/legalPhoto（order.service.ts L137-142）
    // 前端同步返回空要求；仅执业资格证书或个人签名章需额外材料
    const required = [];
    if (hasProfessional) required.push('professionalCert');
    if (hasSignature) required.push('signature');
    return { required: required, licenseLabel: '', licenseRequired: false, extraDocs: [] };
  }

  // 电子印章：后端不收任何材料（order.service.ts 拒绝所有材料），前端同步返回空要求
  if (isElectronic) {
    return { required: [], licenseLabel: '', licenseRequired: false, extraDocs: [] };
  }

  const def = getSubjectType(subjectType);
  const required = ['license', 'idCardFront', 'idCardBack'];
  if (isElectronic || inRegion(region, legalPhotoCities)) required.push('legalPhoto');
  if (inRegion(region, handheldIdCities)) required.push('handheldIdPhoto');
  return { required: required, licenseLabel: def.licenseLabel, licenseRequired: def.licenseRequired, extraDocs: def.extraDocs };
}

function checkMaterialsComplete(materials, options) {
  options = options || {};
  const subjectType = options.subjectType || (options.isPersonal ? 'personal' : (options.isElectronic ? 'electronic' : 'company'));
  const required = getRequiredMaterials({
    subjectType: subjectType,
    isElectronic: !!options.isElectronic,
    hasProfessional: !!options.hasProfessional,
    hasSignature: !!options.hasSignature
  }).required;
  const req = required.filter(function (k) {
    if (k === 'legalPhoto') return !!options.needPhoto;
    if (k === 'handheldIdPhoto') return !!options.needHandheldId;
    return true;
  });
  return req.every(function (k) { return !!(materials && materials[k]); });
}

module.exports = {
  CITIES: CITIES,
  validateForm: validateForm,
  calcPrice: calcPrice,
  handleCityChange: handleCityChange,
  handleInput: handleInput,
  setTabBarSelected: setTabBarSelected,
  startDrag: startDrag,
  moveDrag: moveDrag,
  saveOrder: saveOrder,
  // 新增工具
  preventDuplicateSubmit: preventDuplicateSubmit,
  validateImageSize: validateImageSize,
  validatePhone: validatePhone,
  validateIdCard: validateIdCard,
  validateReceiver: validateReceiver,
  // 导航栏高度计算
  getNavigationHeight: getNavigationHeight,
  // 地区判断和材料检查
  checkMaterialsComplete: checkMaterialsComplete,
  // S-13/S-14 材料规则单一数据源
  getRequiredMaterials: getRequiredMaterials,
  getSubjectType: getSubjectType,
  SUBJECT_TYPES: SUBJECT_TYPES,
  configToArray: configToArray
};
