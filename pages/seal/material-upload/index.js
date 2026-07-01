const common = require('../../../utils/common.js');

Page({
  data: {
    // 导航栏相关
    statusBarHeight: 20,
    navHeight: 64,
    menuCenterY: 0,
    menuRight: 0,
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
    needLegalPhoto: false,

    // ---------- 条件渲染标志 ----------
    needProfessionalCert: false,   // 选了职业章（s30-s47）时需要上传执业证书
    needSignature: false,          // 选了个人签名章（s26）时需要上传签名

    // ---------- 身份证（个人模式必填，公司模式法人身份证） ----------
    idCardFront: '',
    idCardBack: '',

    // ---------- 企业模式：营业执照 + 法人照片 ----------
    license: '',
    legalPhoto: '',

    // ---------- 执业证书（职业章必填） ----------
    professionalCert: '',

    // ---------- 个人签名章签名（s26必填） ----------
    signature: '',

    // ---------- 补充手续（选填） ----------
    additional: [],
  },

  onLoad(options) {
    // 从全局数据读取导航栏高度（app.js 已计算）
    const { statusBarHeight, navHeight } = common.getNavigationHeight();
    // 读取胶囊按钮位置，让返回键与 ··· 三个点垂直居中对齐
    const menuRect = wx.getMenuButtonBoundingClientRect();
    const menuCenterY = (menuRect.top + menuRect.height / 2);
    this.setData({ statusBarHeight, navHeight, menuCenterY, menuRight: menuRect.width + 12 });

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

    // 个人印章：判断是否需要额外模块
    const hasProfessional = selectedSealIds.some(id =>
      ['s30','s31','s32','s33','s34','s35','s36','s37','s38',
        's39','s40','s41','s42','s43','s44','s45','s46','s47'].includes(id)
    );
    const hasSignature = selectedSealIds.includes('s26');

    // 动态计算身份证标题
    let idCardTitle = '身份证';
    if (isCompany) {
      idCardTitle = isIndividual ? '经营者身份证' : '法人身份证';
    }

    // 哪些区域需要上传法人/经营者照片（使用公共函数）
    const needLegalPhoto = isCompany && common.needLegalPhoto(region);

    // 动态计算照片标题和提示（仅需要照片的区域）
    let photoTitle = '';
    let photoNote = '';
    if (needLegalPhoto) {
      const isXinjin = region.includes('新津');
      if (isIndividual) {
        photoTitle = '经营者照片';
        photoNote = isXinjin ? '新津地区需经营者手持身份证照片' : (region + '地区需经营者白底自拍照');
      } else {
        photoTitle = '法人照片';
        photoNote = isXinjin ? '新津地区需法人手持身份证照片' : (region + '地区需法人白底自拍照');
      }
    }

    this.setData({
      isPersonal,
      isCompany,
      isElectronic,
      region,
      isIndividual,
      needLegalPhoto,
      needProfessionalCert: isPersonal && hasProfessional,
      needSignature: isPersonal && hasSignature,
      idCardTitle,
      photoTitle,
      photoNote
    });
  },

  // ---------- 清理过期数据 ----------
  _cleanExpiredData() {
    // 清理超过24小时的临时数据
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
  onCertTap() { this.chooseImage('professionalCert'); },
  onSignatureTap() { this.chooseImage('signature'); },
  onAdditionalTap() { this.chooseImage('additional', 5); },

  // ---------- 检查是否可以提交 ----------
  checkSubmitStatus() {
    const { isPersonal, isCompany, isElectronic, license, legalPhoto, idCardFront, idCardBack, professionalCert, signature, needProfessionalCert, needSignature } = this.data;

    if (isCompany || isElectronic) {
      // 企业/电子印章模式：营业执照 + 法人身份证正反面
      let canSubmit = !!(license && idCardFront && idCardBack);
      // 电子印章或特定区域需要法人/经营者照片
      if (isElectronic || this.data.needLegalPhoto) {
        canSubmit = canSubmit && !!legalPhoto;
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

    const material = {
      // 身份证材料（个人/公司/电子印章共用）
      idCardFront: this.data.idCardFront,
      idCardBack: this.data.idCardBack,

      // 个人印章特有材料
      professionalCert: this.data.professionalCert,
      signature: this.data.signature,

      // 企业/电子印章材料
      license: this.data.license,
      legalPhoto: this.data.legalPhoto,

      // 补充材料
      additional: this.data.additional
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
