const api = require('../../utils/api.js');

Page({
  data: {
    appName: '蓉城企服',
    phone: '400-888-6666',
    wechat: '',
    serviceTime: '',
    address: '',
    copyright: '',
    intro: null,
    loading: true,
  },

  onLoad() {
    this.loadAbout();
  },

  loadAbout() {
    // 优先使用 about.image，后台已可独立上传封面图；不再依赖业务介绍
    api.getAbout().catch(() => null).then((about) => {
      if (about && typeof about === 'object') {
        const intro = about.image
          ? { title: about.intro || '', image: api.resolveImage(about.image) }
          : null;
        this.setData({
          appName: about.appName || this.data.appName,
          phone: about.phone || this.data.phone,
          wechat: about.wechat || '',
          serviceTime: about.serviceTime || '',
          address: about.address || '',
          copyright: about.copyright || '',
          intro,
          loading: false,
        });
      } else {
        this.setData({ intro: null, loading: false });
      }
    }).catch(() => {
      this.setData({ loading: false });
    });
  },

  onCopyWechat() {
    wx.setClipboardData({
      data: String(this.data.wechat || '蓉城企服'),
      success: () => { wx.showToast({ title: '微信公众号已复制', icon: 'none' }); },
    });
  },

  onCallService() {
    wx.makePhoneCall({ phoneNumber: String(this.data.phone), fail: () => { wx.showToast({ title: '拨打失败', icon: 'none' }); } });
  },

  onBack() {
    wx.navigateBack();
  },
});
