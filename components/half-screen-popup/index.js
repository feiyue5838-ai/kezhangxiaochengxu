// components/half-screen-popup/index.js
const api = require('../../utils/api.js');
const common = require('../../utils/common.js');

// 4 分类 API 分类 ID（企业刻章作为 open() 默认值）
const DEFAULT_CATEGORY_ID = 'afd862ed-208d-4a11-b3ff-ebee46f2ff37';

Component({
  properties: {
    title: { type: String, value: '个体户' },
    // 来源页面导航栏标题，用于弹窗顶部导航显示（如"个人印章"）
    sourceTitle: { type: String, value: '印章预览' }
  },

  data: {
    statusBarHeight: 20,
    navHeight: 64,
    topPreviewHeight: 420,
    menuButtonTop: 28,
    menuButtonHeight: 32,
    visible: false,
    show: false,
    selectedIds: [],
    selectedSealImg: '',
    selectedSealName: '',
    selectedSealDesc: '',
    previewSeals: [],
    previewCurrent: 0,

    // 筛选后数据
    filteredSingleSeals: [],
    filteredPackages: [],

    // 全部原始数据（由 open/openWithCategory/openWithScene 动态填充）
    singleSeals: [],
    packages: [],

    // 当前业务类型ID，0=全部
    currentCategoryId: 0,
  },

  lifetimes: {
    attached() {
      const sys = wx.getSystemInfoSync();
      const statusBarHeight = sys.statusBarHeight || 20;

      let navContentHeight = 44;
      let menuButtonTop = statusBarHeight + 8;
      let menuButtonHeight = 32;

      try {
        const menuButton = wx.getMenuButtonBoundingClientRect();
        if (menuButton && menuButton.height) {
          navContentHeight = menuButton.height + (menuButton.top - statusBarHeight) * 2;
          menuButtonTop = menuButton.top;
          menuButtonHeight = menuButton.height;
        }
      } catch (e) {
        navContentHeight = 44;
      }

      const navHeight = statusBarHeight + navContentHeight;
      const topPreviewHeight = Math.round(320 / 750 * sys.windowWidth);

      this.setData({
        statusBarHeight,
        navHeight,
        topPreviewHeight,
        menuButtonTop,
        menuButtonHeight
      });
    }
  },

  methods: {

    // 重映射选中态（数据已在 _loadAndOpen 中按场景/分类限定，无需二次按分类过滤）
    _applyFilter(catId) {
      const selectedIds = this.data.selectedIds;
      const isSelected = id => selectedIds.indexOf(id) !== -1;
      this.setData({
        filteredSingleSeals: this.data.singleSeals.map(s => ({ ...s, selected: isSelected(s.id) })),
        filteredPackages: this.data.packages.map(p => ({ ...p, selected: isSelected(p.id) })),
        currentCategoryId: catId || 0
      });
    },

    // 从 API 加载印章和套餐，并更新组件内部数据
    _loadAndOpen(categoryId, sceneName) {
      wx.showLoading({ title: '加载中...', mask: true });
      api.getSealSceneProducts(categoryId).then(res => {
        wx.hideLoading();
        if (!res || (!res.seals && !res.packages)) {
          wx.showToast({ title: '加载失败', icon: 'none' });
          return;
        }
        // 映射印章数据
        const apiSeals = (res.seals || []).map(s => ({
          id: s.id,
          name: s.name,
          // 统一印章图片（使用 seal-caiwuzhang 作为通用占位图，真实产品图后续替换）
          img: s.image || '/assets/images/seal-gongzhang.svg',
          price: Number(s.price),
          description: s.description || '',
          categoryName: (s.category && s.category.name) || '',
        }));
        // 映射套餐数据
        const apiPackages = (res.packages || []).map(p => ({
          id: p.id,
          name: p.name,
          badge: p.badge || '',
          price: Number(p.price),
          // 套餐内印章预览：存 UUID 列表（供 _updatePreview 查找名称/图片）
          seals: (p.seals || []).map(s => s.id),
          sealNames: (p.seals || []).map(s => s.name).join('、'),
          categoryName: (p.category && p.category.name) || '',
        }));

        const allSeals = apiSeals;
        const allPackages = apiPackages;

        this.setData({
          singleSeals: allSeals,
          packages: allPackages,
          filteredSingleSeals: allSeals.map(s => ({ ...s, selected: false })),
          filteredPackages: allPackages.map(p => ({ ...p, selected: false })),
          selectedIds: [],
          selectedSealImg: '',
          selectedSealName: '',
          selectedSealDesc: '',
          previewSeals: [],
          previewCurrent: 0,
          currentCategoryId: categoryId,
          visible: true,
        });
        setTimeout(() => { this.setData({ show: true }); }, 30);
      }).catch(err => {
        wx.hideLoading();
        wx.showToast({ title: '加载失败', icon: 'none' });
        console.error('_loadAndOpen error:', err);
      });
    },

    // 打开弹窗（默认，显示企业刻章全部印章）
    open() {
      this._loadAndOpen(DEFAULT_CATEGORY_ID, '企业刻章');
    },

    // 打开弹窗并指定分类（API 方式，form 页面用）
    openWithCategory(catId) {
      this._loadAndOpen(catId, '');
    },

    // 打开弹窗并从 API 加载业务场景下的印章和套餐（select 页面用）
    openWithScene(sceneId) {
      this._loadAndOpen(sceneId, '');
    },

    close() {
      this.setData({ show: false });
      setTimeout(() => {
        this.setData({
          visible: false,
          selectedIds: [],
          selectedSealImg: '',
          selectedSealName: '',
          selectedSealDesc: '',
          previewSeals: [],
          previewCurrent: 0
        });
      }, 300);
    },

    // 切换选择状态（wxml 中 seal 卡片的 bindtap="onSelect" 调用此函数）
    onSelect(e) {
      const { id } = e.currentTarget.dataset;
      const { selectedIds } = this.data;
      const idx = selectedIds.indexOf(id);
      let newIds;
      if (idx === -1) {
        newIds = [...selectedIds, id];
      } else {
        newIds = selectedIds.filter(x => x !== id);
      }
      this.setData({ selectedIds: newIds });
      this._applyFilter(this.data.currentCategoryId);
      this._updatePreview();
    },

    _updatePreview() {
      const all = this.data.singleSeals.concat(this.data.packages);
      const chosen = this.data.selectedIds.map(sid => all.find(s => s.id === sid)).filter(Boolean);
      if (chosen.length === 0) {
        this.setData({ selectedSealImg: '', selectedSealName: '', selectedSealDesc: '', previewSeals: [], previewCurrent: 0 });
        return;
      }
      if (chosen.length === 1 && chosen[0].img) {
        const desc = chosen[0].description || '';
        this.setData({ selectedSealImg: chosen[0].img, selectedSealName: chosen[0].name, selectedSealDesc: desc, previewSeals: [], previewCurrent: 0 });
      } else if (chosen.length === 1 && chosen[0].seals) {
        // 套餐：从 singleSeals 中找印章图片
        const seals = chosen[0].seals.map(sid => {
          const s = this.data.singleSeals.find(x => x.id === sid);
          return s ? { name: s.name, img: s.img } : null;
        }).filter(Boolean);
        const desc = chosen[0].description || '';
        this.setData({ selectedSealImg: '', selectedSealName: chosen[0].name, selectedSealDesc: desc, previewSeals: seals, previewCurrent: 0 });
      } else {
        // 多选
        const imgs = chosen.map(c => c.img).filter(Boolean);
        const firstImg = imgs[0] || '';
        const nameStr = chosen.map(c => c.name).join(' + ');
        const desc = chosen.map(c => c.description).filter(Boolean).join('；');
        this.setData({ selectedSealImg: firstImg, selectedSealName: nameStr, selectedSealDesc: desc, previewSeals: [], previewCurrent: 0 });
      }
    },

    // 顶部预览区点击（当前仅占位，不改变布局）
    onPreviewTap() {},

    // 点击遮罩关闭弹窗
    onMaskTap() {
      this.close();
    },

    // 关闭按钮（拖拽条 / 头部 ×）
    onClose() {
      this.close();
    },

    // 套餐预览轮播切换
    onSwiperChange(e) {
      this.setData({ previewCurrent: e.detail.current });
    },

    // 阻止冒泡（避免点弹窗内部误触关闭）
    preventClose() {},

    onConfirm() {
      if (!this.data.selectedIds.length) {
        wx.showToast({ title: '请先选择印章', icon: 'none' });
        return;
      }
      const all = this.data.singleSeals.concat(this.data.packages);
      const chosen = this.data.selectedIds.map(sid => all.find(s => s.id === sid)).filter(Boolean);
      const ids = chosen.map(c => c.id);
      const names = chosen.map(c => c.name);
      const seals = chosen.map(c => c.seals ? c.seals.join(',') : c.id).join(',');
      this.triggerEvent('confirm', { ids, names, seals, count: chosen.length });
      this.close();
    }
  }
});
