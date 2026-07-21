// pages/seal/select/index.js
const api = require('../../../utils/api.js');

Page({
  data: {
    selectedId: null,
    popupTitle: '',
    pageTitle: '自选刻章',
    scenes: [],        // 业务场景列表（从 API 加载）
    loading: true,
  },

  onLoad(options) {
    if (options.type) {
      this.setData({ selectedId: Number(options.type) });
    }
    this.setData({ pageTitle: '自选刻章' });
    this._loadScenes();
  },

  // 从 API 加载业务场景列表
  _loadScenes() {
    wx.showLoading({ title: '加载中...', mask: true });
    api.getSealScenes().then(res => {
      wx.hideLoading();
      if (Array.isArray(res) && res.length > 0) {
        // 过滤掉不需要的场景
        const filteredScenes = res.filter(item => 
          item.name !== '刻章备案查询' && 
          item.name !== '电子印章' && 
          item.name !== '个人印章'
        );
        this.setData({ scenes: filteredScenes, loading: false });
      } else {
        this.setData({ loading: false });
        wx.showToast({ title: '加载失败', icon: 'none' });
      }
    }).catch(() => {
      wx.hideLoading();
      this.setData({ loading: false });
      wx.showToast({ title: '加载失败', icon: 'none' });
    });
  },

  // 返回上一页
  goBack() {
    wx.navigateBack({ delta: 1 });
  },

  // 用户点击场景卡片
  onSelect(e) {
    const sceneId = e.currentTarget.dataset.id;
    const scene = this.data.scenes.find(s => s.id === sceneId);
    if (!scene) return;

    this.setData({
      selectedId: sceneId,
      popupTitle: scene.name,
      // 暂存当前场景数据（用于 onSealConfirm 构建 items）
      _currentScene: scene,
    });

    // 调用 half-screen-popup 从 API 加载印章和套餐
    this.selectComponent('#sealPopup').openWithScene(sceneId);
  },

  // half-screen-popup 确认回调
  onSealConfirm(e) {
    const { ids, names } = e.detail;
    const scene = this.data._currentScene;

    // 从 half-screen-popup 内部数据构建 items（带真实 UUID 和价格）
    const popup = this.selectComponent('#sealPopup');
    const singleSeals = popup.data.singleSeals || [];
    const packages = popup.data.packages || [];
    const allItems = [...singleSeals, ...packages];

    const items = ids.map(id => {
      const item = allItems.find(x => x.id === id);
      if (!item) return null;
      return {
        itemType: packages.find(p => p.id === id) ? 'package' : 'seal',
        sealId: singleSeals.find(s => s.id === id) ? id : null,
        packageId: packages.find(p => p.id === id) ? id : null,
        name: item.name,
        price: item.price || 0,
        quantity: 1,
      };
    }).filter(Boolean);

    // 计算总价（取套餐价格 OR 印章单价）
    const totalPrice = items.reduce((sum, item) => {
      return sum + (item.price || 0) * (item.quantity || 1);
    }, 0);

    // 存入 Storage，供 order-confirm 页面使用
    wx.setStorageSync('selectedSealsData', {
      ids: ids || [],
      names: names || [],
      categoryName: scene ? scene.name : '',
      _timestamp: Date.now(),
      items,          // 带真实 UUID + 价格，order-confirm 直接使用
      totalPrice,     // 预计算总价
    });

    wx.navigateTo({
      url: '/pages/seal/order-confirm/index'
    });
  }
});
