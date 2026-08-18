// pages/order/logistics/index.js
const api = require('../../../utils/api');
const app = getApp();

Page({
  data: {
    loading: true,
    orderId: '',
    expressCompany: '',
    expressNo: '',
    steps: [],
  },

  onLoad(opt) {
    const { id } = opt;
    if (!id) {
      wx.showToast({ title: '参数错误', icon: 'none' });
      wx.navigateBack();
      return;
    }
    this.setData({ orderId: id });
    this.fetchDeliveryInfo(id);
  },

  goBack() { wx.navigateBack(); },

  fetchDeliveryInfo(orderId) {
    this.setData({ loading: true });
    api.getOrderDetail(orderId).then(res => {
      const d = res.data || res;
      const expressCompany = d.expressCompany || '';
      const expressNo = d.expressNo || '';
      // 生成假物流轨迹（后台填单号后视为已发货）
      const steps = expressNo
        ? this.generateFakeSteps(expressCompany, expressNo)
        : [];
      this.setData({
        loading: false,
        expressCompany,
        expressNo,
        steps,
      });
    }).catch(() => {
      this.setData({ loading: false });
      wx.showToast({ title: '加载失败', icon: 'none' });
    });
  },

  // 生成假物流步骤（真实环境可对接快递100等API）
  generateFakeSteps(company, no) {
    const now = new Date();
    const fmt = (d) => {
      const pad = n => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };
    const h = (hour, content) => {
      const t = new Date(now.getTime() - hour * 3600000);
      return { time: fmt(t), content };
    };
    return [
      h(0, `您的包裹已由【${company}】揽收，正在运输途中，请耐心等待`),
      h(6, `包裹已到达【${company}】转运中心`),
      h(12, '快递员正在为您派送中，请保持电话畅通'),
    ];
  },

  copyNo() {
    if (!this.data.expressNo) return;
    wx.setClipboardData({
      data: this.data.expressNo,
      success: () => wx.showToast({ title: '已复制', icon: 'success' }),
    });
  },
});
