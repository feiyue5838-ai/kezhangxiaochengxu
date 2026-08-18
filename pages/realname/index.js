const _common = require('../../utils/common.js');
const api = require('../../utils/api.js');

Page({
  data: {
    verifyStatus: 0,   // 0=未认证 1=已认证 2=认证失败
    statusIcon: '/assets/icons/icon-b64-20.svg',
    statusTitle: '未认证',
    statusDesc: '完成实名认证，享受更多服务',
    statusBadgeClass: 'status-badge--wait',
    statusBadgeText: '未认证',
    showIdCardForm: false,  // false=展示选择页 true=展示上传身份证表单
    formData: {
      name: '',
      idNumber: '',
      idCardFront: '',
      idCardBack: '',
    },
    verifyData: {},
  },

  onLoad() {
    this.loadVerifyStatus();
  },

  // A-08: 加载实名认证状态时先调后端接口
  async loadVerifyStatus() {
    try {
      const res = await api.getRealnameStatus();
      if (res && res.status === 1) {
        this.setData({
          verifyStatus: 1,
          statusIcon: '/assets/icons/icon-b64-20.svg',
          statusTitle: '已认证',
          statusDesc: '您的身份信息已通过审核',
          statusBadgeClass: 'status-badge--pass',
          statusBadgeText: '已认证 ✓',
          verifyData: {
            name: res.name,
            idNumberMask: res.idNumberMask,
            verifyTime: res.verifyTime || '',
          },
        });
        // 同步到 Storage
        wx.setStorageSync('realname_verify', {
          status: 1,
          name: res.name,
          idNumberMask: res.idNumberMask,
          verifyTime: res.verifyTime || '',
        });
      } else {
        // 后端未认证，检查本地缓存
        this._loadFromStorage();
      }
    } catch (_e) {
      // 接口失败，从 Storage 读取
      this._loadFromStorage();
    }
  },

  _loadFromStorage() {
    const data = wx.getStorageSync('realname_verify');
    if (data && data.status === 1) {
      const rawId = data.idNumber || '';
      const mask = data.idNumberMask || (rawId ? rawId.substring(0, 3) + '***********' + rawId.substring(rawId.length - 4) : '');
      this.setData({
        verifyStatus: 1,
        statusIcon: '/assets/icons/icon-b64-20.svg',
        statusTitle: '已认证',
        statusDesc: '您的身份信息已通过审核',
        statusBadgeClass: 'status-badge--pass',
        statusBadgeText: '已认证 ✓',
        verifyData: {
          name: data.name,
          idNumberMask: mask,
          verifyTime: data.verifyTime || '',
        },
      });
    }
  },

  onNameInput(e) {
    this.setData({ 'formData.name': e.detail.value });
  },

  onIdNumberInput(e) {
    this.setData({ 'formData.idNumber': e.detail.value });
  },

  onUploadFront() {
    this.chooseImage('idCardFront');
  },

  onUploadBack() {
    this.chooseImage('idCardBack');
  },

  chooseImage(field) {
    wx.chooseImage({
      count: 1,
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({ ['formData.' + field]: res.tempFilePaths[0] });
      },
      fail: () => {
        wx.showToast({ title: '请重新选择图片', icon: 'none' });
      },
    });
  },

  get canSubmit() {
    const d = this.data.formData;
    return d.name.trim().length >= 2
      && d.idNumber.trim().length === 18
      && d.idCardFront
      && d.idCardBack;
  },

  // — 方案 A：微信实名认证（推荐）—
  onStartWechatVerify() {
    wx.triggerVerify({
      appId: 'wx68ab58ca4a6dd92a',
      success: (detail) => {
        wx.showLoading({ title: '验证中...' });
        api.verifyByWechat({
          encryptedData: detail.encryptedData,
          iv: detail.iv,
        }).then((res) => {
          wx.hideLoading();
          if (res.status === 1) {
            wx.setStorageSync('realname_verify', {
              status: 1,
              name: res.name,
              idNumberMask: res.idNumberMask,
              verifyTime: res.verifyTime || '',
            });
            this.loadVerifyStatus();
            wx.showToast({ title: '认证成功', icon: 'success' });
          } else {
            wx.showModal({
              title: '认证失败',
              content: (res && res.message) || '微信实名认证未能通过，请尝试上传身份证',
              confirmText: '上传身份证',
              success: (m) => { if (m.confirm) this.setData({ showIdCardForm: true }); }
            });
          }
        }).catch(() => {
          wx.hideLoading();
          wx.showToast({ title: '验证失败，请稍后重试', icon: 'none' });
        });
      },
      fail: (err) => {
        if (err && err.errMsg && err.errMsg.indexOf('cancel') >= 0) {
          // 用户主动取消，忽略
          return;
        }
        // 接口不支持或出错，引导上传身份证
        wx.showModal({
          title: '微信认证不可用',
          content: '请尝试上传身份证认证',
          confirmText: '上传身份证',
          success: (m) => { if (m.confirm) this.setData({ showIdCardForm: true }); }
        });
      }
    });
  },

  // 展示上传身份证表单（方案 B 入口）
  showIdCardForm() {
    this.setData({ showIdCardForm: true });
  },

  // 返回选择页
  onBackToChoice() {
    this.setData({ showIdCardForm: false });
  },

  // — 方案 B：上传身份证提交 —
  onSubmit() {
    const d = this.data.formData;
    if (!d.name.trim() || d.name.trim().length < 2) {
      wx.showToast({ title: '请输入真实姓名', icon: 'none' }); return;
    }
    const idRe = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;
    if (!idRe.test(d.idNumber)) {
      wx.showToast({ title: '请输入正确的身份证号', icon: 'none' }); return;
    }
    if (!d.idCardFront) {
      wx.showToast({ title: '请上传身份证人像面', icon: 'none' }); return;
    }
    if (!d.idCardBack) {
      wx.showToast({ title: '请上传身份证国徽面', icon: 'none' }); return;
    }

    wx.showLoading({ title: '提交中...' });
    const getUrl = (r) => (r && (r.url || (r.data && r.data.url))) || r;
    Promise.all([
      api.uploadFile(d.idCardFront, '/api/upload/id-card'),
      api.uploadFile(d.idCardBack, '/api/upload/id-card'),
    ]).then((res) => api.submitRealname({
      name: d.name.trim(),
      idNumber: d.idNumber.trim(),
      idCardFront: getUrl(res[0]),
      idCardBack: getUrl(res[1]),
    })).then((verifyRes) => {
      wx.hideLoading();
      // A-08: 根据后端返回状态判断，不硬编码成功
      const status = Number(verifyRes && verifyRes.status);
      if (status !== 1) {
        wx.showModal({
          title: '认证未通过',
          content: (verifyRes && verifyRes.message) || '请核对信息后重试',
          showCancel: false
        });
        return;
      }
      const id = d.idNumber.trim();
      wx.setStorageSync('realname_verify', {
        status: 1,
        name: verifyRes.name || d.name.trim(),
        idNumberMask: verifyRes.idNumberMask || (id.substring(0, 3) + '***********' + id.substring(id.length - 4)),
        verifyTime: (verifyRes && verifyRes.verifyTime) || '',
      });
      this.loadVerifyStatus();
      wx.showToast({ title: '认证成功', icon: 'success' });
    }).catch((err) => {
      wx.hideLoading();
      wx.showToast({ title: (err && err.message) || '认证失败，请重试', icon: 'none' });
    });
  },

  onBack() {
    wx.navigateBack();
  },
});
