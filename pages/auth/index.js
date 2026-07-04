const common = require('../../utils/common.js');
const auth = require('../../utils/auth.js');
const api = require('../../utils/api.js');
const app = getApp();

Page({
  data: {
    statusBarHeight: 0,
    loading: false,
    agreed: true,  // 默认勾选（符合最小摩擦原则）
    _redirected: false,
  },

  onLoad() {
    const sysInfo = wx.getSystemInfoSync();
    this.setData({ statusBarHeight: sysInfo.statusBarHeight || 20 });
    // 已登录则直接跳转
    if (this._checkLogin() && !this.data._redirected) {
      this.setData({ _redirected: true });
      this._redirectBack();
    }
  },

  _checkLogin() {
    return !!wx.getStorageSync('token');
  },

  // ── 微信一键登录（核心流程）───────────────────────────
  onGetPhoneNumber(e) {
    if (!this.data.agreed) {
      wx.showToast({ title: '请先阅读并同意协议', icon: 'none' });
      return;
    }
    if (e.detail.errMsg !== 'getPhoneNumber:ok') {
      wx.showToast({ title: '需要授权手机号才能登录', icon: 'none' });
      return;
    }

    this.setData({ loading: true });

    // Step1: wx.login 获取 code
    wx.login({
      success: (loginRes) => {
        // 调用后端登录接口（api.js 已配置）
        this._doLogin(loginRes.code, e.detail);
        // 开发阶段模拟登录（生产环境删除此行）
        // this._mockLogin(e.detail);
      },
      fail: () => {
        this.setData({ loading: false });
        wx.showToast({ title: '网络异常，请重试', icon: 'none' });
      }
    });
  },

  // 真实后端登录（已接入 api.js）
  _doLogin(code, phoneDetail) {
    const { request } = require('../../utils/auth.js');
    request({
      url: api.getApi('AUTH.LOGIN'),
      method: 'POST',
      data: {
        code,
        encryptedData: phoneDetail.encryptedData,
        iv: phoneDetail.iv,
      },
      success: (res) => {
        this.setData({ loading: false });
        if (res.code === 0) {
          this._saveAndRedirect(res.data);
        } else {
          wx.showToast({ title: res.msg || '登录失败', icon: 'none' });
        }
      },
      fail: () => {
        this.setData({ loading: false });
        wx.showToast({ title: '网络异常', icon: 'none' });
      }
    });
  },

  // 模拟登录（开发阶段用）
  _mockLogin(phoneDetail) {
    const mockUser = {
      token: 'mock_token_' + Date.now(),
      userInfo: {
        phone: '138****8888',
        openid: 'mock_openid',
        nickname: '蓉城用户',
        avatar: '',
      }
    };
    this._saveAndRedirect(mockUser);
  },

  _saveAndRedirect(data) {
    wx.setStorageSync('token', data.token);
    wx.setStorageSync('userInfo', data.userInfo);
    wx.setStorageSync('isLogin', true);
    app.refreshAuthState();
    this._redirectBack();
  },

  _redirectBack() {
    const pages = getCurrentPages();
    if (pages.length >= 2) {
      wx.navigateBack();  // 返回上一页
    } else {
      wx.switchTab({ url: '/pages/home/index' });  // 或首页
    }
  },

  // ── 游客试玩 ────────────────────────────────────────
  onGuestEnter() {
    wx.setStorageSync('isGuest', true);
    wx.setStorageSync('isLogin', true);
    app.refreshAuthState();
    this._redirectBack();
  },

  // ── 协议 ────────────────────────────────────────────
  toggleAgree() {
    this.setData({ agreed: !this.data.agreed });
  },

  openPrivacy() {
    wx.navigateTo({ url: '/pages/agreement/privacy/index' });
  },

  openTerms() {
    wx.navigateTo({ url: '/pages/agreement/terms/index' });
  },
});
