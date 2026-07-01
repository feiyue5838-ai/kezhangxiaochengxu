// pages/seal/form/index.js
const common = require('../../../utils/common.js');
const P = ['北京','天津','河北','山西','内蒙古','辽宁','吉林','黑龙江','上海','江苏','浙江','安徽','福建','江西','山东','河南','湖北','湖南','广东','广西','海南','重庆','四川','贵州','云南','西藏','陕西','甘肃','青海','宁夏','新疆','台湾','香港','澳门'];
const D = {
  '四川': { '成都': ['锦江','青羊','金牛','武侯','成华','龙泉驿','青白江','新都','温江','双流','郫都','新津'],'自贡': ['自流井','贡井','大安'],'攀枝花': ['东区','西区','仁和'],'泸州': ['江阳','纳溪'],'德阳': ['旌阳','罗江'],'绵阳': ['涪城','游仙'],'广元': ['利州'],'遂宁': ['船山'],'内江': ['市中','东兴'],'乐山': ['市中','沙湾'],'南充': ['顺庆','高坪'],'眉山': ['东坡','彭山'],'宜宾': ['翠屏','南溪'],'广安': ['广安'],'达州': ['通川','达川'],'巴中': ['巴州','恩阳'],'雅安': ['雨城'],'资阳': ['雁江'],'阿坝': ['马尔康'],'甘孜': ['康定'],'凉山': ['西昌'] },
  '北京': { '北京': ['东城','西城','朝阳','丰台','石景山','海淀','门头沟','房山','通州','顺义','昌平','大兴'] },
  '天津': { '天津': ['和平','河东','河西','南开','河北','红桥','滨海'] },
  '河北': { '石家庄': ['长安','桥西','新华'],'唐山': ['路南','路北'],'秦皇岛': ['海港'],'邯郸': ['丛台'],'保定': ['竞秀','莲池'] },
  '山西': { '太原': ['小店','迎泽','杏花岭'],'大同': ['平城','云冈'] },
  '内蒙古': { '呼和浩特': ['新城','回民','玉泉'],'包头': ['东河','昆都仑'] },
  '辽宁': { '沈阳': ['和平','沈河','大东'],'大连': ['中山','西岗'] },
  '吉林': { '长春': ['南关','宽城','朝阳'],'吉林': ['昌邑','龙潭'] },
  '黑龙江': { '哈尔滨': ['道里','南岗','道外'],'齐齐哈尔': ['龙沙'] },
  '上海': { '上海': ['黄浦','徐汇','长宁','静安','普陀','虹口','杨浦','闵行','宝山','嘉定','浦东'] },
  '江苏': { '南京': ['玄武','秦淮','建邺'],'苏州': ['姑苏','虎丘'],'无锡': ['梁溪'],'常州': ['天宁'] },
  '浙江': { '杭州': ['上城','下城','江干','拱墅'],'宁波': ['海曙','江北'],'温州': ['鹿城','龙湾'] },
  '安徽': { '合肥': ['瑶海','庐阳','蜀山'],'芜湖': ['镜湖'] },
  '福建': { '福州': ['鼓楼','台江'],'厦门': ['思明','海沧','湖里'] },
  '江西': { '南昌': ['东湖','西湖'],'赣州': ['章贡'] },
  '山东': { '济南': ['历下','市中'],'青岛': ['市南','市北','黄岛'] },
  '河南': { '郑州': ['中原','二七','管城'],'洛阳': ['老城','西工'] },
  '湖北': { '武汉': ['江岸','江汉','硚口','汉阳'],'宜昌': ['西陵'],'襄阳': ['襄城'] },
  '湖南': { '长沙': ['芙蓉','天心','岳麓'],'株洲': ['荷塘'] },
  '广东': { '广州': ['荔湾','越秀','海珠','天河'],'深圳': ['罗湖','福田','南山'],'东莞': ['莞城'],'佛山': ['禅城','南海'] },
  '广西': { '南宁': ['兴宁','青秀','江南'],'柳州': ['城中','鱼峰'] },
  '海南': { '海口': ['秀英','龙华','琼山'],'三亚': ['海棠','吉阳'] },
  '重庆': { '重庆': ['万州','涪陵','渝中','江北','沙坪坝','九龙坡','南岸','北碚','渝北','巴南'] },
  '贵州': { '贵阳': ['南明','云岩','花溪'] },
  '云南': { '昆明': ['五华','盘龙','官渡'] },
  '西藏': { '拉萨': ['城关'] },
  '陕西': { '西安': ['新城','碑林','莲湖'],'宝鸡': ['渭滨'] },
  '甘肃': { '兰州': ['城关','七里河'] },
  '青海': { '西宁': ['城东','城中','城西'] },
  '宁夏': { '银川': ['兴庆','西夏','金凤'] },
  '新疆': { '乌鲁木齐': ['天山','沙依巴克','新市'] },
  '台湾': { '台北': ['松山','信义','大安'],'新北': ['板桥'] },
  '香港': { '香港': ['中西','湾仔','东区'] },
  '澳门': { '澳门': ['澳门半岛','氹仔','路环'] }
};

