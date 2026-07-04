const common = require('../../../utils/common.js');
const smartReplaceUtil = require('../../../utils/smart-replace.js');

Page({
  data: {
    statusBarHeight: 20,
    navHeight: 64,
    businessType: '个人证件',
    templateName: '',
    content: '',
    originalContent: '',
    charCount: 0,
    maxChars: 2000,
    showPreview: false
  },

  onLoad() {
    const { statusBarHeight, navHeight } = common.getNavigationHeight();
    this.setData({ statusBarHeight, navHeight });

    const templateData = wx.getStorageSync('newspaperTemplate') || {};
    if (templateData.content) {
      this.setData({
        businessType: templateData.businessType || '个人证件',
        templateName: templateData.name || templateData.templateName || '',
        content: templateData.content,
        originalContent: templateData.content,
        charCount: templateData.content.length
      });
    }

    const navData = wx.getStorageSync('formPageNavData') || {};
    if (navData.categoryName) {
      this.setData({ businessType: navData.categoryName, templateName: navData.itemName || '' });
    }
  },

  onEditorReady() {
    wx.createSelectorQuery().in(this).select('#contentEditor').context((res) => {
      if (res && res.context) {
        this.editorCtx = res.context;
        this._editorReady = true;
        if (this.data.content) {
          this.editorCtx.setContents({
            html: this._plainToHtml(this.data.content)
          });
        }
      }
    }).exec();
  },

  onEditorInput(e) {
    const text = e.detail.text;
    const charCount = text.length;
    this.setData({ 
      content: text, 
      charCount: charCount,
      isNearLimit: charCount > 1800
    });
  },

  // ... 其他函数省略
});
