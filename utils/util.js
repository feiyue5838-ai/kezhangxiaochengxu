/**
 * 蓉城企服 - 工具函数
 */

/**
 * 格式化日期
 * @param {number|string} date 日期时间戳或日期字符串
 * @param {string} format 格式化模板
 * @returns {string}
 */
const formatDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hour = String(d.getHours()).padStart(2, '0');
  const minute = String(d.getMinutes()).padStart(2, '0');
  const second = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hour)
    .replace('mm', minute)
    .replace('ss', second);
};

/**
 * 格式化手机号（中间4位脱敏）
 * @param {string} phone 手机号
 * @returns {string}
 */
const formatPhone = (phone) => {
  if (!phone || phone.length !== 11) return phone;
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
};

/**
 * 格式化金额
 * @param {number} amount 金额（分）
 * @returns {string}
 */
const formatMoney = (amount) => {
  return (amount / 100).toFixed(2);
};

/**
 * 验证手机号
 * @param {string} phone 手机号
 * @returns {boolean}
 */
const validatePhone = (phone) => {
  return /^1[3-9]\d{9}$/.test(phone);
};

/**
 * 验证身份证号
 * @param {string} idCard 身份证号
 * @returns {boolean}
 */
const validateIdCard = (idCard) => {
  return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(idCard);
};

/**
 * 防抖
 * @param {function} fn 处理函数
 * @param {number} delay 延迟(ms)
 * @returns {function}
 */
const debounce = (fn, delay = 300) => {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

/**
 * 节流
 * @param {function} fn 处理函数
 * @param {number} delay 延迟(ms)
 * @returns {function}
 */
const throttle = (fn, delay = 300) => {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last > delay) {
      last = now;
      fn.apply(this, args);
    }
  };
};

/**
 * 获取本地存储
 * @param {string} key 键名
 * @param {any} defaultValue 默认值
 * @returns {any}
 */
const getStorage = (key, defaultValue = '') => {
  try {
    const value = wx.getStorageSync(key);
    return value || defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

/**
 * 设置本地存储
 * @param {string} key 键名
 * @param {any} value 值
 */
const setStorage = (key, value) => {
  try {
    wx.setStorageSync(key, value);
  } catch (e) {
    // 静默处理
  }
};

/**
 * 清除本地存储
 * @param {string} key 键名（为空则清除所有）
 */
const removeStorage = (key) => {
  try {
    if (key) {
      wx.removeStorageSync(key);
    } else {
      wx.clearStorageSync();
    }
  } catch (e) {
    // 静默处理
  }
};

/**
 * 显示loading
 * @param {string} title 提示文字
 * @param {boolean} mask 是否遮罩
 */
const showLoading = (title = '加载中..', mask = true) => {
  wx.showLoading({ title, mask });
};

/**
 * 隐藏loading
 */
const hideLoading = () => {
  wx.hideLoading();
};

/**
 * 显示Toast消息
 * @param {string} title 提示文字
 * @param {string} icon 图标 success/none
 */
const showToast = (title, icon = 'none') => {
  wx.showToast({ title, icon });
};

/**
 * 确认对话框
 * @param {string} title 标题
 * @param {string} content 内容
 * @returns {Promise<boolean>}
 */
const showConfirm = (title, content) => {
  return new Promise((resolve) => {
    wx.showModal({
      title,
      content,
      success: (res) => {
        resolve(res.confirm);
      },
      fail: () => resolve(false)
    });
  });
};

/**
 * 拨打电话
 * @param {string} phoneNumber 电话号码
 */
const makePhoneCall = (phoneNumber) => {
  wx.makePhoneCall({ phoneNumber });
};

/**
 * 复制到剪贴板
 * @param {string} text 内容
 */
const copyToClipboard = (text) => {
  wx.setClipboardData({ data: text });
};

/**
 * 获取用户定位
 * @returns {Promise<object>}
 */
const getLocation = () => {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      type: 'gcj02',
      success: resolve,
      fail: reject
    });
  });
};

/**
 * 选择图片
 * @param {number} count 选择数量
 * @returns {Promise<string[]>}
 */
const chooseImage = (count = 1) => {
  return new Promise((resolve, reject) => {
    wx.chooseImage({
      count,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => resolve(res.tempFilePaths),
      fail: reject
    });
  });
};

/**
 * 预览图片
 * @param {string[]} urls 图片URL列表
 * @param {number} current 当前索引
 */
const previewImage = (urls, current = 0) => {
  wx.previewImage({
    urls,
    current
  });
};

module.exports = {
  formatDate,
  formatPhone,
  formatMoney,
  validatePhone,
  validateIdCard,
  debounce,
  throttle,
  getStorage,
  setStorage,
  removeStorage,
  showLoading,
  hideLoading,
  showToast,
  showConfirm,
  makePhoneCall,
  copyToClipboard,
  getLocation,
  chooseImage,
  previewImage
};
