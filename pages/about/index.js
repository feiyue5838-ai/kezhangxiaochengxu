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
    // 并行拉平台关于信息 + 业务介绍
    Promise.all([
      api.getAbout().catch(() => null),
      api.getIntros('all').catch(() => []),
    ]).then(([about, introRes]) => {
      const list = Array.isArray(introRes) ? introRes : (introRes ? (introRes.list || []) : []);
      const active = list.find(i => i.status === 1) || list[0];
      const intro = active && active.image
        ? { ...active, image: api.resolveImage(active.image) }
        : null;
      // about: request.js resolve(res.data)，返回 { appName, phone, wechat, serviceTime, intro, address, copyright }
      if (about && typeof about === 'object') {
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
        this.setData({ intro, loading: false });
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
