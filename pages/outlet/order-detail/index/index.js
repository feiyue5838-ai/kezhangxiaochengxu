// pages/outlet/order-detail/index.js
const api = require('../../../utils/api')

Page({
  data: {
    id: '',
    order: null,
    receipts: [],
    loading: true,
    uploading: false,
  },

  onLoad(options) {
    this.setData({ id: options.id })
    this.loadDetail()
    this.loadReceipts()
  },

  async loadDetail() {
    try {
      const res = await api.getStoreOrders({})
      let list = []
      if (Array.isArray(res)) list = res
      else if (res && Array.isArray(res.list)) list = res.list
      else if (res && res.data && Array.isArray(res.data.list)) list = res.data.list
      else if (res && res.data && Array.isArray(res.data)) list = res.data

      const order = list.find(o => o.id === this.data.id)
      if (!order) {
        wx.showToast({ title: '订单不存在', icon: 'none' })
        setTimeout(() => wx.navigateBack(), 1200)
        return
      }
      this.setData({ order, loading: false })
    } catch (e) {
      console.error(e)
      wx.showToast({ title: e.message || '加载失败', icon: 'none' })
      this.setData({ loading: false })
    }
  },

  async loadReceipts() {
    try {
      const res = await api.getOutletReceipts({ orderId: this.data.id })
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
      await api.uploadReceipt(filePath, { orderId: this.data.id, type: 'certificate' })
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
})
