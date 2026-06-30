/**
 * 表扬信 - 分类配置
 * 涵盖个人表扬、企业表扬、服务表扬等
 */

const categories = [
  {
    id: 1,
    name: '个人表扬信',
    color: '#FA8C16',
    desc: '表扬个人先进事迹',
    hot: true,
    docs: [
      { name: '个人表扬信' },
      { name: '拾金不昧表扬信' },
      { name: '见义勇为表扬信' },
    ]
  },
  {
    id: 2,
    name: '企业表扬信',
    color: '#5B6FE8',
    desc: '表扬企业优良服务',
    hot: true,
    docs: [
      { name: '企业表扬信' },
      { name: '企业服务表扬信' },
      { name: '企业质量表扬信' },
    ]
  },
  {
    id: 3,
    name: '员工表扬信',
    color: '#52C41A',
    desc: '表扬员工优秀表现',
    hot: false,
    docs: [
      { name: '员工表扬信' },
      { name: '优秀员工表扬信' },
    ]
  },
  {
    id: 4,
    name: '单位表扬信',
    color: '#7B8FF7',
    desc: '表扬单位协作贡献',
    hot: false,
    docs: [
      { name: '单位表扬信' },
      { name: '协作单位表扬信' },
    ]
  }
];

function getTotalCount() {
  return categories.reduce((sum, cat) => sum + cat.docs.length, 0);
}

/**
 * 根据模板名称生成报纸内容
 */
function generateContent(name) {
  const companyName = 'XXXX公司';
  const personName = 'XXX';

  // ==================== 1. 个人表扬信 ====================
  if (name === '个人表扬信') {
    return `表扬信\n\n${personName}同志：\n\n鉴于您在XXXXXXXX（事件/工作）中的出色表现，特此予以表扬：\n\n一、表扬事由：XXXXXXXX\n二、您在工作中表现出的XXXXXXXX（品质/精神），值得我们全体员工学习。\n三、特此登报表扬，以资鼓励。\n\n希望您继续保持优良作风，再创佳绩！\n\n${companyName}\nXXXX年XX月XX日`;
  }

  if (name === '拾金不昧表扬信') {
    return `表扬信\n\n${personName}同志：\n\nXXXX年XX月XX日，您在XXXXXXXX（地点）拾得XXXXXXXX（物品/现金），并及时归还失主/上交相关部门，展现了高尚的道德品质和良好的社会风尚。\n\n您的拾金不昧行为，充分体现了中华民族的传统美德，值得我们学习和弘扬。特此登报表扬，以资鼓励！\n\n希望广大市民以${personName}同志为榜样，共同营造诚信友善的社会氛围。\n\n${companyName}\nXXXX年XX月XX日`;
  }

  if (name === '见义勇为表扬信') {
    return `表扬信\n\n${personName}同志：\n\nXXXX年XX月XX日，您在XXXXXXXX（地点/事件）中，不畏艰险、挺身而出，成功XXXXXXXX（救助他人/制止违法行为/扑灭火灾等），展现了崇高的社会责任感和无私奉献精神。\n\n您的见义勇为行为，弘扬了社会正气，传递了正能量，值得我们全社会学习和尊敬。特此登报表扬，以资鼓励！\n\n${companyName}\nXXXX年XX月XX日`;
  }

  // ==================== 2. 企业表扬信 ====================
  if (name === '企业表扬信') {
    return `表扬信\n\n${companyName}：\n\n贵司在XXXXXXXX（项目/合作）中，以高度的责任心和专业的服务态度，圆满完成了各项任务，取得了优异成绩。\n\n特此对贵司的优质服务和出色表现予以表扬，希望能继续保持优良作风，共创美好未来！\n\n此致\n敬礼！\n\nXXXX单位\nXXXX年XX月XX日`;
  }

  if (name === '企业服务表扬信') {
    return `表扬信\n\n${companyName}：\n\n贵司在为${companyName}提供XXXXXXXX（服务/产品）期间，表现出色：\n\n一、服务态度热情周到，响应及时迅速。\n二、专业水平过硬，问题处理得当。\n三、团队协作能力强，保质保量完成任务。\n\n特此登报表扬，对贵司的优质服务表示感谢！\n\n此致\n敬礼！\n\nXXXX单位\nXXXX年XX月XX日`;
  }

  if (name === '企业质量表扬信') {
    return `表扬信\n\n${companyName}：\n\n贵司提供的XXXXXXXX（产品/工程）质量优良，符合国家标准和合同约定要求，在XXXXXXXX（验收/使用）过程中表现优异。\n\n贵司严谨的质量管理态度和精益求精的工作作风，值得学习和推广。特此登报表扬！\n\n此致\n敬礼！\n\nXXXX单位\nXXXX年XX月XX日`;
  }

  // ==================== 3. 员工表扬信 ====================
  if (name === '员工表扬信') {
    return `表扬信\n\n${companyName}员工${personName}：\n\n该员工在XXXXXXXX（工作/项目）中，表现优异：\n\n一、工作认真负责，积极主动。\n二、业务能力突出，完成任务出色。\n三、团队协作意识强，乐于助人。\n\n特此登报表扬，以资鼓励。希望全体员工以${personName}为榜样，为公司发展贡献力量！\n\n${companyName}\nXXXX年XX月XX日`;
  }

  if (name === '优秀员工表扬信') {
    return `表扬信\n\n${personName}同志：\n\n鉴于您在XXXX年度工作中表现突出，被评为"${companyName}XXXX年度优秀员工"。特此予以表扬：\n\n一、工作业绩：XXXXXXXX\n二、获奖理由：XXXXXXXX\n三、表彰奖励：XXXXXXXX\n\n希望您再接再厉，继续努力，为公司发展作出更大贡献！\n\n${companyName}\nXXXX年XX月XX日`;
  }

  // ==================== 4. 单位表扬信 ====================
  if (name === '单位表扬信') {
    return `表扬信\n\nXXXX单位：\n\n贵单位在XXXXXXXX（项目/活动/合作）中，给予了大力支持和无私帮助，确保了各项工作的顺利完成。\n\n贵单位展现出的高度责任感和优良作风，值得我们学习和借鉴。特此登报表扬，表示感谢！\n\n此致\n敬礼！\n\n${companyName}\nXXXX年XX月XX日`;
  }

  if (name === '协作单位表扬信') {
    return `表扬信\n\nXXXX单位：\n\n在XXXXXXXX（项目/工作）中，贵单位与我司通力合作、密切配合，克服了诸多困难，圆满完成了既定目标。\n\n贵单位的专业素养和协作精神，给我们留下了深刻印象。特此登报表扬，期待今后继续深化合作，共创佳绩！\n\n此致\n敬礼！\n\n${companyName}\nXXXX年XX月XX日`;
  }

  // 默认兜底
  return `${companyName}\n\n表扬信\n\n鉴于XXXXXXXX在XXXXXXXX中的出色表现，特此予以表扬。\n\n希望继续保持优良作风，再创佳绩！\n\n${companyName}\nXXXX年XX月XX日`;
}

module.exports = { categories, generateContent, getTotalCount };
