// pages/profile/edit/index.js — 用户资料编辑页
// 数据流：Storage userInfo 初始化 → 编辑头像/昵称 → 保存时先上传头像再 PUT /api/user/profile → 回写 Storage
const api = require('../../../utils/api.js');
const auth = require('../../../utils/auth.js');

Page({
  data: {
    userInfo: { nickName: '', avatarUrl: '', phone: '' },
    saving: false,
  },

  onLoad() {
    const userInfo = wx.getStorageSync('userInfo') || {};
    this.setData({ userInfo: { nickName: '', avatarUrl: '', phone: '', ...userInfo } });
  },

  // 选择头像（微信官方头像填写能力，返回临时文件路径）
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    this.setData({ 'userInfo.avatarUrl': avatarUrl });
  },

  // 昵称输入（type=nickname，微信键盘上方快捷选择）
  onNicknameInput(e) {
    this.setData({ 'userInfo.nickName': e.detail.value });
  },

  goBack() {
    wx.navigateBack({ delta: 1 });
  },

  // 保存：头像为临时文件时先上传换取服务端 URL，再 PUT 资料
  async onSave() {
    if (this.data.saving) return;

    const { nickName, avatarUrl, phone } = this.data.userInfo;
    if (!nickName || !nickName.trim()) {
      wx.showToast({ title: '请填写昵称', icon: 'none' });
      return;
    }

    if (!auth.isLogin()) {
      // 游客/未登录：仅保存到本地
      this._saveLocal();
      wx.showToast({ title: '已保存到本机（未登录不同步云端）', icon: 'none' });
      return;
    }

    this.setData({ saving: true });
    try {
      const payload = { nickName: nickName.trim() };

      // 判断头像是否为待上传的本地临时文件（非 http(s) 且非服务端路径）
      const isTempFile = avatarUrl && !/^https?:\/\//.test(avatarUrl) && avatarUrl.indexOf('/uploads/') === -1;
      if (isTempFile) {
        // wxfile:// 临时文件需先上传换取服务端 URL
        const upRes = await api.uploadFile(avatarUrl);
        payload.avatar = (upRes && (upRes.url || upRes.path)) || upRes;
      } else if (avatarUrl) {
        payload.avatar = avatarUrl;
      }

      await api.updateUserInfo(payload);

      // 成功后回写本地（优先用服务端返回值，其次用本次提交值）
      const userInfo = { ...this.data.userInfo, ...payload, phone };
      wx.setStorageSync('userInfo', userInfo);
      this.setData({ saving: false, userInfo });
      wx.showToast({ title: '保存成功', icon: 'success' });
      setTimeout(() => wx.navigateBack({ delta: 1 }), 800);
    } catch (e) {
      this.setData({ saving: false });
      wx.showToast({ title: (e && e.message) || '保存失败，请重试', icon: 'none' });
    }
  },

  _saveLocal() {
    wx.setStorageSync('userInfo', this.data.userInfo);
  }
});
