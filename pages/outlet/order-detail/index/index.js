// pages/outlet/order-detail/index.js
const api = require('../../../../utils/api')

// 状态流转说明
const STATUS_STEPS = [
  { status: 2, label: '已支付' },
  { status: 3, label: '制作中' },
  { status: 4, label: '已发货' },
]

Page({
  data: {
    id: '',         // assignment.id
    orderId: '',    // sealOrder.id
    order: null,
    receipts: [],
    loading: true,
    actionLoading: false,
    uploading: false,
    currentStep: 0,
  },

  onLoad(options) {
    this.setData({ id: options.id })
    this.loadDetail()
  },

  async loadDetail() {
    this.setData({ loading: true })
    try {
      const order = await api.getStoreOrderDetail(this.data.id)
      const step = STATUS_STEPS.findIndex(s => s.status === order.status)
      this.setData({
        order,
        orderId: order.orderId,
        receipts: order.receipts || [],
        loading: false,
        currentStep: step >= 0 ? step : 0,
      })
    } catch (e) {
      console.error(e)
      wx.showToast({ title: e.message || '加载失败', icon: 'none' })
      this.setData({ loading: false })
    }
  },

  // ── 操作：接单 ──────────────────────────────
  async onAccept() {
    wx.showModal({
      title: '确认接单',
      content: '确定要接下此订单吗？',
      success: async (res) => {
        if (!res.confirm) return
        await this._doAction('accept', '接单成功')
      }
    })
  },

  // ── 操作：完成制作 ─────────────────────────
  async onComplete() {
    wx.showModal({
      title: '完成制作',
      content: '印章已制作完成，确定吗？',
      success: async (res) => {
        if (!res.confirm) return
        await this._doAction('complete', '制作完成')
      }
    })
  },

  // ── 操作：发货 ─────────────────────────────
  async onShip() {
    wx.showModal({
      title: '确认发货',
      content: '确定已发货并寄出？',
      success: async (res) => {
        if (!res.confirm) return
        await this._doAction('ship', '发货成功')
      }
    })
  },

  // 通用操作调用
  async _doAction(action, successMsg) {
    this.setData({ actionLoading: true })
    try {
      if (action === 'accept') {
        await api.acceptOrder(this.data.orderId)
      } else if (action === 'complete') {
        await api.completeOrder(this.data.orderId)
      } else if (action === 'ship') {
        await api.shipOrder(this.data.orderId)
      }
      wx.showToast({ title: successMsg, icon: 'success' })
      this.loadDetail() // 重新拉取最新状态
      this.loadReceipts()
    } catch (e) {
      console.error(e)
      wx.showToast({ title: e.message || '操作失败', icon: 'none' })
    } finally {
      this.setData({ actionLoading: false })
    }
  },

  // ── 回执相关 ────────────────────────────────
  async loadReceipts() {
    try {
      const res = await api.getOutletReceipts({ orderId: this.data.orderId })
      let receipts = []
      if (Array.isArray(res)) receipts = res
      else if (res && Array.isArray(res.list)) receipts = res.list
      else if (res && res.data && Array.isArray(res.data.list)) receipts = res.data.list
      this.setData({ receipts })
    } catch (e) {
      console.error(e)
    }
  },

  chooseAndUpload() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFile = res.tempFiles[0].tempFilePath
        this.doUpload(tempFile)
      },
    })
  },

  async doUpload(filePath) {
    this.setData({ uploading: true })
    try {
      await api.uploadReceipt(filePath, { orderId: this.data.orderId, type: 'certificate' })
      wx.showToast({ title: '上传成功', icon: 'success' })
      this.loadReceipts()
    } catch (e) {
      console.error(e)
      wx.showToast({ title: e.message || '上传失败', icon: 'none' })
    } finally {
      this.setData({ uploading: false })
    }
  },

  previewImage(e) {
    const url = e.currentTarget.dataset.url
    wx.previewImage({ urls: [url], current: url })
  },

  // ── 下拉刷新 ────────────────────────────────
  onPullDownRefresh() {
    this.loadDetail().then(() => wx.stopPullDownRefresh())
  },
})
