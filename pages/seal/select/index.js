// pages/seal/select/index.js
const common = require('../../../utils/common.js');

Page({
  data: {
    selectedId: null,
    popupTitle: '',
    pageTitle: '自选刻章',
    categories: [
      { id: 1, name: '个体户' },
      { id: 2, name: '公司' },
      { id: 3, name: '新成立开户必备章' },
      { id: 4, name: '单位名称变更必备章' },
      { id: 5, name: '单位法人变更必备章' },
      { id: 6, name: '政府事业单位' },
      { id: 7, name: '钢印章' },
      { id: 8, name: '其他章名' }
    ]
  },

  onLoad(options) {
    if (options.type) {
      this.setData({ selectedId: Number(options.type) });
    }

    this.setData({ pageTitle: '自选刻章' });
  },

  // 返回上一页
  goBack() {
    wx.navigateBack({ delta: 1 });
  },

  onSelect(e) {
    const id = Number(e.currentTarget.dataset.id);
    this.setData({ selectedId: id });
    const cat = this.data.categories.find(c => c.id === id);
    const categoryName = cat ? cat.name : '';

    // 个体户：使用筛选弹窗
    if (id === 1) {
      this.setData({ popupTitle: cat.name });
      this.selectComponent('#sealPopup').openWithCategory(1);
      return;
    }

    // 公司：使用筛选弹窗（全部）
    if (id === 2) {
      this.setData({ popupTitle: cat.name });
      this.selectComponent('#sealPopup').openWithCategory(2);
      return;
    }

    // 新成立开户必备章：使用筛选弹窗
    if (id === 3) {
      this.setData({ popupTitle: cat.name });
      this.selectComponent('#sealPopup').openWithCategory(3);
      return;
    }

    // 单位名称变更必备章：使用筛选弹窗
    if (id === 4) {
      this.setData({ popupTitle: cat.name });
      this.selectComponent('#sealPopup').openWithCategory(4);
      return;
    }

    // 单位法人变更必备章：使用筛选弹窗
    if (id === 5) {
      this.setData({ popupTitle: cat.name });
      this.selectComponent('#sealPopup').openWithCategory(5);
      return;
    }

    // 政府事业单位：使用筛选弹窗
    if (id === 6) {
      this.setData({ popupTitle: cat.name });
      this.selectComponent('#sealPopup').openWithCategory(6);
      return;
    }

    // 钢印章：使用筛选弹窗
    if (id === 7) {
      this.setData({ popupTitle: cat.name });
      this.selectComponent('#sealPopup').openWithCategory(7);
      return;
    }

    // 其他章名：使用筛选弹窗
    if (id === 8) {
      this.setData({ popupTitle: cat.name });
      this.selectComponent('#sealPopup').openWithCategory(8);
      return;
    }
  },

  onSealConfirm(e) {
    const { ids, names, seals, count } = e.detail;
    const selectedCat = this.data.categories.find(c => c.id === this.data.selectedId);
    const categoryName = selectedCat ? selectedCat.name : '';

    // 存入 Storage，避免 URL 参数过长或编码问题
    wx.setStorageSync('selectedSealsData', {
      ids: ids || [],
      names: names || [],
      seals: seals || '',
      categoryName: categoryName,
      _timestamp: Date.now()
    });

    wx.navigateTo({
      url: '/pages/seal/order-confirm/index'
    });
  }
});
