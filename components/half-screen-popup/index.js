// components/half-screen-popup/index.js
const api = require('../../utils/api.js');
const common = require('../../utils/common.js');

// 4 分类 API 分类 ID（企业刻章作为 open() 默认值）
const DEFAULT_CATEGORY_ID = 'afd862ed-208d-4a11-b3ff-ebee46f2ff37';

Component({
  properties: {
    title: { type: String, value: '个体户' },
    // 来源页面导航栏标题，用于弹窗顶部导航显示（如"个人印章"）
    sourceTitle: { type: String, value: '印章预览' },
    // 许可证签发地省份/城市，用于按城市 tier 显示差异价格（displayPrice）
    licenseRegion: {
      type: String,
      value: '',
      observer(newVal) {
        this.setData({ _licenseRegion: newVal });
        // 如果弹窗已打开，自动重载数据以刷新 displayPrice
        if (this.data.visible) {
          this._loadAndOpen(this.data.currentCategoryId, '');
        }
      }
    }
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

    // 许可证签发地（透给 API 用于 tier 价格计算）
    _licenseRegion: '',
  },

  lifetimes: {
    attached() {
      // 优先使用新 API
      const sys = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
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

    // 解析 "省 市" 格式的地区字符串（与后端 resolveRegionPrice 保持一致）
    _parseRegion(region) {
      if (!region) return { province: '', city: '' };
      const parts = region.split(' ');
      return { province: parts[0] || '', city: parts[1] || '' };
    },
    // 计算地区价：openWithData 场景下单独特立计算（空 region 或无 region_prices 时回退 base displayPrice）
    _calcDisplayPrice(item, region) {
      if (!region || !item.region_prices) return Number(item.displayPrice ?? item.price ?? 0);
      const { province, city } = this._parseRegion(region);
      const rp = item.region_prices;
      if (rp[city]) return Number(rp[city]);
      if (rp[province]) return Number(rp[province]);
      return Number(item.displayPrice ?? item.price ?? 0);
    },

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
      api.getSealSceneProducts(categoryId, this.data._licenseRegion).then(res => {
        wx.hideLoading();
        if (!res || (!res.seals && !res.packages)) {
          wx.showToast({ title: '加载失败', icon: 'none' });
          return;
        }
        // 映射印章数据（displayPrice 由后端按 licenseRegion tier 计算）
        const apiSeals = (res.seals || []).map(s => ({
          id: s.id,
          name: s.name,
          // 印章图片：后端返回相对路径 /uploads/seals/xxx，需拼 API_BASE 才能在小程序加载
          img: s.image ? api.API_BASE + s.image : '/assets/images/seal-default.png',
          price: Number(s.price),
          displayPrice: Number(s.displayPrice),
          description: s.description || '',
          categoryName: (s.seal_categories && s.seal_categories.name) || '',
        }));
        // 映射套餐数据
        const apiPackages = (res.packages || []).map(p => ({
          id: p.id,
          name: p.name,
          badge: p.badge || '',
          price: Number(p.price),
          displayPrice: Number(p.displayPrice),
          // 套餐内印章预览：存 UUID 列表（供 _updatePreview 查找名称/图片）
          seals: (p.seals || []).map(s => s.id),
          sealNames: (p.seals || []).map(s => s.name).join('、'),
          // 套餐自己上传的图片（管理后台维护），预览时优先展示
          images: (p.images || []).map(u => api.API_BASE + u),
          categoryName: (p.seal_categories && p.seal_categories.name) || '',
        }));

        // 如果传了 filterSealId，只保留匹配的印章，清空套餐
        let allSeals = apiSeals;
        let allPackages = apiPackages;
        if (this._filterSealId) {
          allSeals = apiSeals.filter(s => s.id === this._filterSealId);
          allPackages = [];
          this._filterSealId = null;
        }

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
    // @param {string} catId - 场景 ID
    // @param {string} [filterSealId] - 按印章子分类 ID 过滤（个人印章签名章/执业资格章）
    openWithCategory(catId, filterSealId) {
      this._filterSealId = filterSealId || null;
      this._loadAndOpen(catId, '');
    },

    // 打开弹窗并使用预加载数据（form 页面电子印章用，避免二次 API 调用）
    openWithData(seals, packages, region) {
      wx.hideLoading();
      const r = region || this.data._licenseRegion || '';
      const mapSeal = s => ({
        id: s.id,
        name: s.name,
        img: s.image ? api.API_BASE + s.image : '/assets/images/seal-default.png',
        price: Number(s.price),
        displayPrice: this._calcDisplayPrice(s, r),
        description: s.description || '',
        categoryName: (s.seal_categories && s.seal_categories.name) || (s.category && s.category.name) || '',
      });
      const mapPackage = p => ({
        id: p.id,
        name: p.name,
        badge: p.badge || '',
        price: Number(p.price),
        displayPrice: this._calcDisplayPrice(p, r),
        seals: (p.seals || []).map(s => s.id),
        sealNames: (p.seals || []).map(s => s.name).join('、'),
        // 套餐自己上传的图片（管理后台维护），预览时优先展示
        images: (p.images || []).map(u => api.API_BASE + u),
        categoryName: (p.seal_categories && p.seal_categories.name) || (p.category && p.category.name) || '',
      });

      const apiSeals = (seals || []).map(mapSeal);
      const apiPackages = (packages || []).map(mapPackage);

      this.setData({
        singleSeals: apiSeals,
        packages: apiPackages,
        filteredSingleSeals: apiSeals.map(s => ({ ...s, selected: false })),
        filteredPackages: apiPackages.map(p => ({ ...p, selected: false })),
        selectedIds: [],
        selectedSealImg: '',
        selectedSealName: '',
        selectedSealDesc: '',
        previewSeals: [],
        previewCurrent: 0,
        currentCategoryId: '1e3aaa8c-3318-4651-a141-924ab84aa2e0',
        visible: true,
      });
      setTimeout(() => { this.setData({ show: true }); }, 30);
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
        // 套餐：优先用套餐自己上传的图片（管理后台维护）；没有自定义图片则显示默认章图
        let seals;
        if (chosen[0].images && chosen[0].images.length) {
          seals = chosen[0].images.map(img => ({ name: '', img }));
        }
        const desc = chosen[0].description || '';
        const hasCarousel = seals && seals.length > 0;
        this.setData({
          selectedSealImg: hasCarousel ? '' : '/assets/images/seal-default.png',
          selectedSealName: chosen[0].name,
          selectedSealDesc: hasCarousel ? desc : ('含：' + (chosen[0].sealNames || '')),
          previewSeals: seals || [],
          previewCurrent: 0
        });
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
      const singleSeals = this.data.singleSeals || [];
      const packages = this.data.packages || [];
      const all = singleSeals.concat(packages);
      const chosen = this.data.selectedIds.map(sid => all.find(s => s.id === sid)).filter(Boolean);

      // 构造 items 数组（snake_case 字段名，与后端 order.service.ts 解构对齐）
      const items = chosen.map(c => {
        const isPackage = packages.some(p => p.id === c.id);
        return {
          item_type: isPackage ? 'package' : 'seal',
          seal_id: isPackage ? null : c.id,
          package_id: isPackage ? c.id : null,
          name: c.name,
          price: Number(c.displayPrice ?? c.price ?? 0),
          quantity: 1,
          image: c.img || null,
        };
      });
      const totalPrice = items.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 1), 0);

      const ids = chosen.map(c => c.id);
      const names = chosen.map(c => c.name);
      const seals = chosen.map(c => c.seals ? c.seals.join(',') : c.id).join(',');
      this.triggerEvent('confirm', { ids, names, seals, items, totalPrice, count: chosen.length });
      this.close();
    }
  }
});
