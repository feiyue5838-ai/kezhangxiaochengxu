// pages/supplier/order-detail/index.js — 供应商订单详情（接单/拒单/制作/发货/回执）
const api = require('../../../utils/api.js');
const API_BASE = api.API_BASE;

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
    showReceipt: false,
    receipts: [],
    uploading: false,
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
        const receipts = (found.productionPhotos || []).concat(found.filingPhotos || [], found.qualityCheckPhotos || []);
        this.setData({
          order: found,
          statusText: STATUS_TEXT[found.status] || found.status,
          receipts,
          loading: false,
        });
      } else {
        // 可能是已取消订单，再查一次 cancelled
        api.v2SupplierGetOrders({ status: 'cancelled', page: 1, pageSize: 50 })
          .then(res => {
            const list = (res && res.list) || [];
            const hit = list.find(o => o.id === id);
            if (hit) {
              const receipts = (hit.productionPhotos || []).concat(hit.filingPhotos || [], hit.qualityCheckPhotos || []);
              this.setData({ order: hit, statusText: STATUS_TEXT[hit.status] || hit.status, receipts, loading: false });
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

  // ============ 回执照片 ============

  // 打开回执上传弹窗
  onUploadReceiptTap() {
    this.setData({ showReceipt: true });
  },
  onReceiptCancel() {
    this.setData({ showReceipt: false });
  },

  // 选择并上传回执照片
  onUploadReceipt() {
    if (this.data.uploading) return;
    wx.chooseMedia({
      count: 9,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const files = res.tempFiles || [];
        if (!files.length) return;
        this.setData({ showReceipt: false });
        this._uploadReceipts(files.map(f => f.tempFilePath));
      },
    });
  },

  _uploadReceipts(paths) {
    const id = this.data.id;
    this.setData({ uploading: true });
    let ok = 0;
    const total = paths.length;
    let _failIdx = 0;
    const next = (idx) => {
      if (idx >= total) {
        this.setData({ uploading: false });
        if (ok > 0) {
          wx.showToast({ title: `已上传 ${ok} 张`, icon: 'success' });
          this.loadDetail();
        } else {
          wx.showToast({ title: '上传失败', icon: 'none' });
        }
        return;
      }
      api.v2SupplierUploadReceipt(id, paths[idx], 'production')
        .then(() => {
          ok += 1;
          next(idx + 1);
        })
        .catch(() => {
          _failIdx += 1;
          next(idx + 1);
        });
    };
    next(0);
  },

  // 预览回执大图
  onPreviewReceipt(e) {
    const current = e.currentTarget.dataset.url;
    const urls = this.data.receipts.map(r => this._absUrl(r));
    wx.previewImage({ current: this._absUrl(current), urls });
  },

  _absUrl(url) {
    if (!url) return '';
    if (/^https?:\/\//.test(url)) return url;
    return API_BASE + url;
  },
});
