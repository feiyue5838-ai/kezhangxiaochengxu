const common = require('../../utils/common.js');

Page({
  data: {
    statusBarHeight: 0,
    navHeight: 0,
    verifyStatus: 0,   // 0=未认证 1=已认证 2=认证失败
    statusIcon: '/assets/icons/icon-b64-20.svg',
    statusTitle: '未认证',
    statusDesc: '完成实名认证，享受更多服务',
    statusBadgeClass: 'status-badge--wait',
    statusBadgeText: '未认证',
    formData: {
      name: '',
      idNumber: '',
      idCardFront: '',
      idCardBack: '',
    },
    verifyData: {},
  },

  onLoad() {
    const { statusBarHeight, navHeight } = common.getNavigationHeight();
    this.setData({ statusBarHeight, navHeight });
    this.loadVerifyStatus();
  },

  loadVerifyStatus() {
    const data = wx.getStorageSync('realname_verify');
    if (data && data.status === 1) {
      // 已认证
      const id = data.idNumber || '';
      this.setData({
        verifyStatus: 1,
        statusIcon: '/assets/icons/icon-b64-20.svg',
        statusTitle: '已认证',
        statusDesc: '您的身份信息已通过审核',
        statusBadgeClass: 'status-badge--pass',
        statusBadgeText: '已认证 ✓',
        verifyData: {
          name: data.name,
          idNumberMask: id.substring(0, 3) + '***********' + id.substring(id.length - 4),
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
    // 模拟认证请求
    setTimeout(() => {
      wx.hideLoading();
      const saveData = {
        status: 1,
        name: d.name.trim(),
        idNumber: d.idNumber.trim(),
        idCardFront: d.idCardFront,
        idCardBack: d.idCardBack,
        verifyTime: '2026-06-17',
      };
      wx.setStorageSync('realname_verify', saveData);
      this.loadVerifyStatus();
      wx.showToast({ title: '认证成功！', icon: 'success' });
    }, 1500);
  },

  onBack() {
    wx.navigateBack();
  },
});
