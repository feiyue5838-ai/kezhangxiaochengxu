const common = require('../../../utils/common.js');
let _smartReplaceTimer = null;

Page({
  data: {
    statusBarHeight: 20,
    navHeight: 64,
    businessType: '个人证件',
    templateName: '',
    content: '',
    originalContent: '',
    charCount: 0
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
      }, () => {
        this._syncInnerHtml(this.data.content);
      });
    }

    const navData = wx.getStorageSync('formPageNavData') || {};
    if (navData.categoryName) {
      this.setData({ businessType: navData.categoryName, templateName: navData.itemName || '' });
    }
  },

  // 输入时：捕获纯文本 → 更新 data → 同步 innerHTML
  onInput(e) {
    const raw = e.detail.value || '';
    this.setData({ content: raw, charCount: raw.length });
    this._syncInnerHtml(raw);
  },

  // 一键替换占位符 → 标红
  quickReplace() {
    const replaced = this.smartReplace(this.data.content);
    this.setData({ content: replaced, charCount: replaced.length }, () => {
      this._syncInnerHtml(replaced);
    });
    wx.showToast({ title: '已替换占位符', icon: 'none', duration: 2000 });
  },

  // 同步纯文本 → innerHTML（提示文字标红）
  _syncInnerHtml(text) {
    if (!text) return;
    const html = this._plainToHtml(text);
    wx.createSelectorQuery().in(this)
      .select('#editorInner')
      .evalAddr('setAttribute', 'innerHTML', html)
      .exec();
  },

  // 纯文本 → HTML（提示文字标红）
  _plainToHtml(text) {
    const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
    const hintRe = /（示例：[^）]{1,40}）|（请填写[^）]{0,30}）/g;
    let out = '';
    let last = 0;
    let m;
    hintRe.lastIndex = 0;
    while ((m = hintRe.exec(text)) !== null) {
      out += esc(text.slice(last, m.index));
      out += `<span style="color:#F5222D;font-weight:bold;">${m[0]}</span>`;
      last = m.index + m[0].length;
    }
    out += esc(text.slice(last));
    return out;
  },

  // 判断内容是否已修改（不再是原始模板）

  // 智能替换占位符（手动触发，统一替换一次）
  smartReplace(content) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const dateStr = `${year}年${month}月${day}日`;

    let result = content;

    // 1. 日期占位符 → 自动填当天日期
    result = result.replace(/XXXX年XX月XX日/g, dateStr);

    // 2. 姓名类字段（label: XXX）→ 示例格式
    //    先做标签特定替换，避免 /XXX(?!\d)/ 吃掉 "本人XXX" 中的 XXX
    ['声明人', '致歉人', '联系人', '法定代表人', '债权申报联系人'].forEach(field => {
      result = result.replace(new RegExp(`${field}：XXX`, 'g'), `${field}：（示例：张三）`);
    });

    // 3. 通用 XXXX（4个X，不是数字序列）→ 格式示例
    //    先于"XXXX公司"处理，避免残留 XXX 被第4步误吞
    result = result.replace(/XXXX(?!\d)/g, '（示例：138****5678）');

    // 4. XXXX公司 → 格式示例（XXXX已被第3步处理过，此处兜底）
    //    匹配"XXXX公司"后紧跟字母/数字（公司名首字），捕获组保留公司后缀
    result = result.replace(/XXXX公司(\w)?/g, function(match, suffix) {
      return '（示例：XX公司' + (suffix || '') + '）';
    });

    // 5. 通用 XXX（3个X，不是数字序列）→ 格式示例
    result = result.replace(/XXX(?!\d)/g, '（示例：110101199001011234）');

    // 6. 长串 X（15+ 连续X）→ 兜底提示
    result = result.replace(/X{15,}/g, '（请填写完整信息）');

    return result;
  },

  // 输入时实时解析提示文字（字数更新 + 预览同步）
  onInput(e) {
    const raw = e.detail.value || '';
    this.setData({ content: raw, charCount: raw.length });
    // 预览已打开时同步更新
    if (this.data.showHintPreview) {
      this.setData({ hintHtml: this._parseHintsToHtml(raw) });
    }
  },

  // 一键替换占位符，自动打开红色预览
  quickReplace() {
    const content = this.data.content;
    const replaced = this.smartReplace(content);
    const html = this._parseHintsToHtml(replaced);
    this.setData({ content: replaced, charCount: replaced.length, showHintPreview: true, hintHtml: html });
    wx.showToast({ title: '已替换占位符', icon: 'none', duration: 2000 });
  },

  // 切换预览区开关
  toggleHintPreview() {
    const next = !this.data.showHintPreview;
    this.setData({
      showHintPreview: next,
      hintHtml: next ? this._parseHintsToHtml(this.data.content) : ''
    });
  },

  // 核心：将纯文本内容解析为带红色提示的 HTML
  // 提示格式：（示例：xxx）或 （请填写xxx）
  _parseHintsToHtml(text) {
    if (!text) return '';
    // HTML 转义（防注入）
    const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    // 替换函数：提示文字标红
    const paint = m => `<span style="color:#F5222D;font-weight:bold;">${esc(m)}</span>`;
    // 匹配所有提示格式
    const hintPattern = /（示例：[^）]{1,40}）|（请填写[^）]{0,30}）/g;
    // 先按行处理，保留换行结构
    const lines = text.split('\n');
    const htmlLines = lines.map(line => {
      let html = esc(line);
      // 将提示文字标红（逐个匹配替换）
      let result = '';
      let last = 0;
      let match;
      hintPattern.lastIndex = 0;
      while ((match = hintPattern.exec(html)) !== null) {
        result += esc(html.slice(last, match.index)) + paint(match[0]);
        last = match.index + match[0].length;
      }
      result += esc(html.slice(last));
      return result;
    });
    // rich-text 用 <p> 标签包裹每行
    const body = htmlLines.map(l => `<p style="margin:0;word-break:break-all;font-size:28rpx;color:#1A2332;line-height:1.8;">${l}</p>`).join('');
    return `<div style="padding:8rpx 0;">${body}</div>`;
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
    this.setData({ showPreview: true });
  },

  // 关闭预览
  closePreview() {
    this.setData({ showPreview: false });
  },

  // 选报纸
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
