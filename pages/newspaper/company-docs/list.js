// pages/newspaper/company-docs/list.js
const common = require('../../../utils/common.js');
const companyDocsConfig = require('../../../utils/company-docs.js');

Page({
  data: {
    statusBarHeight: 20,
    navHeight: 64,
    categoryId: 0,
    categoryName: '',
    docs: [],
    filteredDocs: [],
    searchKey: ''
  },

  onLoad(options) {
    // 计算导航栏高度
    const { statusBarHeight, navHeight } = common.getNavigationHeight();
    this.setData({ statusBarHeight, navHeight });

    const categoryId = parseInt(options.categoryId);
    // 从 Storage 读取中文参数，避免 URL 编码问题
    const navData = wx.getStorageSync('companyDocsNavData') || {};
    const categoryName = navData.categoryName || '';
    if (navData._timestamp) wx.removeStorageSync('companyDocsNavData');
    const category = companyDocsConfig.getCategoryById(categoryId);

    if (category) {
      this.setData({
        categoryId: category.id,
        categoryName: category.name,
        categoryColor: category.color || '#5B6FE8',
        docs: category.docs,
        filteredDocs: category.docs
      });
    }
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 });
    }
  },

  goBack() {
    wx.navigateBack();
  },

  onSearch(e) {
    const searchKey = e.detail.value.trim();
    this.setData({ searchKey });

    if (!searchKey) {
      this.setData({ filteredDocs: this.data.docs });
      return;
    }

    // 过滤匹配的证件（按名称搜索）
    const filtered = this.data.docs.filter(doc =>
      doc.name && doc.name.includes(searchKey)
    );
    this.setData({ filteredDocs: filtered });
  },

  clearSearch() {
    this.setData({
      searchKey: '',
      filteredDocs: this.data.docs
    });
  },

  selectDoc(e) {
    const doc = e.currentTarget.dataset.doc;
    const docName = doc.name || doc;
    // 生成模板内容，保存到 Storage，供 content-edit 读取
    wx.setStorageSync('newspaperTemplate', {
      name: docName,
      content: companyDocsConfig.generateContent(docName, this.data.categoryName),
      businessType: '企业证件',
      _timestamp: Date.now()
    });
    // 通过 Storage 传递中文参数，避免 URL 编码问题
    wx.setStorageSync('formPageNavData', { type: '企业证件', docName, categoryName: this.data.categoryName, itemName: docName, _timestamp: Date.now() });
    wx.navigateTo({
      url: '/pages/newspaper/content-edit/index'
    });
  }
});
