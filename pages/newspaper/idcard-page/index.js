// pages/newspaper/idcard-page.js
const common = require('../../../utils/common.js');
const api = require('../../../utils/api.js');

// 硬编码兜底模板（离线或API失败时使用）
const FALLBACK_TEMPLATES = [
  {
    id: 'simple',
    name: '身份证(简单版)',
    desc: '基础个人信息',
    color: '#5B6FE8',
    content: '遗失声明\n\n本人XXX于XXXX年XX月XX日不慎遗失身份证件，证号：XXX，现声明作废。\n本人不承担因此证被他人使用而产生的任何法律责任。\n特此声明。\n\n声明人：XXX\n联系电话：XXXX'
  },
  {
    id: 'concise',
    name: '身份证(精简版)',
    desc: '精简描述',
    color: '#797EED',
    content: '本人XXX遗失身份证，证号XXX，即日起声明作废。'
  },
  {
    id: 'basic',
    name: '身份证(基础版)',
    desc: '标准格式',
    color: '#968DF2',
    content: '遗失声明\n\n本人XXX，身份证号码：XXX，于XXXX年XX月XX日不慎遗失身份证。\n自遗失之日起，该证件一切使用行为均与本人无关。\n特此声明。\n\n声明人：XXX\n联系电话：XXXX\n日期：XXXX年XX月XX日'
  },
  {
    id: 'lawyer',
    name: '身份证(律师版)',
    desc: '含法律声明',
    color: '#B49CF7',
    content: '遗失声明\n\n本人XXX，身份证号码：XXX，于XXXX年XX月XX日在XXXX不慎遗失身份证。\n\n一、本人郑重声明：自遗失之日起，上述身份证件一切法律行为均与本人无关。\n\n二、若有单位或个人违法使用该证件从事活动，由此产生的一切法律责任由行为人自行承担，与本人无任何关系。\n\n三、本人已向公安机关报案并申请补办。\n\n特此声明！\n\n声明人：XXX\n联系电话：XXXX\n日期：XXXX年XX月XX日'
  },
];

// 身份证挂失分类ID（后端UUID）
const IDCARD_CATEGORY_ID = '56eab382-2d52-4eb3-a684-c97b5e8a6ad4';

Page({
  data: {
    selectedTemplate: 'simple',
    templates: FALLBACK_TEMPLATES, // 初始用兜底
    loading: false,
  },

  onLoad() {
    this.loadTemplates();
  },

  // 优先从API加载模板，失败则用兜底
  async loadTemplates() {
    try {
      this.setData({ loading: true });
      const res = await api.getNewspaperTemplate(IDCARD_CATEGORY_ID);
      // 后端返回 {list: [...]}，取 res.list
      const tmplList = Array.isArray(res) ? res : (res && res.list) || [];
      // 该分类(56eab382)为"个人证件"大类，混有房产证/学历/营业执照等其他证件模板；
      // 本页语义为"身份证登报"，仅保留名称含"身份证"的模板
      const idcardList = tmplList.filter(function (t) { return (t.name || '').indexOf('身份证') >= 0; });
      if (idcardList.length > 0) {
        // API返回成功，用后端数据（字段映射：id/name/desc/color/content）
        this.setData({ templates: idcardList, loading: false });
      } else {
        // 返回空或异常，保持兜底
        this.setData({ loading: false });
      }
    } catch (e) {
      console.warn('身份证挂失模板API失败，使用兜底数据:', e);
      this.setData({ loading: false });
    }
  },

  goBack() {
    wx.navigateBack();
  },

  // 模板选中 - 自动跳转
  selectTemplate(e) {
    const { id } = e.currentTarget.dataset;
    this.setData({ selectedTemplate: id });
    // 延迟300ms让用户看到选中效果后自动跳转
    setTimeout(() => {
      this.onSubmit();
    }, 300);
  },

  // 提交 - 跳转到填写登报内容页面
  onSubmit() {
    const { selectedTemplate, templates } = this.data;
    const template = templates.find(t => t.id === selectedTemplate);
    if (!template) return;
    // 把模板内容存到 Storage，供 content-edit 读取
    wx.setStorageSync('newspaperTemplate', {
      id: template.id,
      name: template.name,
      content: template.content,
      businessType: '身份证挂失',
      _timestamp: Date.now()
    });
    // 保存分类信息用于 content-edit 页显示
    wx.setStorageSync('formPageNavData', {
      type: '身份证挂失',
      docName: template.name,
      categoryName: '身份证挂失',
      itemName: template.name,
      _timestamp: Date.now()
    });
    // 跳转到填写登报内容页面
    wx.navigateTo({
      url: '/pages/newspaper/content-edit/index'
    });
  }
});
