// pages/newspaper/paper.js
// 选择报纸页面
const paperConfig = require('../../utils/newspaper-papers.js');
const common = require('../../utils/common.js');

Page({
  data: {
    content: '',
    selectedPaper: null,
    totalPrice: 0,
    isSubmitting: false,
    papers: []
  },

  onLoad(options) {
    // 导航栏高度
    const statusBarHeight = common.getNavigationHeight().statusBarHeight;
    const navHeight = statusBarHeight + 64;

    this.setData({
      statusBarHeight,
      navHeight,
      scrollPadding: navHeight + (options.content ? 180 : 20)
    });

    // 接收登报内容（从 content-edit 页通过 Storage 传递）
    const contentData = wx.getStorageSync('newspaperContent') || {};
    if (contentData.content) {
      this.setData({ content: contentData.content });
    }

    // 加载报纸列表
    this.setData({ papers: paperConfig.getAllPapers() || [] });
  },

  goBack() {
    wx.navigateBack();
  },

  selectPaper(e) {
    const id = e.currentTarget.dataset.id;
    const paper = paperConfig.getPaperById(id);
    if (paper) {
      this.setData({
        selectedPaper: id,
        totalPrice: paper.price
      });
    }
  },

  submitOrder() {
    // 防重复提交
    if (this.data.isSubmitting) {
      wx.showToast({ title: '请求处理中，请稍候', icon: 'none' });
      return;
    }

    if (!this.data.selectedPaper) {
      wx.showToast({ title: '请先选择报纸', icon: 'none' });
      return;
    }

    const paper = paperConfig.getPaperById(this.data.selectedPaper);
    if (!paper) {
      wx.showToast({ title: '报纸信息有误', icon: 'none' });
      return;
    }

    // 确认弹窗
    wx.showModal({
      title: '确认选择',
      content: `报纸：${paper.name}\n费用：¥${paper.price}`,
      confirmText: '确认',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          this.setData({ isSubmitting: true });

          // 创建订单
          const orderData = {
            id: Date.now(),
            module: 'newspaper',
            type: paper.name,
            content: this.data.content || '',
            paperId: this.data.selectedPaper,
            price: paper.price,
            status: 'pending',
            statusText: '待支付',
            createTime: new Date().toISOString()
          };
          common.saveOrder('newspaper_orders', orderData);

          wx.showToast({ title: '提交成功', icon: 'success' });
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/newspaper/order-detail?id=' + orderData.id
            });
          }, 500);
        }
      }
    });
  }
});
