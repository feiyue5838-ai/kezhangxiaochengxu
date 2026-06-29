const api = require('../../../utils/api.js');
const common = require('../../../utils/common.js');

Page({
  data: {
    // 导航栏相关
    statusBarHeight: 20,
    navHeight: 64,
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
      { id: 's8',  name: '手动钢印章',       img: '/assets/images/seal-gang-yinshang.svg', price: 180 },
      { id: 's9',  name: '自动钢印章',       img: '/assets/images/seal-gang-yinshang.svg', price: 180 },
      { id: 's10', name: '业务专用章',        img: '/assets/images/seal-gang-yinshang.svg', price: 150 },
      { id: 's11', name: '销售合同章',        img: '/assets/images/seal-gang-yinshang.svg', price: 150 },
      { id: 's12', name: '发货专用章',        img: '/assets/images/seal-gang-yinshang.svg', price: 150 },
      { id: 's13', name: '技术专用章',        img: '/assets/images/seal-gang-yinshang.svg', price: 150 },
      { id: 's14', name: '质检章',            img: '/assets/images/seal-gang-yinshang.svg', price: 150 },
      { id: 's15', name: '收据专用章',        img: '/assets/images/seal-gang-yinshang.svg', price: 150 },
      { id: 's16', name: '委员会章',          img: '/assets/images/seal-gang-yinshang.svg', price: 150 },
      { id: 's17', name: '生产办公室章',      img: '/assets/images/seal-gang-yinshang.svg', price: 150 },
      { id: 's18', name: '人事专用章',        img: '/assets/images/seal-gang-yinshang.svg', price: 150 },
      { id: 's19', name: '授权专用章',        img: '/assets/images/seal-gang-yinshang.svg', price: 150 },
      { id: 's20', name: '资质专用章',        img: '/assets/images/seal-gang-yinshang.svg', price: 150 },
      { id: 's21', name: '质量管理部章',     img: '/assets/images/seal-gang-yinshang.svg', price: 150 },
      { id: 's22', name: '项目章',            img: '/assets/images/seal-gang-yinshang.svg', price: 150 },
      { id: 's23', name: '办事机构印章',      img: '/assets/images/seal-gang-yinshang.svg', price: 150 },
      { id: 's24', name: '组委会章',          img: '/assets/images/seal-gang-yinshang.svg', price: 150 },
      { id: 's25', name: '其他章(下单备注章名)', img: '/assets/images/seal-gang-yinshang.svg', price: 150 },
      { id: 's26', name: '个人签名章', img: '/assets/images/seal-farenzhang.svg', price: 80 },
      { id: 's27', name: '拆迁、买房使用', img: '/assets/images/seal-farenzhang.svg', price: 80 },
      { id: 's28', name: '公证使用', img: '/assets/images/seal-farenzhang.svg', price: 80 },
      { id: 's29', name: '企业员工使用', img: '/assets/images/seal-farenzhang.svg', price: 80 },
      { id: 's30', name: '一级造价工程师', img: '/assets/images/seal-gang-yinshang.svg', price: 150 },
      { id: 's31', name: '一级注册建造师', img: '/assets/images/seal-gang-yinshang.svg', price: 150 },
      { id: 's32', name: '一级注册结构工程师', img: '/assets/images/seal-gang-yinshang.svg', price: 150 },
      { id: 's33', name: '注册监理工程师', img: '/assets/images/seal-gang-yinshang.svg', price: 150 },
      { id: 's34', name: '二级注册建筑师', img: '/assets/images/seal-gang-yinshang.svg', price: 150 },
      { id: 's35', name: '电气工程师', img: '/assets/images/seal-gang-yinshang.svg', price: 150 },
      { id: 's36', name: '房地产评估师', img: '/assets/images/seal-gang-yinshang.svg', price: 150 },
      { id: 's37', name: '会计师', img: '/assets/images/seal-gang-yinshang.svg', price: 150 },
      { id: 's38', name: '项目经理', img: '/assets/images/seal-gang-yinshang.svg', price: 150 },
      { id: 's39', name: '二级造价工程师', img: '/assets/images/seal-gang-yinshang.svg', price: 150 },
      { id: 's40', name: '二级注册建造师', img: '/assets/images/seal-gang-yinshang.svg', price: 150 },
      { id: 's41', name: '二级注册结构工程师', img: '/assets/images/seal-gang-yinshang.svg', price: 150 },
      { id: 's42', name: '一级注册建筑师', img: '/assets/images/seal-gang-yinshang.svg', price: 150 },
      { id: 's43', name: '土木工程师', img: '/assets/images/seal-gang-yinshang.svg', price: 150 },
      { id: 's44', name: '化工工程师', img: '/assets/images/seal-gang-yinshang.svg', price: 150 },
      { id: 's45', name: '执业律师', img: '/assets/images/seal-gang-yinshang.svg', price: 150 },
      { id: 's46', name: '税务师', img: '/assets/images/seal-gang-yinshang.svg', price: 150 },
      { id: 's47', name: '其他(下单请备注章名）', img: '/assets/images/seal-gang-yinshang.svg', price: 150 },
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

    // 材料上传
    materials: {
      license: '',
      idCardFront: '',
      idCardBack: '',
      photo: ''
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
    canSubmit: false,
    isSubmitting: false  // 防止重复提交
  },

  onLoad(options) {
    // 从全局数据读取导航栏高度（app.js 已计算）
    const statusBarHeight = common.getNavigationHeight().statusBarHeight;
    const navHeight = statusBarHeight + 64;
    this.setData({ statusBarHeight, navHeight });

    this.setData({ pageTitle: '确认订单' });

    // 生成或获取订单ID（用于数据隔离）
    const orderId = this._getOrCreateOrderId();

    // 读取表单数据（从表单页 Storage 传递）
    const formData = wx.getStorageSync('sealOrderForm') || null;
    if (formData) {
      this.setData({
        licenseRegion: formData.region || '成都',
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

    const { ids, names, seals, categoryName, isPersonal, isElectronic } = data;

    // 性能优化：构建 Map 进行 O(1) 查找
    const allSeals = this.data.singleSeals.concat(this.data.packages);
    const sealMap = new Map(allSeals.map(s => [s.id, s]));

    // 计算总价
    let totalPrice = 0;
    ids.forEach(id => {
      const item = sealMap.get(id);
      if (item) totalPrice += (item.price || 0);
    });

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

    const licenseRegion = this.data.licenseRegion || '成都';

    this.setData({
      'materialRules.license.regionNote': this.getLicenseNote(licenseRegion),
      'materialRules.photo.regionNote': this.getPhotoNote(licenseRegion),
      'needLegalPhoto': this._needLegalPhoto(licenseRegion)
    });

    this.checkSubmitStatus();
  },

  // 每次显示页面时刷新数据（从子页返回时）
  onShow() {
    this.loadSavedData();
  },

  // 加载已保存的数据
  loadSavedData() {
    // 读取地址
    const address = wx.getStorageSync('deliveryAddress') || null;
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
      // 直接使用字符串字段，与 material-upload 写入格式一致
      this.setData({
        'materials.license': material.license || '',
        'materials.idCardFront': material.idCardFront || '',
        'materials.idCardBack': material.idCardBack || '',
        'materials.photo': material.legalPhoto || ''
      });
    }

    this.checkSubmitStatus();
  },

  // 获取营业执照要求说明
  getLicenseNote(region) {
    return common.getLicenseNote(region);
  },

  // 获取照片要求说明（order-confirm 材料须知用）
  getPhotoNote(region) {
    return common.getPhotoNote(region);
  },

  // 检查是否可以提交
  checkSubmitStatus() {
    const { address, materials, isPersonal, isElectronic } = this.data;
    const hasAddress = address && address.detail;

    // 使用公共函数检查材料完整性
    const needPhoto = this._needLegalPhoto(this.data.licenseRegion);
    const materialsComplete = common.checkMaterialsComplete(materials, { isPersonal, isElectronic, needPhoto });

    this.setData({ canSubmit: hasAddress && materialsComplete });
  },

  // 判断区域是否需要法人照片
  _needLegalPhoto(region) {
    return common.needLegalPhoto(region);
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
      selectedSealIds: selectedData.ids || [],
      categoryName: selectedData.categoryName || ''
    });
    // 通过 Storage 传递中文参数，避免 URL 编码问题
    wx.setStorageSync('materialUploadNavData', {
      region: this.data.licenseRegion || '成都',
      isPersonal: this.data.isPersonal,
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
      idCard: ['materials.idCardFront', 'materials.idCardBack'],
      photo: 'materials.photo'
    };

    if (type === 'idCard') {
      this.setData({
        'materials.idCardFront': '',
        'materials.idCardBack': ''
      });
    } else {
      this.setData({
        [fieldMap[type]]: ''
      });
    }

    this.checkSubmitStatus();
  },

  // 预览材料
  onPreviewMaterial(e) {
    const { url } = e.currentTarget.dataset;
    wx.previewImage({
      current: url,
      urls: [url]
    });
  },

  // 付款
  onPayTap() {
    // 防止重复提交
    if (this.data.isSubmitting) {
      wx.showToast({ title: '订单提交中，请稍候', icon: 'none' });
      return;
    }
    if (!this.data.canSubmit) {
      // 精确提示缺什么
      const { address, materials, isPersonal, isElectronic } = this.data;
      const hasAddress = address && address.detail;
      const needPhoto = this._needLegalPhoto(this.data.licenseRegion);
      const materialsComplete = common.checkMaterialsComplete(materials, { isPersonal, isElectronic, needPhoto });
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

    // 收集订单数据
    const orderData = {
      sealIds: (wx.getStorageSync('selectedSealsData') || {}).ids || [],
      categoryName: this.data.categoryName,
      isPersonal: this.data.isPersonal,
      isElectronic: this.data.isElectronic,
      companyName: this.data.companyName,
      contactPhone: this.data.contactPhone,
      licenseRegion: this.data.licenseRegion,
      sealReason: this.data.sealReason,
      totalPrice: this.data.totalPrice,
      address: this.data.address,
      invoice: this.data.invoice,
      remark: this.data.remark,
      materials: {
        license: this.data.materials.license,
        idCardFront: this.data.materials.idCardFront,
        idCardBack: this.data.materials.idCardBack,
        legalPhoto: this.data.materials.photo
      }
    };

    api.createSealOrder(orderData).then((res) => {
      wx.hideLoading();

      // 后端返回微信支付参数，调起支付
      const payParams = res.payParams || res;
      wx.requestPayment({
        timeStamp: payParams.timeStamp,
        nonceStr: payParams.nonceStr,
        package: payParams.package,
        signType: payParams.signType || 'RSA',
        paySign: payParams.paySign,
        success: () => {
          wx.showToast({ title: '支付成功', icon: 'success' });
          // 清理当前订单临时数据
          this._clearOrderCache();
          // 跳转订单详情或首页
          setTimeout(() => {
            wx.switchTab({ url: '/pages/home/index' });
          }, 1500);
        },
        fail: (err) => {
          if (err.errMsg.includes('cancel')) {
            wx.showToast({ title: '已取消支付', icon: 'none' });
          } else {
            wx.showToast({ title: '支付失败，请重试', icon: 'none' });
          }
          this.setData({ isSubmitting: false });
        }
      });
    }).catch((err) => {
      wx.hideLoading();
      wx.showToast({ title: err.message || '订单创建失败', icon: 'none' });
      this.setData({ isSubmitting: false });
    });
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
  },

  // 获取隔离的 Storage Key
  _getStorageKey(baseKey) {
    const orderId = wx.getStorageSync('currentOrderId') || 'DEFAULT';
    return `${baseKey}_${orderId}`;
  }
});


