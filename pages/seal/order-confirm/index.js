const api = require('../../../utils/api.js');
const common = require('../../../utils/common.js');
const { SINGLE_SEALS, PACKAGES } = require('../../../utils/seal-options.js');

Page({
  data: {
    pageTitle: '确认订单',

    // 印章信息（从上一页传入）
    selectedSeal: {
      price: 0
    },
    isElectronic: false,

    // 印章数据（用于匹配）
    singleSeals: [
      { id: 's1', name: '财务章', img: '/assets/images/seal-caiwuzhang.svg', price: 150 },
      { id: 's2', name: '公章', img: '/assets/images/seal-gongzhang.svg', price: 180 },
      { id: 's3', name: '合同章', img: '/assets/images/seal-hetongzhang.svg', price: 160 },
      { id: 's4', name: '法人章', img: '/assets/images/seal-farenzhang.svg', price: 120 },
      { id: 's5', name: '发票章', img: '/assets/images/seal-fapiaozhang.svg', price: 150 },
      { id: 's6', name: '中英文公章', img: '/assets/images/seal-gongzhang-en.svg', price: 220 },
      { id: 's7', name: '中英文合同章', img: '/assets/images/seal-hetongzhang-en.svg', price: 200 },
      { id: 's8',  name: '手动钢印章',       img: '/assets/images/seal-gang-shoudong.svg', price: 180 },
      { id: 's9',  name: '自动钢印章',       img: '/assets/images/seal-gang-zidong.svg', price: 180 },
      { id: 's10', name: '业务专用章',        img: '/assets/images/seal-zhuanyongzhang.svg', price: 150 },
      { id: 's11', name: '销售合同章',        img: '/assets/images/seal-zhuanyongzhang.svg', price: 150 },
      { id: 's12', name: '发货专用章',        img: '/assets/images/seal-zhuanyongzhang.svg', price: 150 },
      { id: 's13', name: '技术专用章',        img: '/assets/images/seal-zhuanyongzhang.svg', price: 150 },
      { id: 's14', name: '质检章',            img: '/assets/images/seal-zhuanyongzhang.svg', price: 150 },
      { id: 's15', name: '收据专用章',        img: '/assets/images/seal-zhuanyongzhang.svg', price: 150 },
      { id: 's16', name: '委员会章',          img: '/assets/images/seal-zhuanyongzhang.svg', price: 150 },
      { id: 's17', name: '生产办公室章',      img: '/assets/images/seal-zhuanyongzhang.svg', price: 150 },
      { id: 's18', name: '人事专用章',        img: '/assets/images/seal-zhuanyongzhang.svg', price: 150 },
      { id: 's19', name: '授权专用章',        img: '/assets/images/seal-zhuanyongzhang.svg', price: 150 },
      { id: 's20', name: '资质专用章',        img: '/assets/images/seal-zhuanyongzhang.svg', price: 150 },
      { id: 's21', name: '质量管理部章',     img: '/assets/images/seal-zhuanyongzhang.svg', price: 150 },
      { id: 's22', name: '项目章',            img: '/assets/images/seal-zhuanyongzhang.svg', price: 150 },
      { id: 's23', name: '办事机构印章',      img: '/assets/images/seal-zhuanyongzhang.svg', price: 150 },
      { id: 's24', name: '组委会章',          img: '/assets/images/seal-zhuanyongzhang.svg', price: 150 },
      { id: 's25', name: '其他章(下单备注章名)', img: '/assets/images/seal-zhuanyongzhang.svg', price: 150 },
      { id: 's26', name: '个人签名章', img: '/assets/images/seal-gerenmingzhang.svg', price: 80 },
      { id: 's27', name: '拆迁、买房使用', img: '/assets/images/seal-gerenqita.svg', price: 80 },
      { id: 's28', name: '公证使用', img: '/assets/images/seal-gerenqita.svg', price: 80 },
      { id: 's29', name: '企业员工使用', img: '/assets/images/seal-gerenqita.svg', price: 80 },
      { id: 's30', name: '一级造价工程师', img: '/assets/images/seal-zhuanyeA.svg', price: 150 },
      { id: 's31', name: '一级注册建造师', img: '/assets/images/seal-zhuanyeA.svg', price: 150 },
      { id: 's32', name: '一级注册结构工程师', img: '/assets/images/seal-zhuanyeA.svg', price: 150 },
      { id: 's33', name: '注册监理工程师', img: '/assets/images/seal-zhuanyeA.svg', price: 150 },
      { id: 's34', name: '二级注册建筑师', img: '/assets/images/seal-zhuanyeA.svg', price: 150 },
      { id: 's35', name: '电气工程师', img: '/assets/images/seal-zhuanyeA.svg', price: 150 },
      { id: 's36', name: '房地产评估师', img: '/assets/images/seal-zhuanyeA.svg', price: 150 },
      { id: 's37', name: '会计师', img: '/assets/images/seal-zhuanyeA.svg', price: 150 },
      { id: 's38', name: '项目经理', img: '/assets/images/seal-zhuanyeA.svg', price: 150 },
      { id: 's39', name: '二级造价工程师', img: '/assets/images/seal-zhuanyeA.svg', price: 150 },
      { id: 's40', name: '二级注册建造师', img: '/assets/images/seal-zhuanyeA.svg', price: 150 },
      { id: 's41', name: '二级注册结构工程师', img: '/assets/images/seal-zhuanyeB.svg', price: 150 },
      { id: 's42', name: '一级注册建筑师', img: '/assets/images/seal-zhuanyeB.svg', price: 150 },
      { id: 's43', name: '土木工程师', img: '/assets/images/seal-zhuanyeB.svg', price: 150 },
      { id: 's44', name: '化工工程师', img: '/assets/images/seal-zhuanyeB.svg', price: 150 },
      { id: 's45', name: '执业律师', img: '/assets/images/seal-zhuanyeB.svg', price: 150 },
      { id: 's46', name: '税务师', img: '/assets/images/seal-zhuanyeB.svg', price: 150 },
      { id: 's47', name: '其他(下单请备注章名）', img: '/assets/images/seal-zhuanyeB.svg', price: 150 },
      // 电子印章有效期选项
      { id: 'e1y', name: '一年有效期(不限次数)', img: '', price: 200 },
      { id: 'e2y', name: '两年有效期(不限次数)', img: '', price: 350 },
      { id: 'e3y', name: '三年有效期(不限次数)', img: '', price: 500 },
      { id: 'e4y', name: '四年有效期(不限次数)', img: '', price: 650 },
      { id: 'e5y', name: '五年有效期(不限次数)', img: '', price: 800 }
    ],
    packages: [
      { id: 'p1', name: '公章、财务章、法人章', badge: '特惠', price: 350, seals: ['s2', 's1', 's4'] },
      { id: 'p2', name: '公章、财务章、发票章、法人章', badge: '特惠', price: 470, seals: ['s2', 's1', 's5', 's4'] },
      { id: 'p3', name: '公章、发票章、财务章', badge: '特惠', price: 350, seals: ['s2', 's5', 's1'] },
      { id: 'p4', name: '公章、财务章、合同章', badge: '特惠', price: 350, seals: ['s2', 's1', 's3'] },
      { id: 'p5', name: '公章、合同章、发票章', badge: '特惠', price: 350, seals: ['s2', 's3', 's5'] },
      { id: 'p6', name: '公章、财务章、发票章、合同章', badge: '特惠', price: 450, seals: ['s2', 's1', 's5', 's3'] },
      { id: 'p7', name: '公章、财务章、发票章、合同章、法人章', badge: '特惠', price: 550, seals: ['s2', 's1', 's5', 's3', 's4'] }
    ],

    // 办理信息（从 Storage 读取，不再硬编码）
    licenseRegion: '',
    sealReason: '',
    companyName: '',
    contactPhone: '',
    legalPhone: '',
    categoryName: '',
    selectedTypes: '',

    // 合计金额
    totalPrice: 0,

    // 表单数据
    address: null,
    invoice: null,
    remark: '',

    // 材料上传（与 material-upload page 写入格式完全对齐）
    materials: {
      license: '',
      idCardFront: '',
      idCardBack: '',
      photo: '',
      professionalCert: '',
      signature: '',
      handheldIdPhoto: '',
      additional: []
    },

    // 地区材料要求
    materialRules: {
      license: { title: '营业执照', required: true, regionNote: '' },
      idCard: { title: '法人身份证', required: true, note: '正反面照片' },
      photo: { title: '法人照片', required: true, regionNote: '' }
    },

    // 个人印章模式
    isPersonal: false,

    // 提交状态
    needLegalPhoto: false,      // 法人白底自拍照是否必填（按后台白名单地区判定）
    needHandheldId: false,     // 法人手持身份证是否必填（按后台白名单地区判定）
    canSubmit: false,
    isSubmitting: false  // 防止重复提交
  },

  onLoad(options) {
    // 未登录先跳登录页（A-04: 游客不能下单）
    if (!wx.getStorageSync('token')) {
      wx.navigateTo({ url: '/pages/auth/index' });
      return;
    }

    this.setData({ pageTitle: '确认订单' });

    // 生成或获取订单ID（用于数据隔离）
    const orderId = this._getOrCreateOrderId();

    // 读取表单数据（从表单页 Storage 传递）
    const formData = wx.getStorageSync('sealOrderForm') || null;
    if (formData) {
      this.setData({
        licenseRegion: formData.region || '',
        sealReason: formData.reason || '',
        companyName: formData.companyName || '',
        contactPhone: formData.contactPhone || '',
        legalPhone: formData.legalPhone || ''
      });
    }

    // 从 Storage 读取印章信息（由 select 页 或 form 页存入）
    const data = wx.getStorageSync('selectedSealsData') || null;
    if (!data || !data.ids || data.ids.length === 0) {
      wx.showToast({ title: '数据丢失，请重新选择', icon: 'none' });
      setTimeout(() => { wx.navigateBack(); }, 1500);
      return;
    }

    // 检查数据是否过期（超过2小时）
    const now = Date.now();
    const MAX_AGE = 2 * 60 * 60 * 1000;  // 2小时
    if (data._timestamp && (now - data._timestamp > MAX_AGE)) {
      wx.removeStorageSync('selectedSealsData');
      wx.showToast({ title: '订单数据已过期，请重新选择', icon: 'none' });
      setTimeout(() => { wx.navigateBack(); }, 1500);
      return;
    }

    const { ids, names, categoryName, isPersonal, isElectronic, items, totalPrice: dataTotalPrice } = data;

    // 优先使用 select 页面传入的 items（带真实价格），否则从静态 sealMap 回退
    let totalPrice = dataTotalPrice || 0;
    const allSeals = SINGLE_SEALS.concat(PACKAGES);
    const sealMap = new Map(allSeals.map(s => [s.id, s]));
    if ((!items || items.length === 0) && ids && ids.length > 0) {
      totalPrice = 0;
      ids.forEach(id => {
        const item = sealMap.get(id);
        if (item) totalPrice += (item.displayPrice ?? item.price ?? 0);
      });
    }

    // 显示名称
    const displayNames = names && names.length > 0 ? names : ids.map(id => {
      const item = sealMap.get(id);
      return item ? item.name : id;
    });

    this.setData({
      'selectedSeal.price': totalPrice,
      'selectedTypes': displayNames.join('、'),
      'categoryName': categoryName || '',
      'totalPrice': totalPrice,
      'isPersonal': !!isPersonal,
      'isElectronic': !!isElectronic
    });

    const licenseRegion = this.data.licenseRegion || '';

    this.setData({
      'materialRules.license.regionNote': this.getLicenseNote(licenseRegion),
      'materialRules.photo.regionNote': this.getPhotoNote(licenseRegion)
    });

    // 异步拉取后台材料规则（法人照片/手持身份证按地区白名单），与 material-upload 保持一致
    this._loadMaterialRules(licenseRegion);
  },

  // 每次显示页面时刷新数据（从子页返回时）
  onShow() {
    this.loadSavedData();
  },

  // 加载已保存的数据
  loadSavedData() {
    // 读取地址
    let address = wx.getStorageSync('deliveryAddress') || null;
    // 兜底：个人印章和电子印章没有收货地址时，从 sealFormData.region 解析省市区用于派单
    if (!address && (this.data.isPersonal || this.data.isElectronic)) {
      const fd = wx.getStorageSync('sealFormData') || {};
      if (fd.region) {
        const parts = (fd.region || '').split(' ').filter(Boolean);
        address = {
          province: parts[0] || '',
          city: parts[1] || '',
          district: parts[2] || ''
        };
      }
    }
    if (address) {
      this.setData({ address });
    }

    // 读取发票
    const invoice = wx.getStorageSync('invoiceInfo') || null;
    if (invoice) {
      this.setData({ invoice });
    }

    // 读取备注
    const remark = wx.getStorageSync('orderRemark') || '';
    this.setData({ remark });

    // 读取联系号码
    const savedPhone = wx.getStorageSync('sealOrderPhone') || '';
    if (savedPhone) {
      this.setData({ contactPhone: savedPhone });
    }

    // 读取材料（新版：支持公司/个人/电子印章）
    const material = wx.getStorageSync('materialInfo') || null;
    if (material) {
      // 全量读取 material-upload 写入的所有字段
      this.setData({
        'materials.license': material.license || '',
        'materials.idCardFront': material.idCardFront || '',
        'materials.idCardBack': material.idCardBack || '',
        'materials.photo': material.legalPhoto || '',
        'materials.professionalCert': material.professionalCert || '',
        'materials.signature': material.signature || '',
        'materials.handheldIdPhoto': material.handheldIdPhoto || '',
        'materials.additional': material.additional || []
      });
    }

    this.checkSubmitStatus();
  },

  // 获取营业执照要求说明
  getLicenseNote(region) {
    if (!region) return '请上传营业执照原件照片';
    // 可在此按区域定制说明，例：
    // if (region.includes('北京')) return '北京市要求提供营业执照原件扫描件';
    return '请上传营业执照原件照片，需清晰可辨';
  },

  // 获取照片要求说明
  getPhotoNote(region) {
    if (!region) return '请上传法人本人照片';
    // if (region.includes('广东')) return '广东省不强制要求法人照片';
    return '请上传法人本人照片（正面免冠）';
  },

  // 检查是否可以提交
  checkSubmitStatus() {
    const { address, contactPhone } = this.data;
    const hasAddress = address && address.detail;

    // 与 material-upload 同源读取 materialRule.required（单一数据源）
    const rule = this.data.materialRule || { required: ['license', 'idCardFront', 'idCardBack'] };
    const materials = wx.getStorageSync('materialInfo') || {};
    const materialsComplete = rule.required.every(k => !!materials[k]);

    // S-15: 联系电话格式校验
    const phoneOk = contactPhone && /^1[3-9]\d{9}$/.test((contactPhone || '').trim());

    this.setData({ canSubmit: hasAddress && materialsComplete && phoneOk });
  },

  // 拉取后台材料规则，使 order-confirm 的材料必填判定与 material-upload 完全一致：
  // - 法人白底自拍照：仅后台 legalPhotoCities 白名单地区（公司/个体户）或电子印章需上传
  // - 法人手持身份证：仅后台 handheldIdCities 白名单地区需上传
  // 不再无条件要求法人照片（修复非白名单地区订单永远无法提交的问题）
  async _loadMaterialRules(region) {
    const FALLBACK = ['上海', '山东', '新疆', '贵阳'];
    const sd = wx.getStorageSync('selectedSealsData') || {};
    const fd = wx.getStorageSync('sealFormData') || {};
    const isPersonal = this.data.isPersonal;
    const isElectronic = this.data.isElectronic;
    const subjectType = sd.subjectType || fd.subjectType || (isPersonal ? 'personal' : (isElectronic ? 'electronic' : 'company'));
    const items = sd.items || [];
    const hasProfessional = items.some(item => item.requiresCert || /执业|资格|职业|建造师|工程师|会计师|律师|税务师/.test(item.categoryName || item.name || ''));
    const hasSignature = items.some(item => /签名章/.test(item.name || '') || (item.categoryName || '').indexOf('签名') >= 0);
    const inList = (cities) => cities.some(c => (region || '').includes(c));

    // 初始判定（兜底白名单）
    this.setData({
      materialRule: common.getRequiredMaterials({ subjectType: subjectType, isElectronic: isElectronic, hasProfessional: hasProfessional, hasSignature: hasSignature, region: region, legalPhotoCities: FALLBACK, handheldIdCities: FALLBACK }),
      needLegalPhoto: isElectronic || inList(FALLBACK),
      needHandheldId: !isPersonal && !isElectronic && inList(FALLBACK)
    });
    this.checkSubmitStatus();

    let legalCities = FALLBACK;
    let handheldCities = FALLBACK;
    try {
      legalCities = common.configToArray(await api.getConfig('legalPhotoCities'), FALLBACK);
    } catch (e) { /* 接口异常时沿用兜底白名单 */ }
    try {
      handheldCities = common.configToArray(await api.getConfig('handheldIdCities'), FALLBACK);
    } catch (e) { /* 接口异常时沿用兜底白名单 */ }

    const rule = common.getRequiredMaterials({ subjectType: subjectType, isElectronic: isElectronic, hasProfessional: hasProfessional, hasSignature: hasSignature, region: region, legalPhotoCities: legalCities, handheldIdCities: handheldCities });
    this.setData({
      materialRule: rule,
      needLegalPhoto: rule.required.indexOf('legalPhoto') >= 0,
      needHandheldId: rule.required.indexOf('handheldIdPhoto') >= 0
    });
    this.checkSubmitStatus();
  },

  // 填写邮寄地址
  onAddressTap() {
    wx.navigateTo({
      url: '/pages/address/edit/index'
    });
  },

  // 修改联系号码
  onPhoneInput(e) {
    const phone = e.detail.value;
    this.setData({ contactPhone: phone });
    // 同步更新 Storage 中的表单数据
    const formData = wx.getStorageSync('sealOrderForm') || {};
    formData.contactPhone = phone;
    wx.setStorageSync('sealOrderForm', formData);
    wx.setStorageSync('sealOrderPhone', phone);
  },

  // 备注输入
  onRemarkInput(e) {
    const remark = e.detail.value;
    this.setData({ remark });
    wx.setStorageSync('orderRemark', remark);
  },

  // 填写发票
  onInvoiceTap() {
    wx.navigateTo({
      url: '/pages/invoice/edit/index'
    });
  },

  // 跳转材料上传页
  onMaterialTap() {
    const selectedData = wx.getStorageSync('selectedSealsData') || {};
    wx.setStorageSync('materialUploadContext', {
      isPersonal: this.data.isPersonal,
      isElectronic: this.data.isElectronic,
      subjectType: selectedData.subjectType || (wx.getStorageSync('sealFormData') || {}).subjectType || null,
      selectedSealIds: selectedData.ids || [],
      categoryName: selectedData.categoryName || ''
    });
    // 通过 Storage 传递中文参数，避免 URL 编码问题
    wx.setStorageSync('materialUploadNavData', {
      region: this.data.licenseRegion || '成都',
      isPersonal: this.data.isPersonal,
      subjectType: selectedData.subjectType || (wx.getStorageSync('sealFormData') || {}).subjectType || null,
      categoryName: selectedData.categoryName || '',
      _timestamp: Date.now()
    });
    wx.navigateTo({
      url: '/pages/seal/material-upload/index'
    });
  },

  // 删除已上传材料
  onDeleteMaterial(e) {
    const { type } = e.currentTarget.dataset;
    const fieldMap = {
      license: 'materials.license',
      photo: 'materials.photo',
      professionalCert: 'materials.professionalCert',
      signature: 'materials.signature',
      handheldIdPhoto: 'materials.handheldIdPhoto'
    };

    if (type === 'idCard') {
      this.setData({
        'materials.idCardFront': '',
        'materials.idCardBack': ''
      });
    } else if (type && fieldMap[type]) {
      this.setData({ [fieldMap[type]]: '' });
    }

    // 同步回 Storage
    const materialInfo = wx.getStorageSync('materialInfo') || {};
    const updated = { ...materialInfo };
    if (type === 'idCard') {
      updated.idCardFront = '';
      updated.idCardBack = '';
    } else if (type === 'photo') updated.legalPhoto = '';
    else if (type === 'professionalCert') updated.professionalCert = '';
    else if (type === 'signature') updated.signature = '';
    else if (type === 'handheldIdPhoto') updated.handheldIdPhoto = '';
    else if (type === 'license') updated.license = '';
    wx.setStorageSync('materialInfo', updated);

    this.checkSubmitStatus();
  },

  // 材料操作菜单：预览 / 原地替换
  onMaterialOption(e) {
    const { url, field } = e.currentTarget.dataset;

    wx.showActionSheet({
      itemList: ['预览图片', '重新上传'],
      success: (res) => {
        if (res.tapIndex === 0) {
          wx.previewImage({ current: url, urls: [url] });
        } else if (res.tapIndex === 1) {
          this._replaceMaterial(field);
        }
      }
    });
  },

  // 原地替换指定材料
  _replaceMaterial(field) {
    // field → materials 路径 / Storage 键名 映射
    const map = {
      idCardFront:       { path: 'materials.idCardFront',      storage: 'idCardFront' },
      idCardBack:        { path: 'materials.idCardBack',       storage: 'idCardBack' },
      license:           { path: 'materials.license',          storage: 'license' },
      legalPhoto:        { path: 'materials.photo',            storage: 'legalPhoto' },
      professionalCert:  { path: 'materials.professionalCert', storage: 'professionalCert' },
      signature:         { path: 'materials.signature',        storage: 'signature' },
      handheldIdPhoto:   { path: 'materials.handheldIdPhoto',  storage: 'handheldIdPhoto' },
      additional:        { path: 'materials.additional',       storage: 'additional' }
    };

    const m = map[field];
    if (!m) return;

    wx.chooseMedia({
      count: field === 'additional' ? 5 : 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempPath = res.tempFiles[0].tempFilePath;

        if (field === 'additional') {
          // 补充材料：追加到数组末尾
          const list = [...(this.data.materials.additional || []), ...res.tempFiles.map(f => f.tempFilePath)];
          this.setData({ 'materials.additional': list });
          const mi = wx.getStorageSync('materialInfo') || {};
          wx.setStorageSync('materialInfo', { ...mi, additional: list });
        } else {
          // 单项替换
          this.setData({ [m.path]: tempPath });
          const mi = wx.getStorageSync('materialInfo') || {};
          wx.setStorageSync('materialInfo', { ...mi, [m.storage]: tempPath });
        }

        this.checkSubmitStatus();
      }
    });
  },

  // 预览材料
  onPreviewMaterial(e) {
    const { url } = e.currentTarget.dataset;
    wx.previewImage({
      current: url,
      urls: [url]
    });
  },

  // 上传刻章材料：把本地临时路径逐个上传到后端，返回带 URL 的 materials 对象
  async _uploadMaterials() {
    const m = this.data.materials || {};
    const mi = wx.getStorageSync('materialInfo') || {};
    const uploadOne = (fp) => {
      if (!fp) return Promise.resolve('');
      // 仅当路径含 /uploads（后端 uploadUserMaterial 已落地的材料 URL，相对或绝对均含该段）才视为已上传，
      // 直接复用避免重复上传；切勿用 http(s) 前缀判断，否则微信临时路径（如 http://tmp/...）会被误判为已上传而直接入库，导致链接失效
      if (typeof fp === 'string' && fp.indexOf('/uploads') > -1) {
        return Promise.resolve(fp);
      }
      return api.uploadFile(fp, '/api/upload/user-material');
    };
    const [license, idCardFront, idCardBack, legalPhoto, professionalCert, signature, handheldIdPhoto] = await Promise.all([
      uploadOne(m.license),
      uploadOne(m.idCardFront),
      uploadOne(m.idCardBack),
      uploadOne(m.photo),
      uploadOne(m.professionalCert || mi.professionalCert),
      uploadOne(m.signature || mi.signature),
      uploadOne(m.handheldIdPhoto || mi.handheldIdPhoto),
    ]);
    const addRaw = (m.additional && m.additional.length > 0) ? m.additional : (mi.additional || []);
    const addList = Array.isArray(addRaw) ? addRaw : [addRaw];
    const additional = await Promise.all(addList.map(uploadOne));
    return {
      license,
      idCardFront,
      idCardBack,
      legalPhoto,
      professionalCert,
      signature,
      handheldIdPhoto,
      additional: additional.filter(Boolean),
    };
  },

  // 付款
  async onPayTap() {
    // 防止重复提交
    if (this.data.isSubmitting) {
      wx.showToast({ title: '订单提交中，请稍候', icon: 'none' });
      return;
    }

    // S-15: 校验联系电话格式
    const phone = (this.data.contactPhone || '').trim();
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({ title: '请填写正确的联系电话', icon: 'none' });
      return;
    }
    if (!this.data.canSubmit) {
      // 精确提示缺什么
      const address = this.data.address;
      const hasAddress = address && address.detail;
      const rule = this.data.materialRule || { required: ['license', 'idCardFront', 'idCardBack'] };
      const materials = wx.getStorageSync('materialInfo') || {};
      const materialsComplete = rule.required.every(k => !!materials[k]);
      if (!hasAddress) {
        wx.showToast({ title: '请填写配送地址', icon: 'none' }); return;
      }
      if (!materialsComplete) {
        wx.showToast({ title: '请上传所需材料', icon: 'none' }); return;
      }
      return;
    }

    // 加锁
    this.setData({ isSubmitting: true });

    // 创建订单并调起微信支付
    wx.showLoading({ title: '创建订单...' });

    // 上传材料：本地临时路径 -> 后端 URL（/api/upload/user-material）
    // 失败则中止下单，避免产生无材料的订单
    let submitMaterials;
    try {
      submitMaterials = await this._uploadMaterials();
    } catch (e) {
      console.error('材料上传失败', e);
      wx.hideLoading();
      wx.showToast({ title: '材料上传失败，请重试', icon: 'none' });
      this.setData({ isSubmitting: false });
      return;
    }

    // 构建 items 数组（后端根据 items 计算 orderItems 明细表）
    // 优先使用 select 页面传入的 items（带真实价格和 UUID）
    const selectedData = wx.getStorageSync('selectedSealsData') || {};
    let items = (selectedData.items || []).filter(Boolean);
    const selectedIds = selectedData.ids || [];

    // 如果 items 为空（form 页面等旧流程），从静态 sealMap 回退
    if (items.length === 0 && selectedIds.length > 0) {
      const allSeals = [
        ...SINGLE_SEALS || [],
        ...(this.data.businessSeals || []),
        ...(this.data.personalSeals || []),
        ...(this.data.professionalSeals || []),
      ];
      const sealMap = new Map(allSeals.map(s => [s.id, s]));
      const names = selectedData.names || [];
      items = selectedIds.map((id, idx) => {
        const s = sealMap.get(id);
        if (s) return { item_type: 'seal', seal_id: id, name: s.name, price: s.price, quantity: 1 };
        // sealMap 无数据时（如个人印章从 form 页跳转），用 names 回退
        return { item_type: 'seal', seal_id: id, name: names[idx] || id, price: 0, quantity: 1 };
      });
    }

    // 收集订单数据
    const orderData = {
      // type：后端根据此字段设置订单类型标签（personal/electronic/company）
      type: this.data.isPersonal ? 'personal' : this.data.isElectronic ? 'electronic' : 'company',
      // sealIds 兼容新旧格式：新 items 有 seal_id/package_id，旧流程用 selectedIds
      seal_ids: items.length > 0
        ? items.map(i => i.seal_id || i.package_id).filter(Boolean)
        : (selectedIds || []),
      items,  // 后端 orderItems 明细表（snake_case 字段）
      category_name: this.data.categoryName,
      is_personal: this.data.isPersonal,
      is_electronic: this.data.isElectronic,
      company_name: this.data.companyName,
      contact_phone: this.data.contactPhone,
      license_region: this.data.licenseRegion,
      seal_reason: this.data.sealReason,
      total_price: selectedData.totalPrice || this.data.totalPrice,
      // license_address_json: 执照地区JSON,用于派单匹配
      license_address_json: JSON.stringify(this._parseLicenseRegion(this.data.licenseRegion)),
      // address_json：后端通过 JSON.parse(address_json) 获取地址用于自动分配门店
      address_json: JSON.stringify(this.data.address || {}),
      invoice: this.data.invoice,
      remark: this.data.remark,
      materials: submitMaterials
    };

    // S-09: 复用已创建的订单ID，避免重复创建
    if (this._createdOrderId) {
      // 订单已创建，直接重新获取支付参数
      api.getSealPayParams(this._createdOrderId, wx.getStorageSync('openid') || '').then((payRes) => {
        wx.hideLoading();
        this._handlePayResponse(this._createdOrderId, payRes, selectedData, items);
      }).catch((payErr) => {
        console.error('getSealPayParams error:', payErr);
        wx.hideLoading();
        wx.showToast({ title: '获取支付参数失败', icon: 'none' });
        this.setData({ isSubmitting: false });
      });
      return;
    }

    api.createSealOrder(orderData).then((res) => {
      wx.hideLoading();
      // 后端返回新建订单（此时状态必为『待支付』，绝不会由前端预置已付）
      const orderId = res.id || res.orderNo;
      if (!orderId) {
        wx.showToast({ title: '订单创建失败', icon: 'none' });
        this.setData({ isSubmitting: false });
        return;
      }

      // S-09: 缓存已创建的订单ID，支付取消后可复用
      this._createdOrderId = orderId;

      // 第二步：向后端获取支付参数（真实统一下单 / 免费 / 开发模拟）
      api.getSealPayParams(orderId, wx.getStorageSync('openid') || '').then((payRes) => {
        this._handlePayResponse(orderId, payRes, selectedData, items);
      }).catch((payErr) => {
        console.error('getSealPayParams error:', payErr);
        wx.showToast({ title: '获取支付参数失败', icon: 'none' });
        this.setData({ isSubmitting: false });
      });
    }).catch((err) => {
      // 后端未接通：本地演示兜底（不预置已付，仅本地展示）
      console.error('createSealOrder error:', err);
      wx.hideLoading();
      wx.showModal({
        title: '模拟下单',
        content: '后端接口未接通，是否以本地模拟方式完成下单演示？',
        success: (modalRes) => {
          if (modalRes.confirm) {
            // 后端已完善，此演示分支不再可用，提示联系客服
            wx.showModal({
              title: '提示',
              content: '下单服务暂不可用，请稍后重试或联系客服',
              showCancel: false,
            });
          }
          this.setData({ isSubmitting: false });
        }
      });
    });
  },

  // 支付成功收尾：清缓存 + 提示 + 跳转（dev/free 场景服务端已同步完成支付+分配）
  _finishPaid(orderId, totalPrice, sealNames) {
    // S-09: 清除缓存的订单ID
    this._createdOrderId = null;
    wx.showToast({ title: '支付成功', icon: 'success' });
    this._clearOrderCache();
    setTimeout(() => { wx.switchTab({ url: '/pages/home/index' }); }, 1200);
  },

  // 正式微信支付后：轮询后端确认『已支付+已分配』
  // 微信支付结果以后端异步回调 completePayment 为准，此处仅做友好等待
  _pollPaid(orderId, totalPrice, sealNames) {
    let tries = 0;
    const poll = () => {
      api.getSealOrderDetail(orderId).then((detail) => {
        if (detail && detail.status >= 2) return this._finishPaid(orderId, totalPrice, sealNames);
        throw new Error('pending');
      }).catch(() => {
        if (tries++ < 4) {
          setTimeout(poll, 800);
        } else {
          // 轮询 4 次仍未确认（~3.2s）：不擅自判定成功，提示用户稍后查看
          wx.showToast({ title: '支付确认中，请稍后查看订单', icon: 'none', duration: 2500 });
          this.setData({ isSubmitting: false });
          setTimeout(() => { wx.switchTab({ url: '/pages/home/index' }); }, 2600);
        }
      });
    };
    poll();
  },

  // 解析执照地区字符串为JSON对象
  _parseLicenseRegion(regionStr) {
    if (!regionStr) return {};
    const parts = regionStr.split(' ').filter(Boolean);
    const [province, city, district] = parts;
    return { province: province || '', city: city || '', district: district || '' };
  },

  // 返回上一页
  goBack() {
    wx.navigateBack({ delta: 1 });
  },

  // ---------- 订单ID管理 ----------
  _getOrCreateOrderId() {
    // 检查是否已有当前订单ID
    let orderId = wx.getStorageSync('currentOrderId');
    if (!orderId) {
      // 生成新订单ID：前缀 + 时间戳 + 随机数
      orderId = 'SEAL_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
      wx.setStorageSync('currentOrderId', orderId);
    }
    return orderId;
  },

  // 清理订单临时缓存数据
  _clearOrderCache() {
    wx.removeStorageSync('selectedSealsData');
    wx.removeStorageSync('sealOrderForm');
    wx.removeStorageSync('materialInfo');
    wx.removeStorageSync('deliveryAddress');
    wx.removeStorageSync('invoiceInfo');
    wx.removeStorageSync('orderRemark');
    wx.removeStorageSync('materialUploadContext');
    wx.removeStorageSync('currentOrderId');
    wx.removeStorageSync('sealOrderPhone');
    // S-12: 清除材料上传导航数据
    wx.removeStorageSync('materialUploadNavData');
  },

  // S-09: 统一处理支付响应
  _handlePayResponse(orderId, payRes, selectedData, items) {
    const type = payRes.type;        // 'wechat' | 'free' | 'dev'
    const payment = payRes.payment;
    const sealNames = items.map(i => i.name).filter(Boolean).join('、');

    if (type === 'wechat' && payment) {
      // 正式支付：调起微信支付；成功后由后端异步回调置『已支付+分配』
      wx.requestPayment({
        timeStamp: payment.timeStamp,
        nonceStr: payment.nonceStr,
        package: payment.package,
        signType: payment.signType || 'RSA',
        paySign: payment.paySign,
        success: () => this._pollPaid(orderId, selectedData.totalPrice, sealNames),
        fail: (err) => {
          if (String(err.errMsg || '').indexOf('cancel') > -1) {
            wx.showToast({ title: '已取消支付', icon: 'none' });
          } else {
            wx.showToast({ title: '支付失败，请重试', icon: 'none' });
          }
          this.setData({ isSubmitting: false });
        }
      });
      return;
    }

    if (type === 'dev') {
      // 开发环境：服务端模拟微信回调完成支付+分配（生产环境该接口返回 403）
      api.devConfirmPay(orderId).then(() => this._finishPaid(orderId, selectedData.totalPrice, sealNames)).catch((e) => {
        console.error('devConfirmPay error:', e);
        wx.showToast({ title: '支付处理失败', icon: 'none' });
        this.setData({ isSubmitting: false });
      });
      return;
    }

    // free（价格为 0）：后端已在 createPayOrder 内完成支付+分配
    if (type === 'free') {
      this._finishPaid(orderId, selectedData.totalPrice, sealNames);
    } else if (type === 'wechat' && !payment) {
      // type=wechat 但无 payment：后端返回异常，前端不能擅自判定成功
      console.error('[Seal] 支付参数异常：type=wechat 但 payment 为空', payRes);
      wx.showToast({ title: '支付参数异常，请重试', icon: 'none' });
      this.setData({ isSubmitting: false });
    } else {
      // 未知 type：也不应直接 success
      console.error('[Seal] 未知支付类型:', type, payRes);
      wx.showToast({ title: '支付失败，请重试', icon: 'none' });
      this.setData({ isSubmitting: false });
    }
  },

  // 页面卸载时清理
  onUnload() {
    // S-09: 如果支付未完成，清除缓存的订单ID（下次重新创建）
    // 如果支付已完成，_finishPaid 已经清理了
  }

});


