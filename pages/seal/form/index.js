// pages/seal/form/index.js
const common = require('../../../utils/common.js');
const api = require('../../../utils/api.js');

const regionData = require('../../../utils/region-data.js');
const P = regionData.provincesShort;
const D = regionData.districtsShort;
// 三级联动用的查表：省简称 → 省全称；省全称 → 城市列表；城市全称 → 区县列表
const PROVINCE_SHORT_TO_FULL = {};
for (const shortName of P) {
  const full = Object.keys(regionData.provinceToCities || {}).find((f) => f.startsWith(shortName));
  PROVINCE_SHORT_TO_FULL[shortName] = full || shortName;
}
const PROVINCE_TO_CITIES = regionData.provinceToCities || {};
const CITIES_TO_DISTRICTS = regionData.cityToDistricts || {};

Page({
  data: {
    formValid: false,
    formData: null,
    stampType: 'company',
    isPersonal: false,
    isQuery: false,
    pageTitle: '印章申请',
    currentProvince: { name: '四川省', url: 'https://yzcx.sczwfw.gov.cn:18511/', cities: [{ name: '成都市', url: 'https://yzcx.sczwfw.gov.cn:18511/' }] },
    currentCity: '成都市',
    provinceIndex: 0,
    provinces: [],  // 备案查询：34个省份数据（从API加载）
    _provinceOrig: { name: '四川省', url: 'https://yzcx.sczwfw.gov.cn:18511/', cities: [{ name: '成都市', url: 'https://yzcx.sczwfw.gov.cn:18511/' }] },
    personalSeals: [],
    selectedCategory: '058ce9b9-ed91-4ee8-905e-1234327c653f',
    selectedSeal: '',
    selectedSealName: '',
    isElectronic: false,
    selectedElectronicSeal: '',
    selectedElectronicSealName: '',
    _allElectronicSeals: [],
    _allElectronicPackages: [],
    electronicSeals: [
      { id: 'e1', name: '公章', subCategoryId: 'e4039545-cd0e-41a3-8596-19651a546690' },
      { id: 'e2', name: '财务章', subCategoryId: '202cce9c-e291-47a5-a4fa-6cdd30f5e066' },
      { id: 'e3', name: '合同章', subCategoryId: 'cd0ec952-66b0-4101-8c30-95f3a0b9e450' },
      { id: 'e4', name: '法人章', subCategoryId: '815fc362-b3d2-4bd0-8405-5c965e540eac' },
      { id: 'e5', name: '发票章', subCategoryId: '4c735b54-5e97-4b7f-9be3-ef8b5444e3a6' },
      { id: 'e6', name: '个人签名章', subCategoryId: '045b2619-095b-4ea1-85cb-4d1820713992' },
      { id: 'e7', name: '其他印章', subCategoryId: 'af215e4a-9dfb-4881-bd14-7dd3b5a80ada' }
    ],
    selectedElectronicCategory: '',
    popupTitle: '',
    // 地区选择器
    showRegion: false,
    ri: [0, 0, 0],
    ps: P,
    cs: [],
    ds: [],
    currentRegion: ''
  },

  onLoad(options) {
    // 清除旧流程数据，避免各入口互相影响
    // 只清除流程核心数据,不清除材料/地址/发票(用户在流程中可以来回切换)
    wx.removeStorageSync('selectedSealsData');
    wx.removeStorageSync('sealOrderForm');

    const type = options.type || 'company';
    const isPersonal = (type === 'personal');
    const isQuery = (type === 'query');
    const isElectronic = (type === 'electronic');

    const titles = {
      'company': '企业刻章',
      'personal': '个人印章',
      'electronic': '电子印章',
      'query': '刻章备案查询'
    };

    this.setData({
      stampType: type,
      isPersonal: isPersonal,
      isQuery: isQuery,
      isElectronic: isElectronic,
      formValid: false,
      currentProvince: this.data.currentProvince,
      currentCity: this.data.currentCity,
      pageTitle: titles[type] || '企业刻章'
    });

    // 刻章备案查询模式：从 API 加载34个省份数据
    if (isQuery) {
      this._loadProvinces();
    }

    // 电子印章模式：预加载全部电子印章数据
    if (isElectronic) {
      this._loadElectronicSeals();
    }
  },

  // 从 API 加载备案查询省份数据（34个省份）
  _loadProvinces() {
    const QUERY_SCENE_ID = '9837519a-9dbf-4e52-b19e-60eea192eef6';
    api.getSealSceneProducts(QUERY_SCENE_ID).then(res => {
      if (res && res.seals) {
        // 解析省份数据：name=省份名, description=平台名+换行+网址
        const provinces = res.seals.map(s => {
          const lines = (s.description || '').split('\n');
          const platformName = lines[0] || '';
          const url = lines[1] || '';
          return {
            name: s.name,
            url: url,
            platformName: platformName,
            id: s.id
          };
        });
        // 找到四川在列表中的索引（默认选中）
        const sichuanIdx = provinces.findIndex(p => p.name === '四川省');
        const defaultIdx = sichuanIdx >= 0 ? sichuanIdx : 0;
        const defaultProvince = provinces[defaultIdx];
        this.setData({
          provinces: provinces,
          provinceIndex: defaultIdx,
          currentProvince: {
            name: defaultProvince.name,
            url: defaultProvince.url,
            platformName: defaultProvince.platformName
          },
          currentCity: ''
        });
      }
    }).catch(err => {
      console.error('加载省份数据失败:', err);
    });
  },

  // 返回上一页
  goBack() {
    wx.navigateBack({ delta: 1 });
  },

  // 阻止地区选择面板内的事件冒泡
  preventBubble() {
    // 空函数，仅用于阻止事件冒泡
  },

  // 地区选择器
  onOpenRegion() {
    // 三级选择器（省+市+区），根据省简称反查省全称，取该省下属市
    const riOld = (this.data.ri && this.data.ri.length === 3) ? this.data.ri : [0, 0, 0];
    const pvShort = P[riOld[0]] || P[0];
    const pvFull = (PROVINCE_SHORT_TO_FULL && PROVINCE_SHORT_TO_FULL[pvShort]) || pvShort;
    const cities = (PROVINCE_TO_CITIES[pvFull] || []).slice();
    const di = Math.min(riOld[1], cities.length - 1);
    const districts = (CITIES_TO_DISTRICTS[cities[di]] || []).slice();
    const tri = [riOld[0], di, Math.min(riOld[2], Math.max(districts.length - 1, 0))];
    // 先重置再打开，确保 picker-view 重新渲染
    this.setData({ showRegion: false, ri: [-1, -1, -1], cs: [], ds: [] });
    setTimeout(() => {
      this.setData({ showRegion: true, ri: tri, cs: cities, ds: districts });
    }, 50);
  },
  closeRegion() {
    this.setData({ showRegion: false });
  },
  onRegionChange(e) {
    // 三级联动：v=[省idx, 市idx, 区idx]
    const v = e.detail.value || [0, 0, 0];
    const pi = Math.max(0, Number(v[0]) || 0);
    const pvShort = P[pi] || P[0];
    const pvFull = (PROVINCE_SHORT_TO_FULL && PROVINCE_SHORT_TO_FULL[pvShort]) || pvShort;
    const cities = (PROVINCE_TO_CITIES[pvFull] || []).slice();
    // 城市索引越界时回退 0
    const ci = Math.min(Math.max(Number(v[1]) || 0, 0), Math.max(cities.length - 1, 0));
    const cityFull = cities[ci] || '';
    const districts = (CITIES_TO_DISTRICTS[cityFull] || []).slice();
    const di = Math.min(Math.max(Number(v[2]) || 0, 0), Math.max(districts.length - 1, 0));
    this.setData({ ri: [pi, ci, di], cs: cities, ds: districts });
  },
  confirmRegion() {
    const { ri, cs, ds } = this.data;
    const province = P[ri[0]] || '';
    const city = cs[ri[1]] || '';
    const district = ds[ri[2]] || '';
    // 三级显示：省 市 区
    const region = [province, city, district].filter(Boolean).join(' ');
    this.setData({
      showRegion: false,
      currentRegion: region,
      currentCity: city,
      currentProvince: { ...this.data.currentProvince, name: province },
    });
    this.selectComponent('#stampForm').setRegion(region);
  },

  onFormChange(e) {
    const formData = e.detail;
    const valid = this.validateForm({ ...formData, selectedSeal: this.data.selectedSeal });
    this.setData({ formData: { ...formData, selectedSeal: this.data.selectedSeal }, formValid: valid });
  },

  // half-screen-popup 弹窗(个人印章选择)
  onOpenPersonalSeals() {
    this.setData({ selectedCategory: 'b14f2347-9ea5-49ef-a056-cc104b13e4c5' });
    this.selectComponent('#sealPopup').openWithCategory(
      '058ce9b9-ed91-4ee8-905e-1234327c653f',
      '2256dcb7-0117-4057-9b5d-b037f6536aaf'
    );
  },

  onOpenProfessionalSeals() {
    this.setData({ selectedCategory: 'c0000001-0000-0000-0000-000000000002' });
    this.selectComponent('#sealPopup').openWithCategory(
      '058ce9b9-ed91-4ee8-905e-1234327c653f',
      ''
    );
  },

  // 弹窗确认(个人/电子印章直接跳转,无需再点下一步)
  onSealConfirm(e) {
    const { ids, names } = e.detail;
    this.setData({ selectedSeal: ids.join(','), selectedSealName: names.join('、') });

    // 从 popup 内部数据获取选中项的 displayPrice（tier 价格）
    const popup = this.selectComponent('#sealPopup');
    const allItems = [...(popup.data.singleSeals || []), ...(popup.data.packages || [])];
    const items = ids.map(id => {
      const item = allItems.find(x => x.id === id);
      if (!item) return null;
      const isPackage = (popup.data.packages || []).some(p => p.id === id);
      return {
        item_type: isPackage ? 'package' : 'seal',
        seal_id: isPackage ? null : id,
        package_id: isPackage ? id : null,
        name: item.name,
        price: (item.displayPrice ?? item.price) || 0,
        quantity: 1,
      };
    }).filter(Boolean);
    const totalPrice = items.reduce((sum, item) => sum + (item.price || 0), 0);

    this.setData({ _selectedSealItems: items, _selectedSealTotalPrice: totalPrice, formValid: ids.length > 0 }, () => {
      // 个人模式:弹窗确认后直接提交跳转
      if (this.data.isPersonal && this.data.formValid) {
        this._doPersonalSubmit();
      }
      // 电子印章模式:弹窗确认后直接提交跳转
      if (this.data.isElectronic && this.data.formValid) {
        this._doElectronicSubmit();
      }
    });
  },

  validateForm(data) {
    if (this.data.isPersonal) {
      // 个人印章:只需选择印章类型
      return !!data.selectedSeal;
    }
    if (this.data.isElectronic) {
      // 电子印章:只需选择印章
      return !!data.selectedSeal;
    }
    // 企业:需要填写完整表单
    if (!data) return false;
    if (!data.region) return false;
    if (!data.reason) return false;
    // 手机号格式校验
    if (!data.contactPhone || !/^1[3-9]\d{9}$/.test(data.contactPhone)) return false;
    if (!data.companyName || !data.companyName.trim()) return false;
    // 法人电话格式校验
    if (!data.legalPhone || !/^1[3-9]\d{9}$/.test(data.legalPhone)) return false;
    return true;
  },

  // 个人印章:提交并跳转订单确认页
  _doPersonalSubmit() {
    const ids = this.data.selectedSeal.split(',').filter(Boolean);
    const names = this.data.selectedSealName.split('、').filter(Boolean);
    const categoryName = '个人印章';
    wx.setStorageSync('selectedSealsData', {
      ids: ids,
      names: names,
      seals: this.data.selectedSeal,
      categoryName: categoryName,
      isPersonal: true,
      _timestamp: Date.now(),
      items: this.data._selectedSealItems || [],
      totalPrice: this.data._selectedSealTotalPrice || 0,
    });
    wx.navigateTo({
      url: '/pages/seal/order-confirm/index'
    });
  },

  onSubmit() {
    if (!this.data.formValid) {
      wx.showToast({ title: this.data.isPersonal ? '请选择印章类型' : '请填写完整信息', icon: 'none' });
      return;
    }

    if (this.data.isPersonal) {
      // 个人印章:调用公共提交方法
      this._doPersonalSubmit();
    } else if (this.data.isElectronic) {
      // 电子印章:直接跳转订单确认
      this._doElectronicSubmit();
    } else {
      // 企业:将表单数据存入 Storage,跳选择页
      wx.setStorageSync('sealOrderForm', this.data.formData);
      wx.setStorageSync('sealFormData', {
        province: this.data.currentProvince.name,
        city: this.data.currentCity,
        region: this.data.currentRegion,
      });
      wx.navigateTo({ url: '/pages/seal/select/index?type=' + this.data.stampType });
    }
  },

  // 电子印章模式：预加载全部电子印章数据
  _loadElectronicSeals() {
    const sceneId = '1e3aaa8c-3318-4651-a141-924ab84aa2e0';
    api.getSealSceneProducts(sceneId).then(res => {
      if (res && res.seals) {
        this.setData({
          _allElectronicSeals: res.seals,
          _allElectronicPackages: res.packages || []
        });
      }
    }).catch(err => {
      console.error('加载电子印章失败:', err);
    });
  },

  // ========== 备案查询模式 ==========

  // 省份 picker 选择
  onProvinceChange(e) {
    const index = e.detail.value;
    const provinces = this.data.provinces || [];
    const province = provinces[index];
    if (!province) return;
    this.setData({
      provinceIndex: index,
      currentProvince: {
        name: province.name,
        url: province.url,
        platformName: province.platformName
      },
      currentCity: '',
    });
  },

  // 电子印章:选择印章类型(预加载数据后按子分类过滤弹窗)
  onElectronicSealSelect(e) {
    const { id, name, subcategoryid } = e.currentTarget.dataset;
    const allSeals = this.data._allElectronicSeals;
    if (!allSeals || allSeals.length === 0) {
      wx.showToast({ title: '加载中，请稍候', icon: 'none' });
      return;
    }
    this.setData({
      selectedElectronicSeal: id,
      selectedElectronicSealName: name,
      selectedElectronicCategory: id,
      popupTitle: name
    });
    // 按子分类过滤印章（subCategoryId=null => 无分类的印章）
    const filtered = allSeals.filter(s =>
      subcategoryid ? s.categoryId === subcategoryid : !s.categoryId
    );
    this.selectComponent('#sealPopup').openWithData(filtered, this.data._allElectronicPackages, this.data.currentRegion);
  },

  // 电子印章:提交并跳转
  _doElectronicSubmit() {
    const ids = this.data.selectedSeal.split(',').filter(Boolean);
    const names = this.data.selectedSealName.split('、').filter(Boolean);
    wx.setStorageSync('selectedSealsData', {
      ids: ids,
      names: names,
      seals: this.data.selectedSeal,
      categoryName: '电子印章 - ' + this.data.selectedElectronicSealName,
      isPersonal: false,
      isElectronic: true,
      _timestamp: Date.now(),
      items: this.data._selectedSealItems || [],
      totalPrice: this.data._selectedSealTotalPrice || 0,
    });
    wx.navigateTo({ url: '/pages/seal/order-confirm/index' });
  },

  onGoVerify() {
    const url = this.data.currentProvince.url;
    wx.setClipboardData({
      data: url,
      success: function() {
        wx.showToast({ title: '链接已复制,请在浏览器中打开', icon: 'none' });
      }
    });
  },

});

