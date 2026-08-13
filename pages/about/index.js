const api = require('../../utils/api.js');

Page({
  data: {
    appName: '蓉城企服',
    logoUrl: '',
    version: 'v1.0.0 正式版',
    phone: '400-888-6666',
    wechat: '',
    serviceTime: '',
    address: '',
    copyright: '',
    companyName: '成都蓉城信息服务有限公司',
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
          ? { title: about.intro || '蓉城企服是成都本土企业服务一站式平台，致力于为广大企业主及个人用户提供便捷、高效、专业的证件办理、印章刻制、公告刊登等服务。', image: api.resolveImage(about.image) }
          : null;
        this.setData({
          appName: about.appName || this.data.appName,
          logoUrl: about.logoUrl ? api.resolveImage(about.logoUrl) : '',
          version: about.version || this.data.version,
          phone: about.phone || this.data.phone,
          wechat: about.wechat || '',
          serviceTime: about.serviceTime || '',
          address: about.address || '',
          copyright: about.copyright || '',
          companyName: about.companyName || this.data.companyName,
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
