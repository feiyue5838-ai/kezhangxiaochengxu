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
      });
    }

    const navData = wx.getStorageSync('formPageNavData') || {};
    if (navData.categoryName) {
      this.setData({ businessType: navData.categoryName, templateName: navData.itemName || '' });
    }
  },

  // editor 初始化（onLoad 同步设置 data.content，这里直接用 HTML 格式写入）
  onEditorReady() {
    wx.createSelectorQuery().in(this).select('#contentEditor').context((res) => {
      this.editorCtx = res.context;
      // 首次就绪：用 HTML 格式写入，Quill 能正确渲染 color 属性
      if (this.data.content) {
        this.editorCtx.setContents({
          html: this._plainToHtml(this.data.content),
          success: () => { this._editorReady = true; },
          fail: (err) => { console.error('[onEditorReady] setContents fail:', err); this._editorReady = true; }
        });
      } else {
        this._editorReady = true;
      }
    }).exec();
  },

  // editor 输入事件
  onEditorInput(e) {
    const text = (e.detail && e.detail.text) || '';
    this.setData({ content: text, charCount: text.length });
  },

  onEditorBlur() {
    // 失焦时同步最新纯文本（避免某些版本 bindinput 不返回 text）
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

  // 一键替换占位符 → 用 HTML 格式写入 editor，提示文字标红
  quickReplace() {
    const doReplace = (rawText) => {
      const replaced = this.smartReplace(rawText);
      this.setData({ content: replaced, charCount: replaced.length });
      if (!this.editorCtx) return;
      this.editorCtx.setContents({
        html: this._plainToHtml(replaced),
        success: () => { wx.showToast({ title: '已替换占位符', icon: 'none', duration: 2000 }); },
        fail: (err) => { console.error('[quickReplace] setContents fail:', err); wx.showToast({ title: '替换失败', icon: 'none', duration: 2000 }); }
      });
    };

    if (this.editorCtx && this._editorReady) {
      this.editorCtx.getContents({
        success: (res) => { doReplace((res && res.text) || this.data.content || ''); },
        fail: () => { doReplace(this.data.content || ''); }
      });
    } else {
      doReplace(this.data.content || '');
    }
  },

  // 纯文本 → HTML（提示文字用 <span style> 标红，兼容性最好）
  _plainToHtml(text) {
    if (!text) return '<p><br></p>';
    const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const hintRe = /（示例：[^）]{1,40}）|（请填写[^）]{0,30}）|（请填写相关内容）/g;
    const lines = text.split('\n');
    const htmlLines = lines.map(line => {
      let out = '';
      let last = 0;
      let m;
      hintRe.lastIndex = 0;
      while ((m = hintRe.exec(line)) !== null) {
        out += esc(line.slice(last, m.index));
        out += `<span style="color:#F5222D;font-weight:bold;">${esc(m[0])}</span>`;
        last = m.index + m[0].length;
      }
      out += esc(line.slice(last));
      return `<p>${out || '<br>'}</p>`;
    });
    return htmlLines.join('');
  },

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

    // 2. 【关键】统一社会信用代码（必在一切XXX/XXXX子串匹配之前，防止被序号截胡）
    result = result.replace(/统一社会信用代码：X{8,}/g, '统一社会信用代码：（示例：91XXXXXXXXXX）');

    // 3. 【关键】"本人XXX" → 姓名示例（必须在通用XXX之前，防止"本人"后的XXX被替换成身份证号）
    result = result.replace(/本人XXX/g, '本人（示例：张三）');

    // 3. 【关键】"声明单位：XXX有限公司" → 只替换中间的 XXX，保留 "有限公司" 原样
    result = result.replace(/声明单位：XXX有限公司/g, function() {
      return '声明单位：XX有限公司'.replace('XX', '（示例：XX）');
    });

    // 4. 姓名类标签字段（label: XXX）→ 姓名示例
    ['声明人', '致歉人', '联系人', '法定代表人', '债权申报联系人', '申请人', '被申请人', '当事人', '负责人', '声明人（单位）', '新郎', '新娘', '学生', '学子', '祝福人', '祝福你的人', '永远的朋友', '家人', '家长', '出借人', '借款人', '股东', '权利人'].forEach(field => {
      result = result.replace(new RegExp(`${field}：XXX`, 'g'), `${field}：（示例：张三）`);
    });

    // 4.1 XXX + 空格 + 称呼 → 姓名示例（真情告白模块大量使用）
    result = result.replace(/XXX（[^）]*）/g, '（示例：张三）');
    result = result.replace(/XXX (?=先生|女士|老师|小姐|公子|寿星|喜结连理)/g, '张三 ');

    // 4.2 常见情感类句式前缀 → 姓名示例
    result = result.replace(/致我最好的朋友 XXX/g, '致我最好的朋友 张三');
    result = result.replace(/(亲爱的|敬爱的) XXX/g, '$1 张三');
    result = result.replace(/致 XXX/g, '致 张三');
    result = result.replace(/致我亲爱的宝宝 XXX/g, '致我亲爱的宝宝 张三');
    result = result.replace(/永远爱你的：XXX/g, '永远爱你的：（示例：张三）');

    // 4.3 英文标签 → 姓名示例
    result = result.replace(/TO: XXX/g, 'TO: 张三');
    result = result.replace(/FROM: XXX/g, 'FROM: 张三');

    // 4.4 中文带修饰语 → 姓名示例
    result = result.replace(/您的孩子：XXX/g, '您的孩子：（示例：张三）');

    // 4.5 链式 XXX（多个空格分隔的 XXX 链 → 姓名链，如 家人：XXX  XXX  XXX）
    result = result.replace(/XXX  XXX(\s*XXX)*/g, function(m) {
      return m.replace(/XXX/g, '（示例：张三）');
    });

    // 4.6 【必须先于 4.7】长串号码字段（10+ X）→ 兜底
    //    在 4.7 之前运行，防止 证号/编号 子串匹配截胡许可证号等复合字段
    ['身份证号', '注册号', '执业证号', '许可证编号', '许可证号', '保单号', '机构编码', '账号'].forEach(field => {
      result = result.replace(new RegExp(`${field}：X{8,}`, 'g'), `${field}：（请填写完整信息）`);
    });

    // 4.7 票据/证件/信用代码字段 → 号码示例（在通用XXX之前，避免被身份证号替换）
    ['票据号码', '证号', '编号', '权证编号', '证书编号', '设备编号', '证件编号', '合同编号', '备案/登记编号', '许可证号/证书号', '证件号码', '统一社会信用代码'].forEach(field => {
      result = result.replace(new RegExp(`${field}：XXX`, 'g'), `${field}：（示例：12345678）`);
      result = result.replace(new RegExp(`${field}：XXXX`, 'g'), `${field}：（示例：91XXXXXXXXXX）`);
    });

    // 4.8 公告/通知类特有字段 → 具体示例
    result = result.replace(/公告单位：XXX/g, '公告单位：（示例：XX有限公司）');
    result = result.replace(/通知人：XXX/g, '通知人：（示例：张三）');
    result = result.replace(/致：XXX/g, '致：（示例：张三）');
    result = result.replace(/联系地址：XXXX/g, '联系地址：（示例：XX市XX区XX路XX号）');

    // ════════════════════════════════
    // 4.9 法院/法律特有格式（在通用XXXX/XXX之前）
    // ════════════════════════════════

    // 【案号年份】（XXXX）→ 示例年份（覆盖 XX民初、民借仲、其他所有法院案号格式）
    result = result.replace(/（XXXX）/g, '（（示例：2026））');
    // 【案号年份】〔XXXX〕→ 示例年份（如 X市监罚告字〔2026〕XX号）
    result = result.replace(/〔XXXX〕/g, '〔2026〕');
    // 【案号尾号】XXX号 → 示例案号（仅限法院案号上下文，如 民初XXX号）
    result = result.replace(/([民刑]初)XXX号/g, '$1（示例：1234）号');

    // 【电话】XXXX-XXXXXXXX → 整体电话示例（防止被拆成多个电话号）
    result = result.replace(/XXXX-XXXXXXXX/g, '（示例：0755-12345678）');

    // 【公司名】XXXX有限公司 → 公司名称示例（在通用XXXX之前）
    result = result.replace(/XXXX有限公司/g, '（示例：XX公司）有限公司');
    // 【公司名】XXX保险公司 / XXX物业/ XXX管理 等特殊后缀
    result = result.replace(/XXX保险公司/g, '（示例：XX保险公司）');
    result = result.replace(/XXX物业管理有限公司/g, '（示例：XX物业管理有限公司）');

    // 4.10 无冒号的角色标签 + XXX（法院模板大量使用：被告XXX、债权人XXX等）
    //    这些没有被 4.1（XXX（...））捕获时，不能落到通用身份证号替换
    //    注：申请人/被申请人 有冒号在 step4 已处理，但无冒号时也须覆盖
    ['被告', '债务人', '借款人', '出借人', '被执行人', '被征收人', '失踪人', '担保人', '债权人', '遗赠人', '受遗赠人', '抚养人', '收养人', '申请人', '被申请人', '声明人', '当事人', '通知人', '公告人', '被保险人', '主要负责人', '权利人', '股东'].forEach(role => {
    //    这些没有被 4.1（XXX（...））捕获时，不能落到通用身份证号替换
    //    注：申请人/被申请人 有冒号在 step4 已处理，但无冒号时也须覆盖
    ['被告', '债务人', '借款人', '出借人', '被执行人', '被征收人', '失踪人', '担保人', '债权人', '遗赠人', '受遗赠人', '抚养人', '收养人', '申请人', '被申请人', '声明人', '当事人', '通知人', '公告人', '被保险人', '主要负责人', '权利人', '股东'].forEach(role => {
      result = result.replace(new RegExp(role + 'XXX(?!（)', 'g'), role + '（示例：张三）');
    });
    // XXX诉 → 姓名示例（如 已受理XXX诉你仲裁一案）
    result = result.replace(/XXX诉/g, '（示例：张三）诉');

    // ════════════════════════════════
    // 4.14 政府送达/行政模板特有格式
    // ════════════════════════════════

    // 句中角色名（XXX与/就XXX）：被 4.13 捕获后剩余的句中姓名
    result = result.replace(/XXX与/g, '（示例：张三）与');
    result = result.replace(/就XXX/g, '就（示例：XX）');

    // 内容描述型占位符（不可能是身份证号）
    result = result.replace(/XXX罪/g, '（示例：XX罪）');
    result = result.replace(/XXX事项/g, '（示例：XX事项）');
    result = result.replace(/XXX情形/g, '（示例：XX情形）');
    result = result.replace(/XXX争议/g, '（示例：XX争议）');
    result = result.replace(/XXX内容/g, '（示例：XX内容）');
    result = result.replace(/XXX名称/g, '（示例：XX名称）');
    result = result.replace(/XXX概要/g, '（示例：XX概要）');
    result = result.replace(/案由：XXX/g, '案由：（示例：XX纠纷）');

    // 规划条件内容占位符
    result = result.replace(/原规划条件：XXX/g, '原规划条件：（示例：XX）');
    result = result.replace(/变更后规划条件：XXX/g, '变更后规划条件：（示例：XX）');

    // 地址字段（和电话字段分开，避免地址：XXXX 被替换为电话号）
    result = result.replace(/地址：XXXX/g, '地址：（示例：XX市XX区XX路XX号）');

    // 户名账号（银行信息）
    result = result.replace(/户名：XXXX/g, '户名：（示例：XX银行）');
    result = result.replace(/账号：X{8,20}/g, '账号：（示例：6222****1234）');

    // 无括号的案号年份：XXXX劳人仲 / XXXX合同仲 / XXXX民仲
    result = result.replace(/XXXX(劳人仲|合同仲|民仲)/g, '（示例：2026）$1');
    // 6-8位X + 字第（如 XXXXXX字第XX号）
    result = result.replace(/X{4,8}字第/g, '（示例：2026）字第');

    // ════════════════════════════════
    // 4.15 法院特有专业名词
    // ════════════════════════════════

    // 专业机构/企业后缀
    result = result.replace(/XXX律师事务所/g, '（示例：XX律师事务所）');
    result = result.replace(/XXX律师/g, '（示例：XX律师）');
    result = result.replace(/XXX证券期货有限公司/g, '（示例：XX证券期货有限公司）');
    result = result.replace(/XXX出版社/g, '（示例：XX出版社）');

    // 车牌/车辆相关
    result = result.replace(/车牌号：X{6,8}/g, '车牌号：（示例：粤B12345）');

    // 票据票号（8位X）
    result = result.replace(/票号：X{6,10}/g, '票号：（示例：12345678）');
    result = result.replace(/存放编号：X{8,}/g, '存放编号：（示例：12345678）');
    result = result.replace(/机构名称：XXX/g, '机构名称：（示例：XX证券）');
    result = result.replace(/XXX单位/g, '（示例：XX单位）');
    result = result.replace(/XXX项目/g, '（示例：XX项目）');
    result = result.replace(/随身携带物品：XXX/g, '随身携带物品：（示例：XX）');
    result = result.replace(/《XXXX》/g, '《（示例：XXXX）》');
    result = result.replace(/XXX事项/g, '（示例：XX事项）');
    result = result.replace(/XXX内容/g, '（示例：XX内容）');
    result = result.replace(/XXX系列/g, '（示例：XX系列）');

    // 书籍/出版相关
    result = result.replace(/ISBN：X{13,}/g, 'ISBN：（示例：978-7-XXXX-XXXX-X）');

    // 地址中的占位符（XXX路XXX号XXX室 → 不落身份证号）
    result = result.replace(/XXX路/g, '（示例：XX）路');
    result = result.replace(/XXX号/g, '（示例：XX）号');
    result = result.replace(/XXX室/g, '（示例：XX）室');
    result = result.replace(/XXX平方米/g, '（示例：XX）平方米');

    // 内容描述型（法院专用）
    result = result.replace(/提存原因：XXX/g, '提存原因：（示例：XX）');
    result = result.replace(/车型：XXX/g, '车型：（示例：XX牌XX型）');
    result = result.replace(/身高：XXXcm/g, '身高：（示例：170）cm');
    result = result.replace(/体貌特征：XXX/g, '体貌特征：（示例：XX）');
    result = result.replace(/(起火|死亡)原因为XXX/g, '$1原因为（示例：XX）');
    result = result.replace(/授权范围：XXX/g, '授权范围：（示例：XX）');
    result = result.replace(/办理XXX案件/g, '办理（示例：XX）案件');

    // 5. XXX公司（3个X+公司）→ 公司名示例（在通用XXX之前，避免被身份证号替换）
    result = result.replace(/XXX公司(?!\d)/g, '（示例：XX公司）');

    // 6. XXXX公司 → 完整公司名示例
    //    策略：把"XXXX公司"替换成"（示例：XX公司"，然后把后续"有限公司"等后缀包进括号
    result = result.replace(/XXXX公司/g, '（示例：XX公司');
    //    把孤立的"有限公司）"补全为"有限公司））"（闭合两处括号）
    result = result.replace(/（示例：XX公司有限公司/g, '（示例：XX公司）有限公司');
    //    把孤立的"集团）"等后缀补全
    result = result.replace(/（示例：XX公司集团/g, '（示例：XX集团）');

    // 7. 【重要】长串 X（15+ 连续X）→ 兜底提示（必须在XXXX/XXX之前，防止长串被拆成电话/身份证示例）
    result = result.replace(/X{15,}/g, '（请填写完整信息）');

    // 8. 通用 XXXX（4个X，不是数字/日期的闭合括号）→ 电话示例
    result = result.replace(/XXXX(?!\d)/g, '（示例：138****5678）');

    // 9. 通用 XXX（3个X，不是数字序列）→ 身份证号示例
    result = result.replace(/XXX(?!\d)/g, '（示例：110101199001011234）');

    return result;
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
    wx.navigateTo({
      url: '/pages/newspaper/form'
    });
  }
});
