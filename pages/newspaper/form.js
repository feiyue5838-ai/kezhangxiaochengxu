const api = require('../../utils/api.js');
const regionData = require('../../utils/region-data.js');

// 登报流程页面常量（避免硬编码路径散落多处）
const PAGE_ORDER = '/pages/newspaper/order';

Page({
  data: {
    businessType: '个人声明',
    charCount: 0,
    isSubmitting: false,
    isLoadingPapers: false,

    // 身份证信息(从 idcard-page 传来)
    idCardName: '',
    idCardNumber: '',
    templateId: '',
    templateName: '',

    // 报纸（API 驱动）
    papers: [],
    selectedPaper: '',   // 统一存字符串 ID，规避 UUID vs int 类型比较隐患

    issueCount: 1,
    copyCount: 1,

    selectedAddress: null,    // 选中的收货地址（后端）

    uploadList: [],
    remark: '',
    invoice: null,

    // 筛选器 - 省市区合并选择器（复用 region-data.js）
    regionArray: [regionData.provinces, regionData.getCitiesByProvince(regionData.provinces[0])],
    regionValue: [0, 0],
    regionText: regionData.provinces[0] + ' · ' + regionData.getCitiesByProvince(regionData.provinces[0])[0],
    // 当前选中的行政区划代码（用于精确匹配后端报纸）
    selectedProvinceCode: regionData.getProvinceCode(regionData.provinces[0]),
    selectedCityCode: '',
    filteredPapers: [],
    publishFee: 0,
    totalPrice: 0
  },

  onLoad(options) {
    const { type } = options;

    // 优先读取 idcard-page 跳转时存入的模板数据
    const templateData = wx.getStorageSync('newspaperTemplate') || {};
    if (templateData._timestamp) wx.removeStorageSync('newspaperTemplate');

    if (templateData.content) {
      this.setData({
        businessType: '身份证登报',
        content: templateData.content,
        charCount: templateData.content.length,
        templateId: templateData.id || '',
        templateName: templateData.name || ''
      });
      this.calculatePrice();
      return;
    }

    // 读取个人证件/企业证件入口的数据
    const navData = wx.getStorageSync('formPageNavData') || {};
    if (navData._timestamp) wx.removeStorageSync('formPageNavData');

    if (navData.type) {
      this.setData({
        businessType: navData.type + ' · ' + (navData.docName || ''),
        templateName: navData.docName || ''
      });
    }

    this.calculatePrice();
  },

  onShow() {
    // 读取已保存的发票信息
    const invoiceInfo = wx.getStorageSync('invoiceInfo');
    if (invoiceInfo && invoiceInfo.title) {
      this.setData({ invoice: invoiceInfo });
    }

    // 读取从 content-edit 页返回的内容
    const contentData = wx.getStorageSync('newspaperContent') || {};
    if (contentData._timestamp) {
      wx.removeStorageSync('newspaperContent');
      if (contentData.content) {
        this.setData({
          content: contentData.content,
          charCount: contentData.charCount,
          businessType: contentData.businessType || '个人声明',
          templateName: contentData.templateName || ''
        });
        this.calculatePrice();
      }
    }

    // 读取选中的收货地址（从地址列表页带回），否则拉取默认地址
    const selected = wx.getStorageSync('selectedAddress');
    if (selected && selected.id) {
      this.setData({ selectedAddress: selected });
    } else {
      this._loadDefaultAddress();
    }
  },

  onReady() {
    // 页面 Ready 后加载报纸数据
    this._loadPapers();
  },

  // 拉取默认/首选收货地址（无 token 时跳过，避免 401 误报"登录过期"）
  async _loadDefaultAddress() {
    if (!wx.getStorageSync('token')) return;
    try {
      const list = await api.getAddressList();
      if (list && list.length) {
        const def = list.find(a => a.isDefault) || list[0];
        this.setData({ selectedAddress: def });
      }
    } catch (e) {
      // 静默失败，由用户手动选择地址
    }
  },

  // 加载报纸列表（API 驱动，一次加载全部）
  async _loadPapers() {
    this.setData({ isLoadingPapers: true });
    try {
      const papers = await api.getNewspaperList({ pageSize: 200 });
      // 注入展示字段：logoColor、logoText、tag、minPrice
      const processed = (papers || []).map(p => this._processPaper(p));
      // 默认显示当前省份筛选结果（按行政区划代码精确匹配）
      const defaultProvinceCode = regionData.getProvinceCode(regionData.provinces[0]);
      const filtered = processed.filter(p => {
        return p.provinceCode === defaultProvinceCode || p.provinceCode === '' || !p.provinceCode;
      });
      this.setData({
        papers: processed,
        filteredPapers: filtered,
        isLoadingPapers: false
      });
      // 如果已有选中报纸（编辑场景），重新计算价格
      if (this.data.selectedPaper) {
        this.calculatePrice();
      }
    } catch (e) {
      console.error('加载报纸失败', e);
      this.setData({ isLoadingPapers: false });
      wx.showToast({ title: '加载报纸失败', icon: 'none' });
    }
  },

  // 为报纸注入前端展示字段
  _processPaper(paper) {
    // 省份短名（与后端一致）
    const province = paper.province || '';
    const isNational = province === '全国';
    const displayProvince = isNational ? '全国' : province;

    // Logo 颜色（基于名称一致性 Hash）
    const colors = [
      ['#5B6FE8', '#7B8FF7'], ['#FA8C16', '#FFD666'], ['#52C41A', '#95DE64'],
      ['#13C2C2', '#5CDBD3'], ['#722ED1', '#B37FEB'], ['#EB2F96', '#F759AB'],
      ['#F5222D', '#FF7875'], ['#FAAD14', '#FFE58F'], ['#2F54EB', '#85A5FF'],
      ['#1890FF', '#69C0FF'], ['#A0D911', '#D3F261'], ['#8C8C8C', '#BFBFBF']
    ];
    const colorIdx = (paper.name || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length;
    const [logoColor, logoColorEnd] = colors[colorIdx];

    // Logo 首字
    const logoText = (paper.name || '纸')[0];

    // 标签（级别）
    let tag = '';
    if (paper.level === 1) tag = '热门';
    else if (paper.level === 2) tag = '推荐';

    // 最低参考价 = pricePerWord × minWords（展示用）
    const pricePerWord = parseFloat(paper.pricePerWord) || 0;
    const minWords = paper.minWords || 50;
    const minPrice = Math.round(pricePerWord * minWords * 100) / 100;

    return {
      ...paper,
      province,
      provinceCode: paper.provinceCode || '',
      cityCode: paper.cityCode || '',
      displayProvince,
      logoColor,
      logoColorEnd,
      logoText,
      tag,
      minPrice,
      pricePerWord,
      minWords
    };
  },

  // 筛选器：省市区多列选择器 - 列变化时更新城市列表
  onRegionColumnChange(e) {
    if (e.detail.column === 0) {
      const province = regionData.provinces[e.detail.value];
      const cities = regionData.getCitiesByProvince(province);
      const newRegionArray = [this.data.regionArray[0], cities];
      const newRegionValue = [e.detail.value, 0];
      this.setData({
        regionArray: newRegionArray,
        regionValue: newRegionValue
      });
    }
  },

  // 筛选器：省市区多列选择器 - 确定选择
  onRegionChange(e) {
    const value = e.detail.value;
    const provinceFull = regionData.provinces[value[0]];
    const cities = regionData.getCitiesByProvince(provinceFull);
    const city = cities[value[1]] || cities[0];

    // 获取行政区划代码（用于精确匹配后端报纸）
    const provinceCode = regionData.getProvinceCode(provinceFull);
    const cityCode = city && city !== '直辖市' ? regionData.getCityCode(city, provinceFull) : '';

    const regionText = provinceFull + (city && city !== '直辖市' ? ' · ' + city : '');

    // 过滤出该省（含全国性）的报纸（按代码精确匹配）
    const filtered = this.data.papers.filter(p => {
      const matchProvince = p.provinceCode === provinceCode;
      const isNational = !p.provinceCode; // 无代码视为全国性报纸
      return matchProvince || isNational;
    });

    this.setData({
      regionValue: value,
      regionText: regionText,
      selectedProvinceCode: provinceCode,
      selectedCityCode: cityCode,
      filteredPapers: filtered
    });
  },

  onInvoiceTap() {
    wx.navigateTo({ url: '/pages/invoice/edit/index' });
  },

  goSelectAddress() {
    wx.navigateTo({ url: '/pages/address/index?mode=select' });
  },

  goBack() {
    wx.navigateBack();
  },

  contactService() {
    wx.makePhoneCall({ phoneNumber: '4000049919' });
  },

  editContent() {
    wx.navigateTo({ url: '/pages/newspaper/content-edit/index' });
  },

  selectPaper(e) {
    const id = e.currentTarget.dataset.id;
    // 切换报纸时清除旧的份数/期数/收件人（可选）
    this.setData({
      selectedPaper: String(id),
      issueCount: 1,
      copyCount: 1
    });
    this.calculatePrice();
  },

  adjustIssue(e) {
    const type = e.currentTarget.dataset.type;
    let count = this.data.issueCount;
    if (type === 'plus') {
      count = Math.min(count + 1, 10);
    } else {
      count = Math.max(count - 1, 1);
    }
    this.setData({ issueCount: count });
    this.calculatePrice();
  },

  adjustCopies(e) {
    const type = e.currentTarget.dataset.type;
    let count = this.data.copyCount;
    if (type === 'plus') {
      count = Math.min(count + 1, 10);
    } else {
      count = Math.max(count - 1, 1);
    }
    this.setData({ copyCount: count });
    this.calculatePrice();
  },

  addUpload() {
    const that = this;
    const maxCount = Math.min(3 - that.data.uploadList.length, 3);
    if (maxCount <= 0) {
      wx.showToast({ title: '最多上传3张图片', icon: 'none' });
      return;
    }
    wx.chooseMedia({
      count: maxCount,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success(res) {
        const validFiles = res.tempFiles.filter(item => {
          if (item.size > 5 * 1024 * 1024) {
            wx.showToast({ title: `图片 ${item.tempFilePath.split('/').pop()} 超过5MB，已跳过`, icon: 'none' });
            return false;
          }
          return true;
        });
        const newUploads = validFiles.map(item => item.tempFilePath);
        that.setData({ uploadList: that.data.uploadList.concat(newUploads) });
      }
    });
  },

  removeUpload(e) {
    const index = e.currentTarget.dataset.index;
    const list = this.data.uploadList.slice();
    list.splice(index, 1);
    this.setData({ uploadList: list });
  },

  onContentInput(e) {
    const content = e.detail.value;
    this.setData({ content, charCount: content.length });
    this.calculatePrice();
  },

  onRemarkInput(e) {
    this.setData({ remark: e.detail.value });
  },

  /**
   * 计算价格：优先调用后端 calculatePrice 接口，口令/兜底时使用本地公式
   * 公式：publishFee = 单价 × max(字数, 最低字数) × 期数 × 份数
   */
  calculatePrice() {
    const selectedPaperId = String(this.data.selectedPaper || '');
    const paper = this.data.papers.find(p => String(p.id) === selectedPaperId);
    if (!paper) {
      this.setData({ publishFee: 0, totalPrice: 0 });
      return;
    }

    const charCount = this.data.charCount || 20;
    const issueCount = this.data.issueCount || 1;
    const copyCount = this.data.copyCount || 1;

    // 调用后端计价接口（传入全部参数，包含 copyCount）
    api.getNewspaperPrice({
      newspaperId: selectedPaperId,
      contentLength: charCount,
      issueCount,
      copyCount
    }).then(res => {
      if (res && res.totalPrice != null) {
        this.setData({
          publishFee: res.totalPrice,
          totalPrice: res.totalPrice
        });
      } else {
        this._calcPriceLocally(paper, charCount, issueCount, copyCount);
      }
    }).catch(() => {
      // 网络异常时兜底本地计算
      this._calcPriceLocally(paper, charCount, issueCount, copyCount);
    });
  },

  /** 本地兜底计价公式（publishFee = 单价 × max(字数,最低字数) × 期数 × 份数） */
  _calcPriceLocally(paper, charCount, issueCount, copyCount) {
    const pricePerWord = paper.pricePerWord || 0;
    const minWords = paper.minWords || 50;
    const billableWords = Math.max(charCount, minWords);
    const publishFee = pricePerWord * billableWords * issueCount * copyCount;
    this.setData({
      publishFee: Math.round(publishFee * 100) / 100,
      totalPrice: Math.round(publishFee * 100) / 100
    });
  },

  submitOrder() {
    if (this.data.isSubmitting) {
      wx.showToast({ title: '请求处理中，请稍候', icon: 'none' });
      return;
    }
    this.setData({ isSubmitting: true });

    const that = this;

    if (!String(that.data.selectedPaper || '')) {
      that.setData({ isSubmitting: false });
      wx.showToast({ title: '请先选择报纸', icon: 'none' });
      return;
    }

    if (!that.data.selectedAddress || !that.data.selectedAddress.id) {
      that.setData({ isSubmitting: false });
      wx.showToast({ title: '请先选择收货地址', icon: 'none' });
      return;
    }

    if (!that.data.content || !that.data.content.trim()) {
      that.setData({ isSubmitting: false });
      wx.showToast({ title: '请填写登报内容', icon: 'none' });
      return;
    }

    const paper = that.data.papers.find(p => String(p.id) === String(that.data.selectedPaper || ''));
    const address = that.data.selectedAddress;

    wx.showModal({
      title: '确认支付',
      content: '报纸：' + paper.name + '\n' + that.data.issueCount + '期 · ' + that.data.copyCount + '份\n合计：¥' + that.data.totalPrice,
      async success(res) {
        if (!res.confirm) {
          that.setData({ isSubmitting: false });
          return;
        }
        wx.showLoading({ title: '上传证件中..' });
        let images = [];
        if ((that.data.uploadList || []).length > 0) {
          try {
            images = await Promise.all(that.data.uploadList.map(p => api.uploadFile(p)));
          } catch (e) {
            wx.hideLoading();
            wx.showToast({ title: '证件上传失败，请重试', icon: 'none' });
            that.setData({ isSubmitting: false });
            return;
          }
        }
        wx.showLoading({ title: '提交中..' });
        const dto = {
          type: that.data.businessType,
          content: that.data.content,
          newspaperId: String(that.data.selectedPaper || ''),
          newspaperName: paper.name,
          templateId: that.data.templateId || '',
          issueCount: that.data.issueCount,
          copyCount: that.data.copyCount,
          price: that.data.totalPrice,
          addressId: address.id,
          addressJson: JSON.stringify(address),
          remark: that.data.remark || '',
          invoice: that.data.invoice || null,
          images: images
        };
        api.createNewspaperOrder(dto).then((order) => {
          wx.hideLoading();
          that._payOrder(order.id);
        }).catch(() => {
          wx.hideLoading();
          that.setData({ isSubmitting: false });
        });
      }
    });
  },

  // 发起支付（对齐刻章下单流程）
  _payOrder(orderId) {
    const that = this;
    const app = getApp();
    const openid = (app && app.globalData && app.globalData.openid) || '';
    api.getNewspaperPayParams(orderId, openid).then((data) => {
      const pay = data || {};
      if (pay.type === 'wechat' && pay.payment) {
        wx.requestPayment({
          ...pay.payment,
          success() { that._finishPaid(orderId); },
          fail(err) {
            if (err && err.errMsg && err.errMsg.indexOf('cancel') >= 0) {
              wx.showToast({ title: '已取消支付', icon: 'none' });
            } else {
              wx.showToast({ title: '支付失败', icon: 'none' });
            }
            that.setData({ isSubmitting: false });
          }
        });
      } else if (pay.type === 'dev') {
        api.devConfirmPay(orderId).then(() => that._finishPaid(orderId)).catch(() => that.setData({ isSubmitting: false }));
      } else {
        that._finishPaid(orderId);
      }
    }).catch(() => {
      that.setData({ isSubmitting: false });
      wx.showToast({ title: '获取支付参数失败', icon: 'none' });
    });
  },

  _finishPaid(orderId) {
    this.setData({ isSubmitting: false });
    wx.showToast({ title: '下单成功', icon: 'success' });
    setTimeout(() => {
      wx.redirectTo({ url: PAGE_ORDER });
    }, 1200);
  }
});
