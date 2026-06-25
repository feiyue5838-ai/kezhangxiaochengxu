// 全局错误处理工具

/**
 * 统一错误处理
 * @param {string} errMsg 错误信息
 * @param {string} type 错误类型
 */
function handleError(errMsg, type = 'default') {
  const errorConfig = {
    network: {
      title: '网络异常',
      message: '请检查网络连接后重试'
    },
    auth: {
      title: '登录失效',
      message: '请重新登录'
    },
    server: {
      title: '服务器异常',
      message: '请稍后重试'
    },
    param: {
      title: '参数错误',
      message: '请检查输入内容'
    },
    default: {
      title: '操作失败',
      message: '请稍后重试'
    }
  };

  const config = errorConfig[type] || errorConfig.default;
  wx.showModal({
    title: config.title,
    content: config.message,
    showCancel: false
  });
}

/**
 * 异步请求统一错误处理
 * @param {Promise} promise Promise对象
 * @param {Function} onError 错误回调
 */
async function asyncRequest(promise, onError) {
  try {
    const result = await promise;
    return { success: true, data: result };
  } catch (err) {
    const errMsg = err.message || '未知错误';
    if (onError) {
      onError(errMsg);
    } else {
      // 根据错误类型判断处理方式
      if (errMsg.includes('网络')) {
        handleError(errMsg, 'network');
      } else if (errMsg.includes('登录') || errMsg.includes('授权')) {
        handleError(errMsg, 'auth');
      } else if (errMsg.includes('服务器')) {
        handleError(errMsg, 'server');
      } else {
        handleError(errMsg, 'default');
      }
    }
    return { success: false, error: errMsg };
  }
}

/**
 * 表单验证工具
 */
const validators = {
  // 手机号验证
  phone(phone) {
    if (!phone) return '请输入手机号';
    if (!/^1[3-9]\d{9}$/.test(phone)) return '手机号格式不正确';
    return null;
  },

  // 身份证验证
  idCard(idCard) {
    if (!idCard) return '请输入身份证号';
    if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(idCard)) return '身份证号格式不正确';
    return null;
  },

  // 姓名验证
  name(name) {
    if (!name) return '请输入姓名';
    if (name.length < 2) return '姓名至少2个字符';
    if (!/^[\u4e00-\u9fa5·]+$/.test(name) && !/^[a-zA-Z\s]+$/.test(name)) return '姓名格式不正确';
    return null;
  },

  // 公司名称验证
  companyName(name) {
    if (!name) return '请输入公司名称';
    if (name.length < 4) return '公司名称至少4个字符';
    return null;
  },

  // 地址验证
  address(address) {
    if (!address) return '请选择收货地址';
    if (address.detail) return null;
    return '地址信息不完整';
  }
};

module.exports = {
  handleError,
  asyncRequest,
  validators
};