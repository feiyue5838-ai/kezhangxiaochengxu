const common = require('../../../utils/common.js');
const smartReplaceUtil = require('../../../utils/smart-replace.js');
let _smartReplaceTimer = null;

Page({
  data: {
    businessType: '个人证件',
    templateName: '',
    content: '',
    originalContent: '',
    charCount: 0
  },

  onLoad() {
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
    const query = wx.createSelectorQuery().in(this);
    query.select('#contentEditor').context((res) => {
      if (res && res.context) {
        this.editorCtx = res.context;
        this._editorReady = true;
        if (this.data.content) {
          // 转HTML并标红占位符
          const html = this._plainToHtml(this.data.content);
          this.editorCtx.setContents({ html: html });
        }
      }
    }).exec();
  },

  onEditorInput(e) {
    const content = e.detail.text || '';
    const charCount = content.length;
    this.setData({ content, charCount });
    
    // 字数接近限制时提醒
    if (charCount > 1800 && charCount <= 2000) {
      wx.showToast({ title: '已输入' + charCount + '字，接近2000字限制', icon: 'none' });
    } else if (charCount > 2000) {
      wx.showToast({ title: '已超过2000字限制，请删减内容', icon: 'none' });
    }
  },

  onEditorBlur() {
    if (this.editorCtx) {
      this.editorCtx.getContents({
        success: (res) => {
          const text = res.text || '';
          if (text !== this.data.content) {
            this.setData({ content: text, charCount: text.length });
          }
        }
      });
    }
  },

  quickReplace() {
    if (!this.editorCtx || !this._editorReady) return;
    const doReplace = (rawText) => {
      if (!rawText) rawText = this.data.originalContent;
      const replaced = smartReplaceUtil.doSmartReplace(rawText, this.data.businessType);
      this.editorCtx.setContents({ 
        html: this._plainToHtml(replaced),
        success: () => {
          // 替换后滚动到顶部
          setTimeout(() => {
            this.editorCtx.scrollIntoView({ selector: 'p' });
          }, 100);
        }
      });
      this.setData({ content: replaced, charCount: replaced.length });
      wx.showToast({ title: '占位符已替换', icon: 'success' });
    };
    if (this.editorCtx && this._editorReady) {
      this.editorCtx.getContents({ success: (res) => doReplace(res.text) });
    }
  },

  _plainToHtml(text) {
    if (!text) return '';
    const lines = text.split('\n');
    const htmlLines = lines.map(line => {
      let escaped = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      // 优化提示样式：红色+加粗+浅红背景（支持中英文括号）
      const hintRe = /（示例：.*?）|（请填写.*?）|（日期：.*?）|\(示例：.*?\)|\(请填写.*?\)|\(日期：.*?\)/g;
      let m;
      while ((m = hintRe.exec(line)) !== null) {
        const hint = m[0];
        const styledHint = '<span style="color:#E34D59;font-weight:bold;background:#FFF1F0;padding:2rpx 6rpx;border-radius:4rpx;">' + hint + '</span>';
        escaped = escaped.replace(hint, styledHint);
      }
      return '<p>' + (escaped || '<br>') + '</p>';
    });
    return htmlLines.join('');
  },

  smartReplace(content) {
    return smartReplaceUtil.doSmartReplace(content, this.data.businessType);
  },

  isContentModified() {
    const { content, originalContent } = this.data;
    return content.trim() !== '' && content !== originalContent;
  },

  goBack() {
    wx.navigateBack();
  },

  resetContent() {
    wx.showModal({
      title: '重置确认',
      content: '确定要恢复为原始模板内容吗？',
      success: (res) => {
        if (res.confirm) {
          const html = this._plainToHtml(this.data.originalContent);
          this.setData({
            content: this.data.originalContent,
            charCount: this.data.originalContent.length
          });
          if (this.editorCtx && this._editorReady) {
            this.editorCtx.setContents({ html: html });
          }
          wx.showToast({ title: '已重置', icon: 'success' });
        }
      }
    });
  },

  clearContent() {
    wx.showModal({
      title: '清空确认',
      content: '确定要清空所有内容吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({ content: '', charCount: 0 });
          if (this.editorCtx && this._editorReady) {
            this.editorCtx.setContents({ html: '' });
          }
          wx.showToast({ title: '已清空', icon: 'success' });
        }
      }
    });
  },

  previewContent() {
    if (!this.data.content.trim()) {
      wx.showToast({ title: '请先填写内容', icon: 'none' });
      return;
    }
    this.setData({ showPreview: true });
  },

  closePreview() {
    this.setData({ showPreview: false });
  },

  selectPaper() {
    const { content, originalContent } = this.data;
    if (!content.trim() || content === originalContent) {
      wx.showToast({ title: '请先补充登报内容', icon: 'none' });
      return;
    }
    wx.setStorageSync('newspaperContent', {
      content: this.data.content,
      charCount: this.data.charCount,
      businessType: this.data.businessType,
      templateName: this.data.templateName,
      _timestamp: Date.now()
    });
    wx.navigateTo({
      url: "/pages/newspaper/form/index"
    });
  }
});
