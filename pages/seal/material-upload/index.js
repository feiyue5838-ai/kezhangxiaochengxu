const common = require('../../../utils/common.js');
const api = require('../../../utils/api.js');

Page({
  data: {
    pageTitle: '上传材料',

    isPersonal: false,
    isCompany: false,
    isElectronic: false,
    region: '',

    // ---------- 动态标题（个体户 vs 企业） ----------
    isIndividual: false,
    idCardTitle: '身份证',
    photoTitle: '法人照片',
    photoNote: '',

    // ---------- 区域照片标志 ----------
    needLegalPhoto: false,      // 法人白底自拍照（特定区域）
    needHandheldId: false,      // 法人手持身份证（上海/山东/新疆/贵阳）

    // ---------- 条件渲染标志 ----------
    needProfessionalCert: false,   // 选了职业章（s30-s47）时需要上传执业证书
    needSignature: false,          // 选了个人签名章（s26）时需要上传签名

    // ---------- 身份证（个人模式必填，公司模式法人身份证） ----------
    idCardFront: '',
    idCardBack: '',

    // ---------- 企业模式：营业执照 + 法人照片 + 手持身份证 ----------
    license: '',
    legalPhoto: '',
    handheldIdPhoto: '',   // 法人手持身份证（上海/山东/新疆/贵阳地区）

    // ---------- 执业证书（职业章必填） ----------
    professionalCert: '',

    // ---------- 个人签名章签名（s26必填） ----------
    signature: '',

    // ---------- 补充手续（选填） ----------
    additional: [],

    // ---------- 提交 ----------
    canSubmit: false,
  },

  async onLoad(options) {
    // 未登录时拦截，避免上传材料后撞 401 导致材料浪费
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.showModal({
        title: '请先登录',
        content: '上传材料前需先登录，是否前往登录？',
        success: (res) => {
          if (res.confirm) wx.navigateTo({ url: '/pages/auth/index' });
        },
      });
      return;
    }

    this.setData({ pageTitle: '上传材料' });

    // 清理过期的 Storage 数据
    this._cleanExpiredData();

    // 从 Storage 读取导航参数（order-confirm 跳转时携带）
    const navData = wx.getStorageSync('materialUploadNavData') || {};
    if (navData._timestamp) wx.removeStorageSync('materialUploadNavData');
    const isPersonal = !!navData.isPersonal;
    let region = navData.region || '';
    // fallback：Storage 没传 region 时从 form Storage 读取
    if (!region) {
      const formData = wx.getStorageSync('sealOrderForm') || {};
      region = formData.region || '成都';
    }
    const categoryName = navData.categoryName || '';

    // 从 Storage 获取已选择的印章 ID 列表
    const context = wx.getStorageSync('materialUploadContext') || {};
    const selectedSealIds = context.selectedSealIds || [];
    const isElectronic = !!context.isElectronic;

    // 企业/电子印章模式
    const isCompany = !isPersonal;

    // 判断是否是个体户
    const isIndividual = categoryName === '个体户';

    // S-11: 职业章/签名章判定 - 改为数据驱动（从 items 中读取 categoryName 或标记）
    // 如果 context.selectedItems 有数据，使用后端返回的分类信息
    const selectedItems = context.selectedItems || [];
    const hasProfessional = selectedItems.some(item => 
      item.requiresCert || /执业|资格|职业|建造师|工程师|会计师|律师|税务师/.test(item.categoryName || item.name || '')
    );
    const hasSignature = selectedItems.some(item => 
      /签名章/.test(item.name || '')
    ) || selectedSealIds.some(id => {
      // 兼容旧流程：尝试匹配后端返回的印章名称
      const item = selectedItems.find(i => i.seal_id === id || i.id === id);
      return item && /签名章/.test(item.name || '');
    });

    // 动态计算身份证标题
    let idCardTitle = '身份证';
    if (isCompany) {
      idCardTitle = isIndividual ? '经营者身份证' : '法人身份证';
    }

    // 法人白底自拍照：企业和个体户模式下，仅后台配置的地区显示（SystemConfig.legalPhotoCities）
    // 默认上海/山东/新疆/贵阳；接口异常/无记录时沿用兜底列表，保证功能不中断。
    // 注意：显式配置空数组 [] 表示所有地区都不显示，需尊重（故仅异常时兜底）。
    const LEGAL_PHOTO_FALLBACK = ['上海', '山东', '新疆', '贵阳'];
    let legalPhotoCities = LEGAL_PHOTO_FALLBACK;
    try {
      const cfg = await api.getConfig('legalPhotoCities');
      if (Array.isArray(cfg)) legalPhotoCities = cfg;
    } catch (e) {
      // 接口异常时沿用兜底列表
    }
    const needLegalPhoto = (isCompany || isIndividual) && legalPhotoCities.some(city => (region || '').includes(city));

    // 法人手持身份证：所需地区改由后台配置（SystemConfig.handheldIdCities）下发，
    // 默认上海/山东/新疆/贵阳；接口异常/无记录时沿用兜底列表，保证功能不中断。
    const HANDHELD_FALLBACK = ['上海', '山东', '新疆', '贵阳'];
    let handheldCities = HANDHELD_FALLBACK;
    try {
      const cfg = await api.getConfig('handheldIdCities');
      if (Array.isArray(cfg)) handheldCities = cfg;
    } catch (e) {
      // 接口异常（如网络不通）时沿用兜底列表
    }
    const needHandheldId = isCompany && handheldCities.some(city => (region || '').includes(city));

    // 动态计算照片标题和提示
    let photoTitle = '';
    let photoNote = '';
    if (needLegalPhoto) {
      photoTitle = isIndividual ? '经营者自拍半身照' : '法人自拍半身照';
      photoNote = '';
    }

    this.setData({
      isPersonal,
      isCompany,
      isElectronic,
      region,
      isIndividual,
      needLegalPhoto,
      needHandheldId,
      needProfessionalCert: isPersonal && hasProfessional,
      needSignature: isPersonal && hasSignature,
      idCardTitle,
      photoTitle,
      photoNote
    });

    // 预载已上传材料：重新进入上传页时回显，避免 onSubmit 整体覆盖导致之前上传的材料丢失
    const savedM = wx.getStorageSync('materialInfo') || {};
    const restore = {};
    ['idCardFront', 'idCardBack', 'license', 'legalPhoto', 'professionalCert', 'signature', 'handheldIdPhoto'].forEach((k) => {
      if (savedM[k]) restore[k] = savedM[k];
    });
    if (Array.isArray(savedM.additional) && savedM.additional.length) restore.additional = savedM.additional;
    if (Object.keys(restore).length) this.setData(restore);

    // 初始化提交按钮状态
    this.checkSubmitStatus();
  },

  // ---------- 清理过期数据 ----------
  _cleanExpiredData() {
    // S-12: 清理超过24小时的临时数据，写入时需带 _timestamp
    const keysToCheck = ['selectedSealsData', 'sealOrderForm', 'materialInfo'];
    const now = Date.now();
    const MAX_AGE = 24 * 60 * 60 * 1000; // 24小时

    keysToCheck.forEach(key => {
      const data = wx.getStorageSync(key);
      if (data && data._timestamp) {
        if (now - data._timestamp > MAX_AGE) {
          wx.removeStorageSync(key);
        }
      }
    });
  },

  // ---------- 通用上传 ----------
  chooseImage(type, count = 1) {
    // 图片大小限制：5MB
    const MAX_SIZE = 5 * 1024 * 1024;

    wx.chooseMedia({
      count,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const file = res.tempFiles[0];
        // 大小校验
        if (file.size > MAX_SIZE) {
          wx.showToast({ title: '图片大小不能超过5MB', icon: 'none' });
          return;
        }
        const tempPath = file.tempFilePath;

        if (type === 'additional') {
          // 补充材料多张检查
          const currentCount = this.data.additional.length;
          const remaining = 5 - currentCount;
          if (remaining <= 0) {
            wx.showToast({ title: '补充材料最多上传5张', icon: 'none' });
            return;
          }
          const oversized = res.tempFiles.filter(f => f.size > MAX_SIZE);
          if (oversized.length > 0) {
            wx.showToast({ title: '部分图片超过5MB，已跳过', icon: 'none' });
            const validFiles = res.tempFiles.filter(f => f.size <= MAX_SIZE);
            if (validFiles.length > 0) {
              const list = this.data.additional;
              this.setData({ additional: [...list, ...validFiles.map(f => f.tempFilePath)] });
            }
          } else {
            const list = this.data.additional;
            this.setData({ additional: [...list, ...res.tempFiles.map(f => f.tempFilePath)] });
          }
        } else {
          this.setData({ [type]: tempPath });
        }

        this.checkSubmitStatus();
      }
    });
  },

  // ---------- 删除图片 ----------
  onDeleteImage(e) {
    const { type, index } = e.currentTarget.dataset;

    if (type === 'additional') {
      const list = [...this.data.additional];
      list.splice(index, 1);
      this.setData({ additional: list });
    } else {
      this.setData({ [type]: '' });
    }

    this.checkSubmitStatus();
  },

  // ---------- 预览/替换图片 ----------
  onImageTap(e) {
    const { url, field } = e.currentTarget.dataset;

    wx.showActionSheet({
      itemList: ['预览图片', '重新上传'],
      success: (res) => {
        if (res.tapIndex === 0) {
          wx.previewImage({ current: url, urls: [url] });
        } else if (res.tapIndex === 1) {
          // 重新上传，field 直接映射 chooseImage 的 type 参数
          const cnt = field === 'additional' ? 5 : 1;
          this.chooseImage(field, cnt);
        }
      }
    });
  },

  // ---------- 预览图片 ----------
  onPreviewImage(e) {
    const { url, urls } = e.currentTarget.dataset;
    wx.previewImage({
      current: url,
      urls: urls || [url]
    });
  },

  // ---------- 各上传入口 ----------
  onIdCardFrontTap() { this.chooseImage('idCardFront'); },
  onIdCardBackTap() { this.chooseImage('idCardBack'); },
  onLicenseTap() { this.chooseImage('license'); },
  onLegalPhotoTap() { this.chooseImage('legalPhoto'); },
  onHandheldIdTap() { this.chooseImage('handheldIdPhoto'); },
  onCertTap() { this.chooseImage('professionalCert'); },
  onSignatureTap() { this.chooseImage('signature'); },
  onAdditionalTap() { this.chooseImage('additional', 5); },

  // ---------- 检查是否可以提交 ----------
  checkSubmitStatus() {
    const { isPersonal, isCompany, isElectronic, license, legalPhoto, idCardFront, idCardBack, professionalCert, signature, needProfessionalCert, needSignature } = this.data;

    if (isCompany || isElectronic) {
      // 企业/电子印章模式：营业执照 + 法人身份证正反面
      let canSubmit = !!(license && idCardFront && idCardBack);
      // 法人白底自拍照：电子印章必传；公司/个体户仅在后台白名单地区必传（与 order-confirm 对齐）
      const photoRequired = isElectronic || this.data.needLegalPhoto;
      if (photoRequired) {
        canSubmit = canSubmit && !!this.data.legalPhoto;
      }
      // 上海/山东/新疆/贵阳地区需要法人手持身份证
      if (this.data.needHandheldId) {
        canSubmit = canSubmit && !!this.data.handheldIdPhoto;
      }
      this.setData({ canSubmit });
      return;
    }

    // 个人印章模式：身份证正反面
    let canSubmit = !!(idCardFront && idCardBack);

    // 职业章必填校验
    if (needProfessionalCert) {
      canSubmit = canSubmit && !!professionalCert;
    }

    // 个人签名必填校验
    if (needSignature) {
      canSubmit = canSubmit && !!signature;
    }

    this.setData({ canSubmit });
  },

  // ---------- 提交 ----------
  onSubmit() {
    if (!this.data.canSubmit) return;

    // 与已保存材料合并，避免重新进入时整体覆盖掉之前上传的文件
    const savedM = wx.getStorageSync('materialInfo') || {};
    // S-12: 写入时添加时间戳
    const material = {
      ...savedM,
      // 身份证材料（个人/公司/电子印章共用）
      idCardFront: this.data.idCardFront,
      idCardBack: this.data.idCardBack,

      // 个人印章特有材料
      professionalCert: this.data.professionalCert,
      signature: this.data.signature,

      // 法人手持身份证（上海/山东/新疆/贵阳地区）
      handheldIdPhoto: this.data.handheldIdPhoto,

      // 企业/电子印章材料
      license: this.data.license,
      legalPhoto: this.data.legalPhoto,

      // 补充材料
      additional: this.data.additional,

      // 时间戳
      _timestamp: Date.now()
    };

    wx.setStorageSync('materialInfo', material);
    wx.showToast({ title: '提交成功', icon: 'success' });

    setTimeout(() => {
      wx.navigateBack();
    }, 1000);
  },

  // 返回上一页
  goBack() {
    wx.navigateBack({ delta: 1 });
  }
});
