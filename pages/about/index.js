const api = require('../../utils/api.js');
const { resolveImage } = api;

Page({
  data: {
    intro: null,     // 业务介绍（后台配置的第一条）
    phone: '400-888-6666',
    loading: true,
  },

  onLoad() {
    this.loadIntro();
  },

  loadIntro() {
    // 明确取通用介绍（type=all），避免误取到刻章等业务介绍；image 为空时由 wxml wx:if 守卫不渲染
    api.getIntros('all').then((res) => {
      const list = Array.isArray(res) ? res : (res.list || []);
      // 取第一条生效的（不区分业务类型，关于页展示平台通用介绍）
      const active = list.find(i => i.status === 1) || list[0];
      if (active && active.image) active = { ...active, image: resolveImage(active.image) };
      this.setData({ intro: active || null, loading: false });
    }).catch(() => {
      this.setData({ loading: false });
    });
    // 客服电话从系统配置读
    // request.js resolve(res.data)，后端返回 {code:0, data:{...}}，所以 res = {code, data}
    api.getConfig('service_phone').then((res) => {
      // res 可能是 { code, data: { value } } 或直接是字符串，兜底取
      let phone;
      if (res && typeof res === 'object') {
        phone = res.data && typeof res.data === 'object' ? res.data.value : res.data;
      }
      if (phone != null) this.setData({ phone: String(phone) });
    }).catch(() => {});
  },

  onCopyWechat() {
    wx.setClipboardData({
      data: '蓉城企服',
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
