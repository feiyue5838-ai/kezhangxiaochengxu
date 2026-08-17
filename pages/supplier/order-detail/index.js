// pages/supplier/order-detail/index.js — 供应商订单详情（接单/拒单/制作/发货）
const api = require('../../../utils/api.js');

const STATUS_TEXT = {
  assigned: '待接单',
  accepted: '已接单',
  processing: '制作中',
  completed: '已完成',
  cancelled: '已取消',
};

Page({
  data: {
    id: '',
    order: null,
    statusText: '',
    loading: true,
    actionLoading: false,
    rejectReason: '',
    showReject: false,
    courier: '',
    trackingNo: '',
    showDeliver: false,
  },

  onLoad(options) {
    this.setData({ id: options.id || '' });
    this.loadDetail();
  },

  loadDetail() {
    const id = this.data.id;
    if (!id) {
      wx.showToast({ title: '参数错误', icon: 'none' });
      return;
    }
    // 从列表中匹配（工作台已缓存列表，简化处理：直接查当前状态的列表找）
    this._fetchFromList();
  },

  // 供应商接口没有单条详情，从列表各状态拉取匹配
  _fetchFromList() {
    const id = this.data.id;
    const statuses = ['pending', 'accepted', 'processing', 'completed'];
    let found = null;
    const fetchAll = statuses.map(status =>
      api.v2SupplierGetOrders({ status, page: 1, pageSize: 50 })
        .then(res => {
          const list = (res && res.list) || [];
          const hit = list.find(o => o.id === id);
          if (hit) found = hit;
        })
        .catch(() => {})
    );
    Promise.all(fetchAll).then(() => {
      if (found) {
        this.setData({
          order: found,
          statusText: STATUS_TEXT[found.status] || found.status,
          loading: false,
        });
      } else {
        // 可能是已取消订单，再查一次 cancelled
        api.v2SupplierGetOrders({ status: 'cancelled', page: 1, pageSize: 50 })
          .then(res => {
            const list = (res && res.list) || [];
            const hit = list.find(o => o.id === id);
            if (hit) {
              this.setData({ order: hit, statusText: STATUS_TEXT[hit.status] || hit.status, loading: false });
            } else {
              this.setData({ loading: false });
              wx.showToast({ title: '订单不存在', icon: 'none' });
            }
          })
          .catch(() => this.setData({ loading: false }));
      }
    });
  },

  // 接单
  onAccept() {
    this._doAction('v2SupplierAccept', [], '接单成功');
  },

  // 开始制作
  onStart() {
    this._doAction('v2SupplierStart', [], '已开始制作');
  },

  _doAction(method, args, successMsg) {
    if (this.data.actionLoading) return;
    this.setData({ actionLoading: true });
    api[method](this.data.id, ...args)
      .then(() => {
        wx.showToast({ title: successMsg, icon: 'success' });
        this.setData({ actionLoading: false });
        setTimeout(() => wx.navigateBack(), 800);
      })
      .catch(err => {
        this.setData({ actionLoading: false });
        console.error(method, '失败', err);
      });
  },

  // 拒单
  onRejectTap() {
    this.setData({ showReject: true });
  },
  onRejectCancel() {
    this.setData({ showReject: false, rejectReason: '' });
  },
  onRejectInput(e) {
    this.setData({ rejectReason: e.detail.value });
  },
  onRejectConfirm() {
    const reason = this.data.rejectReason.trim();
    if (!reason) {
      wx.showToast({ title: '请填写拒单原因', icon: 'none' });
      return;
    }
    if (this.data.actionLoading) return;
    this.setData({ actionLoading: true });
    api.v2SupplierReject(this.data.id, { reason })
      .then(() => {
        this.setData({ actionLoading: false, showReject: false, rejectReason: '' });
        wx.showToast({ title: '已拒单', icon: 'success' });
        setTimeout(() => wx.navigateBack(), 800);
      })
      .catch(err => {
        this.setData({ actionLoading: false });
        console.error('拒单失败', err);
      });
  },

  // 发货
  onDeliverTap() {
    this.setData({ showDeliver: true });
  },
  onDeliverCancel() {
    this.setData({ showDeliver: false, courier: '', trackingNo: '' });
  },
  onCourierInput(e) {
    this.setData({ courier: e.detail.value });
  },
  onTrackingInput(e) {
    this.setData({ trackingNo: e.detail.value });
  },
  onDeliverConfirm() {
    const courier = this.data.courier.trim();
    const trackingNo = this.data.trackingNo.trim();
    if (!courier) {
      wx.showToast({ title: '请填写快递公司', icon: 'none' });
      return;
    }
    if (this.data.actionLoading) return;
    this.setData({ actionLoading: true });
    api.v2SupplierDeliver(this.data.id, { courier, trackingNo })
      .then(() => {
        this.setData({ actionLoading: false, showDeliver: false, courier: '', trackingNo: '' });
        wx.showToast({ title: '已发货', icon: 'success' });
        setTimeout(() => wx.navigateBack(), 800);
      })
      .catch(err => {
        this.setData({ actionLoading: false });
        console.error('发货失败', err);
      });
  },
});
