const common = require('../../../utils/common.js');

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

  onInput(e) {
    const content = e.detail.value;
    this.setData({
      content: content,
      charCount: content.length
    });
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

  // 一键替换占位符
  quickReplace() {
    wx.showModal({
      title: '一键替换',
      content: '请输入您的真实姓名',
      editable: true,
      placeholderText: '例如：张三',
      success: (res) => {
        if (res.confirm && res.content && res.content.trim()) {
          const name = res.content.trim();
          const currentDate = new Date();
          const year = currentDate.getFullYear();
          const month = String(currentDate.getMonth() + 1).padStart(2, '0');
          const day = String(currentDate.getDate()).padStart(2, '0');
          const dateStr = `${year}年${month}月${day}日`;

          let newContent = this.data.content;

          // 1. 日期占位符 → 自动填当天日期
          newContent = newContent.replace(/XXXX年XX月XX日/g, dateStr);

          // 2. 长串 X 正文占位符（15+ 连续X）→ 替换为下划线提示
          newContent = newContent.replace(/X{15,}/g, '________________');

          // 3. 姓名类独立行（声明人/致歉人/联系人等）→ 替换为输入的姓名
          const nameFields = [
            '声明人', '致歉人', '联系人', '法定代表人', '债权申报联系人'
          ];
          nameFields.forEach(field => {
            const regex = new RegExp(`^${field}：XXX$`, 'gm');
            newContent = newContent.replace(regex, `${field}：${name}`);
          });

          // 4. XXXX公司 → 替换为（公司名称）公司
          newContent = newContent.replace(/XXXX公司/g, '（公司名称）公司');
          // 5. 其余 XXXX → 替换为下划线提示用户自行填写
          newContent = newContent.replace(/XXXX/g, '____');
          // 6. 其余 XXX（零散占位符）→ 替换为下划线
          newContent = newContent.replace(/XXX/g, '___');

          this.setData({
            content: newContent,
            charCount: newContent.length
          });

          // 检测剩余未处理字段
          const phoneCount = (newContent.match(/联系电话：____/g) || []).length;
          const addrCount = (newContent.match(/联系地址：____/g) || []).length;
          const contentPlaceholder = (newContent.match(/________________/g) || []).length;
          const otherX = (newContent.match(/____(?!年)/g) || []).length;
          const remaining = [];
          if (phoneCount > 0) remaining.push(`联系电话（${phoneCount}处）`);
          if (addrCount > 0) remaining.push(`联系地址（${addrCount}处）`);
          if (contentPlaceholder > 0) remaining.push(`正文内容（${contentPlaceholder}处）`);
          if (otherX > 0) remaining.push(`其他占位符（${otherX}处）`);

          if (remaining.length > 0) {
            wx.showModal({
              title: '部分字段需手动填写',
              content: `以下字段需要您手动填写：${remaining.join('、')}，其余占位符已替换为下划线`,
              showCancel: false,
              confirmText: '知道了'
            });
          } else {
            wx.showToast({ title: '全部替换成功', icon: 'success' });
          }
        } else if (res.confirm && !res.content?.trim()) {
          wx.showToast({ title: '请输入姓名', icon: 'none' });
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
