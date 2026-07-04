const common = require('../../utils/common.js');
const paperConfig = require('../../utils/newspaper-papers.js');

Page({
  data: {
    // 导航栏
    statusBarHeight: 20,
    navHeight: 64,
    // 内容
    businessType: '个人声明',
    charCount: 0,
    isSubmitting: false,
    // 身份证信息(从idcard-page传来)
    idCardName: '',
    idCardNumber: '',
    templateId: '',
    templateName: '',
    selectedPaper: null,
    issueCount: 1,
    copyCount: 1,
    receiver: {
      name: '',
      phone: '',
      address: ''
    },
    uploadList: [],
    remark: '',
    invoice: null,
    papers: paperConfig.papers,
    // 筛选器 - 省市区合并选择器
    regionArray: [paperConfig.provinces, paperConfig.getCitiesByProvince('全部')],
    regionValue: [0, 0],
    regionText: '全部地区',
    types: paperConfig.types,
    typeIndex: 0,
    filteredPapers: paperConfig.papers,
    publishFee: 0,
    totalPrice: 0
  },

  onLoad(options) {
    // 导航栏高度
    const { statusBarHeight, navHeight } = common.getNavigationHeight();
    this.setData({ statusBarHeight, navHeight });

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

  // 筛选器：省市区多列选择器 - 列变化时更新城市列表
  onRegionColumnChange(e) {
    if (e.detail.column === 0) {
      // 省份变化，更新城市列表
      const province = paperConfig.provinces[e.detail.value];
      const cities = paperConfig.getCitiesByProvince(province);
      // 使用整个数组更新，避免部分更新导致滚动问题
      const newRegionArray = [this.data.regionArray[0], cities];
      this.setData({
        regionArray: newRegionArray
      });
    }
  },

  // 筛选器：省市区多列选择器 - 确定选择
  onRegionChange(e) {
    const value = e.detail.value;
    const province = paperConfig.provinces[value[0]];
    const cities = paperConfig.getCitiesByProvince(province);
    const city = cities[value[1]];
    const type = this.data.types[this.data.typeIndex];
    
    // 优化显示文本：如果城市是"全部"，只显示省份
    let regionText;
    if (city === '全部') {
      regionText = province === '全部' ? '全部地区' : province;
    } else {
      regionText = province + ' · ' + city;
    }
    
    this.setData({
      regionValue: value,
      regionText: regionText,
      filteredPapers: paperConfig.filterPapers(province, city, type)
    });
  },

  // 筛选器：类型选择
  onTypeChange(e) {
    const typeIndex = parseInt(e.detail.value);
    const value = this.data.regionValue;
    const province = paperConfig.provinces[value[0]];
    const cities = paperConfig.getCitiesByProvince(province);
    const city = cities[value[1]];
    const type = this.data.types[typeIndex];
    
    this.setData({
      typeIndex,
      filteredPapers: paperConfig.filterPapers(province, city, type)
    });
  },

  onShow() {
    // 读取已保存的发票信息(invoiceInfo 由发票编辑页写入,持久保留)
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
          charCount: contentData.charCount
        });
        this.calculatePrice();
      }
    }
  },

  onInvoiceTap() {
    wx.navigateTo({
      url: '/pages/invoice/edit/index'
    });
  },

  goBack() {
    wx.navigateBack();
  },

  contactService() {
    wx.makePhoneCall({
      phoneNumber: '4000049919'
    });
  },

  editContent() {
    wx.navigateTo({
      url: '/pages/newspaper/content-edit/index'
    });
  },

  selectPaper(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({ selectedPaper: id });
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

  onReceiverInput(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    this.setData({
      [`receiver.${field}`]: value
    });
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
        // 校验图片大小(限制5MB)
        const validFiles = res.tempFiles.filter(item => {
          if (item.size > 5 * 1024 * 1024) {
            wx.showToast({ title: `图片 ${item.tempFilePath.split('/').pop()} 超过5MB,已跳过`, icon: 'none' });
            return false;
          }
          return true;
        });
        const newUploads = validFiles.map(item => item.tempFilePath);
        that.setData({
          uploadList: that.data.uploadList.concat(newUploads)
        });
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
    this.setData({
      content: content,
      charCount: content.length
    });
    this.calculatePrice();
  },

  onRemarkInput(e) {
    this.setData({ remark: e.detail.value });
  },

  calculatePrice() {
    const selectedPaper = this.data.selectedPaper;
    const paper = this.data.papers.find(function(p) { return p.id === selectedPaper; });
    if (!paper) {
      this.setData({ publishFee: 0, totalPrice: 0 });
      return;
    }

    const charCount = this.data.charCount || 20;
    const baseChars = 20;
    const basePrice = paper.price;
    const pricePerChar = Math.round(paper.price / 10);

    let publishFee = basePrice;
    if (charCount > baseChars) {
      publishFee += (charCount - baseChars) * pricePerChar;
    }

    publishFee = publishFee * this.data.issueCount;

    this.setData({
      publishFee: Math.round(publishFee),
      totalPrice: Math.round(publishFee)
    });
  },

  submitOrder() {
    // 防重复提交
    if (this.data.isSubmitting) {
      wx.showToast({ title: '请求处理中,请稍候', icon: 'none' });
      return;
    }
    this.setData({ isSubmitting: true });

    const that = this;

    // 使用公共验证方法
    if (!that.data.selectedPaper) {
      that.setData({ isSubmitting: false });
      wx.showToast({ title: '请先选择报纸', icon: 'none' });
      return;
    }

    const receiverResult = common.validateReceiver(that.data.receiver);
    if (!receiverResult.valid) {
      that.setData({ isSubmitting: false });
      wx.showToast({ title: receiverResult.msg, icon: 'none' });
      return;
    }

    const paper = that.data.papers.find(p => p.id === that.data.selectedPaper);

    wx.showModal({
      title: '确认支付',
      content: '报纸:' + paper.name + '\n版面费:' + that.data.issueCount + '期\n报纸费:' + that.data.copyCount + '份\n合计:' + that.data.totalPrice,
      success(res) {
        if (res.confirm) {
          wx.showLoading({ title: '提交中..' });
          setTimeout(function() {
            wx.hideLoading();
            // 保存订单到本地存储
            common.saveOrder({
              type: that.data.businessType,
              desc: that.data.content,
              paper: paper.name,
              price: that.data.totalPrice,
              content: that.data.content,
              phone: that.data.receiver.phone,
              name: that.data.receiver.name,
              title: that.data.businessType + '登报',
              invoice: that.data.invoice || null
            });
            wx.showToast({ title: '提交成功', icon: 'success' });
            that.setData({ isSubmitting: false });
            setTimeout(function() {
              wx.navigateTo({ url: '/pages/newspaper/order' });
            }, 1500);
          }, 1000);
        } else {
          that.setData({ isSubmitting: false });
        }
      }
    });
  }
});
