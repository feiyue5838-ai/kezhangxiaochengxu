/**
 * 公共工具函数
 * 抽取各页面中重复的逻辑
 */

// 四川省城市列表（多页面共用）
const CITIES = ['成都市','自贡市','攀枝花市','泸州市','德阳市','绵阳市','广元市','遂宁市','内江市','乐山市','南充市','眉山市','宜宾市','广安市','达州市','巴中市','雅安市','资阳市','阿坝州','甘孜州','凉山州'];

/**
 * 表单校验
 * @param {Object} form - { title, content, phone, name }
 * @returns {{ valid: boolean, msg: string }}
 */
function validateForm(form) {
  if (!form.title || !form.title.trim()) return { valid: false, msg: '请输入标题' };
  if (!form.content || !form.content.trim()) return { valid: false, msg: '请输入登报内容' };
  if (!form.phone || form.phone.trim().length !== 11) return { valid: false, msg: '请输入正确的手机号' };
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
  } catch (e) {
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
 * 手机号格式验证
 * @param {string} phone
 * @returns {{ valid: boolean, msg: string }}
 */
function validatePhone(phone) {
  if (!phone || !phone.trim()) {
    return { valid: false, msg: '请输入手机号' };
  }
  if (!/^1[3-9]\d{9}$/.test(phone.trim())) {
    return { valid: false, msg: '手机号格式不正确' };
  }
  return { valid: true, msg: '' };
}

/**
 * 身份证号格式验证
 * @param {string} idCard
 * @returns {{ valid: boolean, msg: string }}
 */
function validateIdCard(idCard) {
  if (!idCard || !idCard.trim()) {
    return { valid: false, msg: '请输入身份证号' };
  }
  if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(idCard.trim())) {
    return { valid: false, msg: '身份证号格式不正确' };
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
    const sysInfo = wx.getDeviceInfo ? wx.getDeviceInfo() : wx.getSystemInfoSync();
    statusBarHeight = sysInfo.statusBarHeight || 20;
    try {
      const menuButton = wx.getMenuButtonBoundingClientRect();
      // 内容区高度 = 胶囊高度 + 上下留白（与胶囊上方留白一致）
      navContentHeight = menuButton.height + (menuButton.top - statusBarHeight) * 2;
    } catch (e2) {
      navContentHeight = 44;
    }
  } catch (e) {
    navContentHeight = 44;
  }
  const navHeight = statusBarHeight + navContentHeight;
  return { statusBarHeight, navHeight };
}

/**
 * 判断区域是否需要法人照片
 * @param {string} region - 地区名称
 * @returns {boolean}
 */
function needLegalPhoto(region) {
  const photoRegions = ['新津', '简阳', '崇州', '邛崃', '彭州', '都江堰', '蒲江', '大邑', '郫都', '金堂', '温江'];
  return photoRegions.some(r => (region || '').includes(r));
}

/**
 * 获取营业执照要求说明
 * @param {string} region - 地区名称
 * @returns {string}
 */
function getLicenseNote(region) {
  if (region === '成都') {
    return '成都地区只需上传营业执照副本';
  }
  return '其他地区上传营业执照副本即可';
}

/**
 * 获取照片要求说明
 * @param {string} region - 地区名称
 * @returns {string}
 */
function getPhotoNote(region) {
  const photoRegions = ['新津', '简阳', '崇州', '邛崃', '彭州', '都江堰', '蒲江', '大邑', '郫都', '金堂'];
  if (!photoRegions.includes(region)) {
    return '';
  }
  if (region === '新津') {
    return '新津地区需法人手持身份证照片';
  }
  return `${region}地区需法人白底自拍照`;
}

/**
 * 检查材料是否完整
 * @param {Object} materials - { license, idCardFront, idCardBack, photo }
 * @param {Object} options - { isPersonal, isElectronic, needPhoto }
 * @returns {boolean}
 */
function checkMaterialsComplete(materials, options = {}) {
  const { isPersonal, isElectronic, needPhoto } = options;

  const hasLicense = !!materials.license;
  const hasIdCard = !!materials.idCardFront && !!materials.idCardBack;
  const hasPhoto = !!materials.photo;

  if (isElectronic) {
    // 电子印章：需要营业执照 + 法人身份证 + 法人照片
    return hasLicense && hasIdCard && hasPhoto;
  } else if (isPersonal) {
    // 个人印章：只需身份证
    return hasIdCard;
  } else {
    // 公司/个体户：需营业执照 + 身份证 + 法人照片（特定区域）
    return hasLicense && hasIdCard && (!needPhoto || hasPhoto);
  }
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
  needLegalPhoto: needLegalPhoto,
  getLicenseNote: getLicenseNote,
  getPhotoNote: getPhotoNote,
  checkMaterialsComplete: checkMaterialsComplete
};
