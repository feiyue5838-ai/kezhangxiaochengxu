// 网络请求工具类 - 封装超时和重试机制

/**
 * 网络请求封装
 * @param {Object} options 请求配置
 * @param {string} options.url 请求地址
 * @param {string} options.method 请求方法 GET/POST
 * @param {Object} options.data 请求数据
 * @param {number} options.timeout 超时时间(ms)，默认 10000
 * @param {number} options.retry 重试次数，默认 2
 * @param {number} options.retryDelay 重试间隔(ms)，默认 1000
 * @param {Object} options.header 请求头
 */
function request(options) {
  const {
    url,
    method = 'GET',
    data = {},
    timeout = 10000,
    retry = 2,
    retryDelay = 1000,
    header = {}
  } = options;

  return new Promise((resolve, reject) => {
    let retryCount = 0;

    const doRequest = () => {
      wx.request({
        url,
        method,
        data,
        header: {
          'Content-Type': 'application/json',
          ...header
        },
        timeout,
        success: (res) => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(res.data);
          } else if (res.statusCode === 401) {
            // 未授权
            wx.showToast({ title: '请重新登录', icon: 'none' });
            reject(new Error('未授权'));
          } else if (res.statusCode === 500) {
            // 服务器错误
            wx.showToast({ title: '服务器异常', icon: 'none' });
            reject(new Error('服务器异常'));
          } else {
            reject(new Error(`请求失败: ${res.statusCode}`));
          }
        },
        fail: (err) => {
          retryCount++;
          if (retryCount <= retry) {
            setTimeout(doRequest, retryDelay);
          } else {
            wx.showToast({ title: '网络异常，请检查网络', icon: 'none' });
            reject(new Error('网络异常'));
          }
        }
      });
    };

    doRequest();
  });
}

/**
 * GET 请求
 */
function get(url, data, options = {}) {
  return request({
    url,
    method: 'GET',
    data,
    ...options
  });
}

/**
 * POST 请求
 */
function post(url, data, options = {}) {
  return request({
    url,
    method: 'POST',
    data,
    ...options
  });
}

/**
 * 上传文件（带进度回调）
 */
function uploadFile(options) {
  const {
    url,
    filePath,
    name = 'file',
    formData = {},
    timeout = 30000,
    onProgress
  } = options;

  return new Promise((resolve, reject) => {
    const task = wx.uploadFile({
      url,
      filePath,
      name,
      formData,
      timeout,
      header: {
        'Content-Type': 'multipart/form-data'
      },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(res.data));
          } catch (e) {
            resolve(res.data);
          }
        } else {
          reject(new Error(`上传失败: ${res.statusCode}`));
        }
      },
      fail: (err) => {
        wx.showToast({ title: '上传失败，请重试', icon: 'none' });
        reject(err);
      }
    });

    if (onProgress) {
      task.onProgressUpdate((res) => {
        onProgress(res.progress);
      });
    }
  });
}

module.exports = {
  request,
  get,
  post,
  uploadFile
};