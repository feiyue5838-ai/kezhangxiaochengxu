const _common = require('../../utils/common.js');
const auth = require('../../utils/auth.js');
const api = require('../../utils/api.js');
const userProfile = require('../../utils/user-profile.js');

Page({
  data: {
    loading: false,
    agreed: false, // 协议默认不勾选（合规要求：用户主动勾选同意），勾选后才可登录/试玩
    _redirected: false,
  },

  onLoad() {
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
      },
      fail: () => {
        this.setData({ loading: false });
        wx.showToast({ title: '网络异常，请重试', icon: 'none' });
      }
    });
  },

  // 真实后端登录（已接入 api.js）
  // ⚠️ 必须用「不带登录守卫」的 api.wxLogin（raw request）。
  //    不能用 auth.request —— 它未登录时直接拦截、永不发请求，会导致登录死循环。
  _doLogin(code, _phoneDetail) {
    api.wxLogin(code).then((res) => {
      this.setData({ loading: false });
      if (res && res.token) {
        // 后端返回 { token, user }，统一映射为 _saveAndRedirect 期望的 { token, userInfo }
        this._saveAndRedirect({
          token: res.token,
          userInfo: userProfile.normalizeUserInfo(res.user),
        });
      } else {
        wx.showToast({ title: '登录失败', icon: 'none' });
      }
    }).catch(() => {
      this.setData({ loading: false });
      wx.showToast({ title: '网络异常', icon: 'none' });
    });
  },

  _saveAndRedirect(data) {
    wx.setStorageSync('token', data.token);
    wx.setStorageSync('userInfo', data.userInfo);
    wx.setStorageSync('isLogin', true);
    // 登录成功后同步 openid 到 Storage（api.wxLogin 已写入，此处做双重保险）
    if (data.openid) wx.setStorageSync('openid', data.openid);
    auth.refreshAuthState();
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
    if (!this.data.agreed) {
      wx.showToast({ title: '请先阅读并同意协议', icon: 'none' });
      return;
    }
    wx.setStorageSync('isGuest', true);
    wx.setStorageSync('isLogin', true);
    auth.refreshAuthState();
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
