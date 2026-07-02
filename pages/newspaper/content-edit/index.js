const common = require('../../../utils/common.js');
let _smartReplaceTimer = null;

Page({
  data: {
    statusBarHeight: 20,
    navHeight: 64,
    businessType: '个人证件',
    templateName: '',
    content: '',
    originalContent: '', // 保存原始模板，用于重置
    charCount: 0
  },

  onLoad() {
    const { statusBarHeight, navHeight } = common.getNavigationHeight();
    this.setData({ statusBarHeight, navHeight });

    // 从 Storage 读取模板数据
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

    // 从个人/企业证件页传来的数据
    const navData = wx.getStorageSync('formPageNavData') || {};
    if (navData.categoryName) {
      this.setData({
        businessType: navData.categoryName,
        templateName: navData.itemName || ''
      });
    }
  },

  // 智能替换占位符（无弹窗，自动对齐）
  smartReplace(content) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const dateStr = `${year}年${month}月${day}日`;

    let result = content;

    // 1. 日期占位符 → 自动填当天日期
    result = result.replace(/XXXX年XX月XX日/g, dateStr);
    // 2. 长串 X（15+ 连续X）→ 替换为下划线
    result = result.replace(/X{15,}/g, '________________');
    // 3. 姓名类独立行（声明人/致歉人/联系人/法人等）→ 对齐下划线
    ['声明人', '致歉人', '联系人', '法定代表人', '债权申报联系人'].forEach(field => {
      result = result.replace(new RegExp(`^${field}：XXX$`, 'gm'), `${field}：____`);
    });
    // 4. XXXX公司 → （公司名称）公司
    result = result.replace(/XXXX公司/g, '（公司名称）公司');
    // 5. XXXX → 下划线（4个）
    result = result.replace(/XXXX(?!\d)/g, '____');
    // 6. XXX → 下划线（3个）
    result = result.replace(/XXX(?!\d)/g, '___');

    return result;
  },

  // 输入时自动检测并替换占位符（500ms 防抖）
  onInput(e) {
    const content = e.detail.value;
    this.setData({ charCount: content.length });

    // 防抖：用户停 500ms 再执行替换
    if (_smartReplaceTimer) clearTimeout(_smartReplaceTimer);
    _smartReplaceTimer = setTimeout(() => {
      const replaced = this.smartReplace(content);
      if (replaced !== content) {
        this.setData({ content: replaced });
      } else {
        this.setData({ content });
      }
    }, 500);
  },

  // 一键替换（手动触发，统一替换一次）
  quickReplace() {
    const content = this.data.content;
    const replaced = this.smartReplace(content);
    this.setData({ content: replaced, charCount: replaced.length });
    wx.showToast({ title: '已替换，下划线处需手动填写', icon: 'none', duration: 2000 });
  },

  // 判断内容是否已修改（不再是原始模板）
  isContentModified() {
    const { content, originalContent } = this.data;
    return content.trim() !== '' && content !== originalContent;
  },

  goBack() {
    wx.navigateBack();
  },

  // 重置为初始模板
  resetContent() {
    wx.showModal({
      title: '确认重置',
      content: '确定要恢复为初始模板内容吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            content: this.data.originalContent,
            charCount: this.data.originalContent.length
          });
          wx.showToast({ title: '已重置', icon: 'success' });
        }
      }
    });
  },

  // 清空所有内容
  clearContent() {
    wx.showModal({
      title: '确认清除',
      content: '确定要清空所有内容吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            content: '',
            charCount: 0
          });
          wx.showToast({ title: '已清除', icon: 'success' });
        }
      }
    });
  },

  // 预览登报内容
  previewContent() {
    if (!this.data.content.trim()) {
      wx.showToast({ title: '请先输入登报内容', icon: 'none' });
      return;
    }

    // 保存内容到 Storage
    wx.setStorageSync('newspaperContent', {
      content: this.data.content,
      charCount: this.data.charCount,
      businessType: this.data.businessType,
      templateName: this.data.templateName,
      _timestamp: Date.now()
    });

    // 预览功能暂未接入，先保存内容
    wx.showToast({ title: '内容已保存，可直接选报纸', icon: 'none' });
  },

  // 选择报纸
  selectPaper() {
    const { content, originalContent } = this.data;
    if (!content.trim() || content === originalContent) {
      wx.showToast({ title: '请先补充登报内容', icon: 'none' });
      return;
    }

    // 保存内容到 Storage
    wx.setStorageSync('newspaperContent', {
      content: this.data.content,
      charCount: this.data.charCount,
      businessType: this.data.businessType,
      templateName: this.data.templateName,
      _timestamp: Date.now()
    });

    // 跳转到完整订单表单页面（包含选报纸、数量、收件信息等）
    // 使用 navigateTo 而不是 redirectTo，允许用户返回修改内容
    wx.navigateTo({
      url: '/pages/newspaper/form'
    });
  }
});
