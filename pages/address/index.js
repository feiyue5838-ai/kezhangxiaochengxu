// pages/address/index.js
const api = require('../../utils/api.js');

Page({
  data: {
    mode: 'manage',        // manage=地址管理；select=下单时选择地址
    addresses: [],
    loading: true
  },

  onLoad(options) {
    this.setData({ mode: options && options.mode === 'select' ? 'select' : 'manage' });
  },

  onShow() {
    this.loadAddresses();
  },

  async loadAddresses() {
    this.setData({ loading: true });
    try {
      const list = await api.getAddressList();
      this.setData({ addresses: list || [], loading: false });
    } catch (e) {
      this.setData({ loading: false });
      wx.showToast({ title: '加载地址失败', icon: 'none' });
    }
  },

  // 选择地址（select 模式）：写入 storage 后返回
  onSelect(e) {
    if (this.data.mode !== 'select') return;
    const id = e.currentTarget.dataset.id;
    const addr = this.data.addresses.find(a => a.id === id);
    if (!addr) return;
    wx.setStorageSync('selectedAddress', addr);
    wx.navigateBack();
  },

  // 编辑地址
  onEdit(e) {
    const id = e.currentTarget.dataset.id;
    const addr = this.data.addresses.find(a => a.id === id);
    if (!addr) return;
    wx.setStorageSync('editingAddress', addr);
    wx.navigateTo({ url: '/pages/address/edit/index?id=' + id });
  },

  // 删除地址
  onDelete(e) {
    const id = e.currentTarget.dataset.id;
    const that = this;
    wx.showModal({
      title: '删除地址',
      content: '确定删除该收货地址？',
      confirmColor: '#FF4D4F',
      success(res) {
        if (res.confirm) {
          wx.showLoading({ title: '删除中' });
          api.deleteAddress(id).then(() => {
            wx.hideLoading();
            wx.showToast({ title: '已删除', icon: 'success' });
            that.loadAddresses();
          }).catch(() => wx.hideLoading());
        }
      }
    });
  },

  onAdd() {
    wx.navigateTo({ url: '/pages/address/edit/index' });
  },

  goBack() {
    wx.navigateBack();
  }
});
