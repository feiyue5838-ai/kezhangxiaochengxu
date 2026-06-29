// pages/newspaper/paper/index.js
const common = require('../../../utils/common.js');

Page({
  data: {
    statusBarHeight: 20,
    navHeight: 64,
    newspapers: [
      { id: 'paper_01', name: '成都商报', desc: '省级报刊，认可度高', price: 8 },
      { id: 'paper_02', name: '四川日报', desc: '省级党报，权威性强', price: 10 },
      { id: 'paper_03', name: '华西都市报', desc: '省级报刊，覆盖面广', price: 8 },
      { id: 'paper_04', name: '成都日报', desc: '市级党报，本地认可', price: 6 },
      { id: 'paper_05', name: '天府早报', desc: '市级报刊，价格实惠', price: 5 },
    ],
    selectedNewspaper: '',
    charCount: 0,
    estimatedCost: 0
  },

  onLoad() {
    // 计算导航栏高度
    const statusBarHeight = common.getNavigationHeight().statusBarHeight;
    const navHeight = statusBarHeight + 64;
    this.setData({ statusBarHeight, navHeight });

    // 从 Storage 读取登报内容
    const newspaperContent = wx.getStorageSync('newspaperContent') || {};
    if (newspaperContent.content) {
      const charCount = newspaperContent.content.length;
      this.setData({ charCount });
      this.calculateCost();
    }
  },

  // 选择报纸
  selectNewspaper(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({ selectedNewspaper: id });
    this.calculateCost();
  },

  // 计算预估费用
  calculateCost() {
    const { newspapers, selectedNewspaper, charCount } = this.data;
    if (!selectedNewspaper || charCount === 0) {
      this.setData({ estimatedCost: 0 });
      return;
    }
    const paper = newspapers.find(p => p.id === selectedNewspaper);
    if (paper) {
      const cost = Math.ceil(charCount * paper.price);
      this.setData({ estimatedCost: cost });
    }
  },

  // 确认选择
  confirmSelection() {
    if (!this.data.selectedNewspaper) {
      wx.showToast({ title: '请选择报纸', icon: 'none' });
      return;
    }

    // 保存选择的报纸到 Storage
    const paper = this.data.newspapers.find(p => p.id === this.data.selectedNewspaper);
    wx.setStorageSync('selectedNewspaper', {
      id: paper.id,
      name: paper.name,
      price: paper.price,
      estimatedCost: this.data.estimatedCost,
      _timestamp: Date.now()
    });

    // 跳转到订单确认页面
    wx.navigateTo({
      url: '/pages/newspaper/order/index'
    });
  },

  // 返回
  goBack() {
    wx.navigateBack();
  }
});
