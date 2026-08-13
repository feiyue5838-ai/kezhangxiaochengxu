const fs = require('fs');
const path = 'D:\\刻章软件\\rongcheng-miniprogram\\pages\\order\\list\\index.js';
let content = fs.readFileSync(path, 'utf8');

// 替换 onViewLogistics
const oldLogistics = `  // 查看物流（后台填了快递单号才显示）
  onViewLogistics(e) {
    const { id, module } = e.currentTarget.dataset;
    const order = this.data.allList.find(o => o.id === id);
    if (!order) return;
    if (order.expressNo) {
      wx.showModal({
        title: '物流信息',
        content: '快递公司：' + (order.expressCompany || '暂无') + '\\n快递单号：' + order.expressNo,
        showCancel: false
      });
    } else {
      wx.showToast({ title: '暂无物流信息，商家正在处理中', icon: 'none' });
    }
  },`;

const newLogistics = `  // 查看物流（跳物流详情页）
  onViewLogistics(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: '/pages/order/logistics/index?id=' + id });
  },`;

if (!content.includes(oldLogistics)) {
  console.log('ERROR: onViewLogistics pattern not found');
  process.exit(1);
}
content = content.replace(oldLogistics, newLogistics);

// 替换 onConfirmReceive
const oldConfirm = `  // 确认收货（后台更新状态 4→5）
  onConfirmReceive(e) {
    const { id, module } = e.currentTarget.dataset;
    wx.showModal({
      title: '确认收货', content: '请确认您已收到货物且无异议？',
      confirmColor: '#52C41A',
      success: (res) => {
        if (!res.confirm) return;
        wx.showLoading({ title: '确认中...' });
        // TODO: 调用后端确认收货接口 PUT /api/orders/:id/confirm-receive
        // 暂时先本地更新，体验流畅
        setTimeout(() => {
          wx.hideLoading();
          wx.showToast({ title: '已确认收货', icon: 'success' });
          this.updateLocalOrder(id, module, 'completed', '待评价', 'completed');
        }, 800);
      }
    });
  },`;

const newConfirm = `  // 确认收货（调用后端 4→5）
  onConfirmReceive(e) {
    const { id, module } = e.currentTarget.dataset;
    wx.showModal({
      title: '确认收货', content: '请确认您已收到货物且无异议？',
      confirmColor: '#52C41A',
      success: (res) => {
        if (!res.confirm) return;
        wx.showLoading({ title: '确认中...' });
        const api = require('../../../utils/api');
        api.confirmReceive(id).then(() => {
          wx.hideLoading();
          wx.showToast({ title: '已确认收货', icon: 'success' });
          this.updateLocalOrder(id, module, 'completed', '待评价', 'completed');
        }).catch(() => {
          wx.hideLoading();
          wx.showToast({ title: '确认失败，请重试', icon: 'none' });
        });
      }
    });
  },`;

if (!content.includes(oldConfirm)) {
  console.log('ERROR: onConfirmReceive pattern not found');
  process.exit(1);
}
content = content.replace(oldConfirm, newConfirm);

fs.writeFileSync(path, content, 'utf8');
console.log('OK: order list updated');