Page({
  data: {
    formValid: false,
    formData: null,
    stampType: 'company',
    isPersonal: false,
    isQuery: false,
    statusBarHeight: 20,
    navHeight: 64,
    menuCenterY: 0,
    menuRight: 0,
    pageTitle: '印章申请',
    currentProvince: { name: '四川省', url: 'https://yzcx.sczwfw.gov.cn:18511/', cities: [{ name: '成都市', url: 'https://yzcx.sczwfw.gov.cn:18511/' }] },
    currentCity: '成都市',
    cityPickerOpen: false,
    _provinceOrig: { name: '四川省', url: 'https://yzcx.sczwfw.gov.cn:18511/', cities: [{ name: '成都市', url: 'https://yzcx.sczwfw.gov.cn:18511/' }] },
    personalSeals: [{ id: 's26', name: '个人签名章' },{ id: 's27', name: '拆迁、买房使用' },{ id: 's28', name: '公证使用' },{ id: 's29', name: '企业员工使用' }],
    selectedCategory: 9,
    selectedSeal: '',
    selectedSealName: '',
    isElectronic: false,
    selectedElectronicSeal: '',
    selectedElectronicSealName: '',
    electronicSeals: [{ id: 'e1', name: '财务章', categoryId: 11 },{ id: 'e2', name: '公章', categoryId: 12 },{ id: 'e3', name: '合同章', categoryId: 13 },{ id: 'e4', name: '法人章', categoryId: 14 },{ id: 'e5', name: '发票章', categoryId: 15 },{ id: 'e6', name: '个人签名章', categoryId: 16 },{ id: 'e7', name: '其他印章', categoryId: 17 }],
    selectedElectronicCategory: '',
    popupTitle: '',
    // 地区选择器
    showRegion: false,
    ri: [0, 0, 0],
    ps: P,
    cs: [],
    ds: []
  },

  onLoad(options) {
    // 从全局数据读取导航栏高度（app.js 已计算）
    const { statusBarHeight, navHeight } = common.getNavigationHeight();
    const menuRect = wx.getMenuButtonBoundingClientRect();
    const menuCenterY = menuRect.top + menuRect.height / 2;
    this.setData({ statusBarHeight, navHeight, menuCenterY, menuRight: menuRect.width + 12 });

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
  },

  // 返回上一页
  goBack() {
    wx.navigateBack({ delta: 1 });
  },

  // 地区选择器
  onOpenRegion() {
    const p = P[0], cities = Object.keys(D[p] || {}), c = cities[0] || '', districts = D[p]?.[c] || [];
    // 先重置再打开，确保 picker-view 重新渲染
    this.setData({ showRegion: false, ri: [-1, -1, -1], cs: [], ds: [] });
    setTimeout(() => {
      this.setData({ showRegion: true, ri: [0, 0, 0], cs: cities, ds: districts });
    }, 50);
  },
  closeRegion() {
    this.setData({ showRegion: false });
  },
  onRegionChange(e) {
    const v = e.detail.value, pv = P[v[0]], cities = Object.keys(D[pv] || {});
    const ci = Math.min(v[1], cities.length - 1), cv = cities[ci] || '';
    const districts = D[pv]?.[cv] || [];
    const di = Math.min(v[2], districts.length - 1);
    this.setData({ ri: [v[0], ci, di], cs: cities, ds: districts });
  },
  confirmRegion() {
    const { ri, cs, ds } = this.data;
    const province = P[ri[0]] || '';
    const city = cs[ri[1]] || '';
    const district = ds[ri[2]] || '';
    // 三联显示：省 市 区
    const region = [province, city, district].filter(Boolean).join(' ');
    this.setData({ showRegion: false });
    this.selectComponent('#stampForm').setRegion(region);
  },

  onFormChange(e) {
    const formData = e.detail;
    const valid = this.validateForm({ ...formData, selectedSeal: this.data.selectedSeal });
    this.setData({ formData: { ...formData, selectedSeal: this.data.selectedSeal }, formValid: valid });
  },

  // half-screen-popup 弹窗(个人印章选择)
  onOpenPersonalSeals() {
    this.setData({ selectedCategory: 9 });
    this.selectComponent('#sealPopup').openWithCategory(9);
  },

  onOpenProfessionalSeals() {
    this.setData({ selectedCategory: 10 });
    this.selectComponent('#sealPopup').openWithCategory(10);
  },

  // 弹窗确认(个人/电子印章直接跳转,无需再点下一步)
  onSealConfirm(e) {
    const { ids, names } = e.detail;
    this.setData({ selectedSeal: ids.join(','), selectedSealName: names.join('、') });
    this.setData({ formValid: ids.length > 0 }, () => {
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
    const categoryName = this.data.selectedCategory === 10 ? '个人职业章' : '个人印章';
    wx.setStorageSync('selectedSealsData', {
      ids: ids,
      names: names,
      seals: this.data.selectedSeal,
      categoryName: categoryName,
      isPersonal: true,
      _timestamp: Date.now()
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
      wx.navigateTo({ url: '/pages/seal/select/index?type=' + this.data.stampType });
    }
  },

  // ========== 备案查询模式 ==========

  onOpenCityPicker() {
    this.setData({ cityPickerOpen: !this.data.cityPickerOpen });
  },
  onCitySelect(e) {
    const index = e.currentTarget.dataset.index;
    const province = this.data.currentProvince;
    const city = province.cities[index];
    this.setData({
      currentCity: city.name,
      currentProvince: { ...province, url: city.url },
      cityPickerOpen: false
    });
  },

  // 电子印章:选择印章类型(改为弹窗选择)
  onElectronicSealSelect(e) {
    const { id, name, category } = e.currentTarget.dataset;
    this.setData({
      selectedElectronicSeal: id,
      selectedElectronicSealName: name,
      selectedElectronicCategory: id,
      popupTitle: name
    });
    // 打开半屏弹窗
    this.selectComponent('#sealPopup').openWithCategory(category);
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
      _timestamp: Date.now()
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

