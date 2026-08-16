const api = require('../../utils/api.js');
const config = require('../../utils/config.js');

Page({
  data: {
    step: 1,       // 1=登录 2=绑定微信 3=开启通知 4=完成
    phone: '',
    password: '',
    logging: false,
    binding: false,
    subscribing: false,
    outlet: null,
    subscribeEnabled: true,
  },

  onLoad() {
    // 检查是否已登录网点账号
    const outletInfo = wx.getStorageSync('outletInfo');
    const outletToken = wx.getStorageSync('outletToken');
    if (outletInfo && outletToken) {
      this.setData({
        step: 2,
        outlet: outletInfo,
        subscribeEnabled: outletInfo.subscribeMsg === 1,
      });
      // 如果已经绑定了 openid，跳到步骤 3
      if (outletInfo.outletOpenid) {
        this.setData({ step: 3 });
      }
    }
  },

  // ── Step 1: 登录 ──────────────────────────────────────
  onPhoneInput(e) {
    this.setData({ phone: e.detail.value });
  },
  onPasswordInput(e) {
    this.setData({ password: e.detail.value });
  },

  onLogin() {
    const { phone, password } = this.data;
    if (!phone || phone.length !== 11) {
      wx.showToast({ title: '请输入正确的手机号', icon: 'none' });
      return;
    }
    if (!password || password.length < 4) {
      wx.showToast({ title: '请输入密码', icon: 'none' });
      return;
    }

    this.setData({ logging: true });
    api.outletLogin({ phone, password })
      .then(res => {
        this.setData({ logging: false });
        if (res.token && res.outlet) {
          wx.setStorageSync('outletToken', res.token);
          wx.setStorageSync('outletInfo', res.outlet);
          const step = res.outlet.outletOpenid ? 3 : 2;
          this.setData({ step, outlet: res.outlet, subscribeEnabled: res.outlet.subscribeMsg === 1 });
        } else {
          wx.showToast({ title: '登录结果异常', icon: 'none' });
        }
      })
      .catch(err => {
        this.setData({ logging: false });
        wx.showToast({ title: err.message || '登录失败，请检查手机号和密码', icon: 'none' });
      });
  },

  // ── Step 2: 绑定微信 ──────────────────────────────────
  onBindOpenid() {
    this.setData({ binding: true });
    // Step A: wx.login 获取 code，再交给后端换取 openid
    wx.login({
      success: loginRes => {
        api.wxLogin(loginRes.code)
          .then(res => {
            if (res && res.openid) {
              this._doBindOpenid(res.openid, true);
            } else {
              this.setData({ binding: false });
              wx.showToast({ title: '获取微信身份失败', icon: 'none' });
            }
          })
          .catch(() => {
            this.setData({ binding: false });
            wx.showToast({ title: '网络错误，无法获取微信身份', icon: 'none' });
          });
      },
      fail: () => {
        this.setData({ binding: false });
        wx.showToast({ title: '微信授权失败，请确认已登录微信', icon: 'none' });
      }
    });
  },

  _doBindOpenid(openid, isBind) {
    api.outletBindOpenid(openid)
      .then(() => {
        const outlet = { ...this.data.outlet, outletOpenid: openid };
        wx.setStorageSync('outletInfo', outlet);
        // 绑定成功 → 步骤3；解绑成功 → 回到步骤2（可重新绑定）
        const step = isBind ? 3 : 2;
        this.setData({ binding: false, outlet, step });
        wx.showToast({ title: isBind ? '绑定成功！' : '已解除绑定', icon: isBind ? 'success' : 'none' });
      })
      .catch(err => {
        this.setData({ binding: false });
        wx.showToast({ title: err.message || '操作失败', icon: 'none' });
      });
  },

  onUnbindOpenid() {
    wx.showModal({
      title: '解除绑定',
      content: '确定要解除当前微信绑定吗？解除后将无法收到微信通知推送。',
      confirmText: '解除',
      confirmColor: '#E05050',
      success: res => {
        if (res.confirm) {
          // 绑定空字符串相当于解绑
          this._doBindOpenid('', false);
        }
      }
    });
  },

  goToStep3() {
    this.setData({ step: 3 });
  },

  // ── Step 3: 开启通知 ──────────────────────────────────
  // 开关即时持久化：开启时顺便触发微信订阅授权，关闭时直接落库
  onToggleSubscribe(e) {
    const enabled = e.detail.value;
    this.setData({ subscribeEnabled: enabled });
    if (enabled) {
      this._requestWxSubscribe();
    } else {
      this._saveSubscribe(false);
    }
  },

  // 触发微信订阅消息授权（一次性订阅，best-effort），授权后持久化开启
  _requestWxSubscribe() {
    const TEMPLATE_ID = config.WECHAT_SUBSCRIBE_TEMPLATE_ID; // 真实 ID 在 utils/config.js 中配置
    if (!TEMPLATE_ID) {
      // 模板 ID 未配置时不调起授权弹窗，避免 wx.requestSubscribeMessage 直接报错
      wx.showToast({ title: '通知模板暂未配置', icon: 'none' });
      return;
    }
    wx.requestSubscribeMessage({
      tmplIds: [TEMPLATE_ID],
      success: () => this._saveSubscribe(true),
      fail: () => {
        // 用户拒绝或出错：仍允许把开关状态保存到后端，但提示需允许弹窗才能收到推送
        wx.showModal({
          title: '订阅授权',
          content: '微信通知需您在弹窗中点击"允许"才能收到推送。是否仍要开启？',
          confirmText: '仍要开启',
          success: res2 => {
            if (res2.confirm) this._saveSubscribe(true);
            else this.setData({ subscribeEnabled: false });
          }
        });
      }
    });
  },

  // 按钮：主动授权微信通知（一次性订阅）
  onEnableSubscribe() {
    this._requestWxSubscribe();
  },

  // 持久化订阅开关到后端（enabled 为真实开关值）
  _saveSubscribe(enabled) {
    this.setData({ subscribing: enabled });
    api.outletToggleSubscribe(enabled)
      .then(() => {
        const outlet = { ...this.data.outlet, subscribeMsg: enabled ? 1 : 0 };
        wx.setStorageSync('outletInfo', outlet);
        this.setData({ subscribing: false, subscribeEnabled: enabled, step: enabled ? 4 : 3 });
        wx.showToast({ title: enabled ? '已开启通知' : '已关闭通知', icon: enabled ? 'success' : 'none' });
      })
      .catch(err => {
        // 保存失败，回滚开关状态
        this.setData({ subscribing: false, subscribeEnabled: !enabled });
        wx.showToast({ title: err.message || '保存失败', icon: 'none' });
      });
  },

  // ── 登出 ─────────────────────────────────────────────
  onLogout() {
    wx.showModal({
      title: '切换账号',
      content: '确定要退出当前网点账号吗？',
      confirmText: '退出',
      confirmColor: '#E05050',
      success: res => {
        if (res.confirm) {
          wx.removeStorageSync('outletToken');
          wx.removeStorageSync('outletInfo');
          this.setData({ step: 1, outlet: null, phone: '', password: '' });
        }
      }
    });
  },

  // ── 完成 ─────────────────────────────────────────────
  onDone() {
    wx.navigateBack();
  },

  goToOrders() {
    wx.navigateTo({ url: '/pages/outlet/orders/index/index' });
  },
});
