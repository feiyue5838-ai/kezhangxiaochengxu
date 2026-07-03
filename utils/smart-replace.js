/**
 * smartReplace 核心逻辑 — 分类专项方案
 * 每个分类有专用规则，避免通用规则误伤
 */

function doSmartReplace(content, categoryName) {
  var currentDate = new Date();
  var year = currentDate.getFullYear();
  var month = String(currentDate.getMonth() + 1).padStart(2, '0');
  var day = String(currentDate.getDate()).padStart(2, '0');
  var dateStr = year + '年' + month + '月' + day + '日';

  var result = content;

  // ══════════════════════════════════════
  // 所有分类通用
  // ══════════════════════════════════════

  result = result.replace(/XXXX年XX月XX日/g, dateStr);
  result = result.replace(/统一社会信用代码：X{8,}/g, '统一社会信用代码：__CREDIT__');
  result = result.replace(/统一社会信用代码：\d{2}X{6,}/g, '统一社会信用代码：__CREDIT__');

  // 姓名类
  result = result.replace(/本人XXX/g, '本人（示例：张三）');
  result = result.replace(/XXX（[^）]*）/g, '（示例：张三）');
  result = result.replace(/XXX (?=先生|女士|老师|小姐|公子|寿星)/g, '张三 ');
  var nameLabels = ['声明人', '致歉人', '联系人', '法定代表人', '债权申报联系人',
                   '申请人', '被申请人', '当事人', '负责人', '声明人（单位）',
                   '新郎', '新娘', '学生', '学子', '祝福人', '祝福你的人', '永远的朋友',
                   '家人', '家长', '出借人', '借款人', '股东', '权利人'];
  nameLabels.forEach(function(field) {
    result = result.replace(new RegExp(field + '：XXX'), field + '：（示例：张三）');
  });
  result = result.replace(/TO: XXX/g, 'TO: 张三');
  result = result.replace(/FROM: XXX/g, 'FROM: 张三');
  result = result.replace(/致我最好的朋友 XXX/g, '致我最好的朋友 张三');
  result = result.replace(/(亲爱的|敬爱的) XXX/g, '$1 张三');
  result = result.replace(/致 XXX/g, '致 张三');
  result = result.replace(/致我亲爱的宝宝 XXX/g, '致我亲爱的宝宝 张三');
  result = result.replace(/永远爱你的：XXX/g, '永远爱你的：（示例：张三）');
  result = result.replace(/您的孩子：XXX/g, '您的孩子：（示例：张三）');
  result = result.replace(/XXX  XXX(\s*XXX)*/g, function(m) {
    return m.replace(/XXX/g, '（示例：张三）');
  });

  // 证件号码
  result = result.replace(/身份证号：X{18}/g, '身份证号：（示例：110101199001011234）');
  result = result.replace(/身份证号：XXXXXXXXXXXXXXXXXX/g, '身份证号：（示例：110101199001011234）');
  var longNumFields = ['注册号', '执业证号', '许可证编号', '许可证号', '保单号', '机构编码'];
  longNumFields.forEach(function(field) {
    result = result.replace(new RegExp(field + '：X{8,}'), field + '：（请填写完整信息）');
  });
  var numFields = ['票据号码', '证号', '编号', '权证编号', '证书编号', '设备编号',
                   '证件编号', '合同编号', '备案/登记编号', '证件号码'];
  numFields.forEach(function(field) {
    result = result.replace(new RegExp(field + '：X{4,}'), field + '：__NUM__');
    result = result.replace(new RegExp(field + '：XXX'), field + '：（示例：12345678）');
  });

  // ══════════════════════════════════════
  // 分类专用规则
  // ══════════════════════════════════════

  if (categoryName === '身份证挂失' || categoryName === '个人证件' || categoryName === '企业证件') {
    result = result.replace(/XXXX公司/g, '（示例：XX公司）有限公司');
    result = result.replace(/XXX公司(?!\d)/g, '（示例：XX公司）');
    result = result.replace(/地址：XXXX/g, '地址：（示例：XX市XX区XX路XX号）');
    result = result.replace(/户名：XXXX/g, '户名：（示例：XX银行）');
    result = result.replace(/账号：X{8,20}/g, '账号：（示例：6222****1234）');
    // 语义引导（先于 XXXX 兜底，防止 8X 被拆分）
    result = result.replace(/XXXXXXXX(?=的不实言论|不实言论|发布了|声明)/g, '（示例：具体内容）');
    result = result.replace(/XXXXXXXX元/g, '（示例：XX万元）');
    result = result.replace(/XXXXXXXX(?=[）\s]|$)/g, '（示例：XX）');
    result = result.replace(/XXXX(?!年)/g, '（示例：XX）');
    result = result.replace(/XXX(?![\u4e00-\u9fa5\d])/g, '（示例：张三）');

  } else if (categoryName === '发票收据') {
    result = result.replace(/声明人（单位）：XXX/g, '声明人（单位）：（示例：XX公司）');
    result = result.replace(/XXXX公司/g, '（示例：XX公司）有限公司');
    result = result.replace(/票据号码：X{8,}/g, '票据号码：（示例：12345678）');
    result = result.replace(/XXXXXXXX(?=[）\s]|$)/g, '（示例：XX）');
    result = result.replace(/XXXX(?!年)/g, '（示例：XX）');
    result = result.replace(/XXX(?![\u4e00-\u9fa5\d])/g, '（示例：张三）');

  } else if (categoryName === '真情告白') {
    result = result.replace(/XXXXXXXX(?=[）\s]|$)/g, '（示例：XX）');
    result = result.replace(/XXXX(?!年)/g, '（示例：XX）');
    result = result.replace(/XXX(?![\u4e00-\u9fa5\d])/g, '（示例：张三）');

  } else if (categoryName === '公告声明') {
    result = result.replace(/XXXX公司/g, '（示例：XX公司）有限公司');
    result = result.replace(/XXX公司(?!\d)/g, '（示例：XX公司）');
    result = result.replace(/公告单位：XXX/g, '公告单位：（示例：XX有限公司）');
    result = result.replace(/通知人：XXX/g, '通知人：（示例：张三）');
    result = result.replace(/致：XXX/g, '致：（示例：张三）');
    result = result.replace(/联系地址：XXXX/g, '联系地址：（示例：XX市XX区XX路XX号）');
    result = result.replace(/XXXXXXXX(?=[）\s]|$)/g, '（示例：XX）');
    result = result.replace(/XXXX(?!年)/g, '（示例：XX）');
    result = result.replace(/XXX(?![\u4e00-\u9fa5\d])/g, '（示例：张三）');

  } else if (categoryName === '法院公告') {
    result = result.replace(/XXXX人民法院/g, '（示例：XX人民法院）');
    result = result.replace(/XXXX公司/g, '（示例：XX公司）有限公司');
    result = result.replace(/XXX公司(?!\d)/g, '（示例：XX公司）');
    result = result.replace(/案号：XXXX/g, '案号：（示例：2026）');
    result = result.replace(/（案号：XXXX）/g, '（案号：（示例：2026））');
    result = result.replace(/〔XXXX〕/g, '〔2026〕');
    result = result.replace(/([民刑]初)XXX号/g, '$1（示例：1234）号');
    result = result.replace(/XXX律师事务所/g, '（示例：XX律师事务所）');
    result = result.replace(/XXX律师/g, '（示例：XX律师）');
    result = result.replace(/XXXX-XXXXXXXX/g, '（示例：0755-12345678）');
    result = result.replace(/XXXXXXXX(?=[）\s]|$)/g, '（示例：XX）');
    result = result.replace(/XXXX(?!年)/g, '（示例：XX）');
    result = result.replace(/XXX(?![\u4e00-\u9fa5\d])/g, '（示例：张三）');

  } else if (categoryName === '政府送达') {
    result = result.replace(/XXXX公司/g, '（示例：XX公司）有限公司');
    result = result.replace(/XXX公司(?!\d)/g, '（示例：XX公司）');
    result = result.replace(/XXXX-XXXXXXXX/g, '（示例：0755-12345678）');
    result = result.replace(/地址：XXXX/g, '地址：（示例：XX市XX区XX路XX号）');
    result = result.replace(/XXXXXXXX(?=[）\s]|$)/g, '（示例：XX）');
    result = result.replace(/XXXX(?!年)/g, '（示例：XX）');
    result = result.replace(/XXX(?![\u4e00-\u9fa5\d])/g, '（示例：张三）');

  } else if (categoryName === '债权债务') {
    result = result.replace(/XXXX公司/g, '（示例：XX公司）有限公司');
    result = result.replace(/XXX公司(?!\d)/g, '（示例：XX公司）');
    result = result.replace(/受让人：XXX/g, '受让人：（示例：张三）');
    result = result.replace(/受让方：XXX/g, '受让方：（示例：张三）');
    result = result.replace(/转让人：XXX/g, '转让人：（示例：张三）');
    result = result.replace(/原债权人：XXX/g, '原债权人：（示例：张三）');
    result = result.replace(/贷款机构：XXX/g, '贷款机构：（示例：XX银行）');
    result = result.replace(/授权代表：XXX/g, '授权代表：（示例：张三）');
    result = result.replace(/账号：X{8,20}/g, '账号：（示例：6222****1234）');
    result = result.replace(/XXXXXXXX(?=[）\s]|$)/g, '（示例：XX）');
    result = result.replace(/XXXX(?!年)/g, '（示例：XX）');
    result = result.replace(/XXX(?![\u4e00-\u9fa5\d])/g, '（示例：张三）');

  } else if (categoryName === '解除劳动') {
    result = result.replace(/XXXX公司/g, '（示例：XX公司）有限公司');
    result = result.replace(/XXX公司(?!\d)/g, '（示例：XX公司）');
    result = result.replace(/【XXX】/g, '（示例：张三）');
    result = result.replace(/【XX】/g, '（示例：XX）');
    result = result.replace(/【日期】/g, '（日期：____年__月__日）');
    result = result.replace(/【解除原因】/g, '（示例：个人原因）');
    result = result.replace(/【辞退原因】/g, '（示例：违反公司制度）');
    result = result.replace(/【原因】/g, '（示例：XX原因）');
    result = result.replace(/【事故地点】/g, '（示例：XX车间/岗位）');
    result = result.replace(/【部门\/岗位】/g, '（示例：XX部/XX岗）');
    result = result.replace(/XXXX（事项/g, '（示例：XX事项');
    result = result.replace(/XXXX（行为/g, '（示例：XX行为');
    result = result.replace(/案号：XXXX/g, '案号：（示例：2026）');
    result = result.replace(/合同编号：X{4,}/g, '合同编号：（示例：HT20260001）');
    result = result.replace(/XXXXXXXX(?=[）\s]|$)/g, '（示例：XX）');
    result = result.replace(/XXXX(?!年)/g, '（示例：XX）');
    result = result.replace(/XXX(?![\u4e00-\u9fa5\d])/g, '（示例：张三）');

  } else if (categoryName === '环评公示') {
    result = result.replace(/XXXX公司/g, '（示例：XX公司）有限公司');
    result = result.replace(/XXX公司(?!\d)/g, '（示例：XX公司）');
    result = result.replace(/邮箱：XXXX@[^\s，。!?？\n\)）]+/g, '邮箱：（示例：test@example.com）');
    result = result.replace(/XXXX万元/g, '（示例：100）万元');
    result = result.replace(/XXXX千瓦时/g, '（示例：100）千瓦时');
    result = result.replace(/XXXX吨(?=\/|年|\s)/g, '（示例：10）吨');
    result = result.replace(/XXXX个/g, '（示例：2）个');
    result = result.replace(/XXXX平方米/g, '（示例：1000）平方米');
    result = result.replace(/XXXXXX(?=[）\)\s]|$)/g, '（示例：518000）');
    var huanpingFields = ['联系方式', '联系人及联系方式', '验收调查单位', '验收监测单位',
                          '主要建设内容', '年排放量', '风险等级', '主要风险源',
                          '许可证编号', '变更原因', '注销原因', '许可范围'];
    huanpingFields.forEach(function(field) {
      result = result.replace(new RegExp(field + '：XXXXXXXX'), field + '：（请填写具体内容）');
    });
    result = result.replace(/行业类别：XXXX/g, '行业类别：（示例：制造业）');
    result = result.replace(/XXXXXXXX(?=[）\s]|$)/g, '（示例：XX）');
    result = result.replace(/XXXX(?!年)/g, '（示例：XX）');
    result = result.replace(/XXX(?![\u4e00-\u9fa5\d])/g, '（示例：张三）');

  } else if (categoryName === '拍卖公告') {
    result = result.replace(/XXXX公司/g, '（示例：XX公司）有限公司');
    result = result.replace(/XXX公司(?!\d)/g, '（示例：XX公司）');
    // 语义引导（必须在 XXXX 兜底之前，防止 8X 被 XXXX 规则先拆）
    result = result.replace(/XXXXXXXX元/g, '（示例：XX万元）');
    result = result.replace(/XXXXXXXX(?=的不实言论|不实言论|不实言论内容|发布了|声明)/g, '（示例：具体内容）');
    result = result.replace(/XXXXXXXX展示/g, '（示例：请填写展示地点）');
    // 8X 专用字段（按字段名精确匹配）
    var pmFields = ['拍卖标的', '标的名称', '标的物', '拍卖依据', '网址',
                    '报名地点', '展示地点', '其他事项', '特别说明',
                    '竞买人资质', '竞买保证金', '品牌型号', '车牌号',
                    '资产名称', '资产位置', '资产规模', '参考价',
                    '拍卖价款', '评估价', '保留价', '咨询方式', '联系方式',
                    '保证金', '增幅'];
    pmFields.forEach(function(field) {
      result = result.replace(new RegExp(field + '：XXXXXXXX'), field + '：（示例：请填写）');
    });
    result = result.replace(/交纳保证金：XXX元/g, '交纳保证金：（示例：1万元）');
    // 通用 8X 兜底
    result = result.replace(/XXXXXXXXXX(?=[）\s]|$)/g, '（示例：518000）');
    result = result.replace(/XXXXXXXX(?=[）\s]|$)/g, '（示例：518000）');
    result = result.replace(/XXXX(?!年)/g, '（示例：XX）');
    result = result.replace(/XXX(?![\u4e00-\u9fa5\d])/g, '（示例：张三）');

  } else if (categoryName === '登报道歉') {
    result = result.replace(/XXXX公司/g, '（示例：XX公司）有限公司');
    result = result.replace(/XXX公司(?!\d)/g, '（示例：XX公司）');
    result = result.replace(/道歉原因：XXXXXXXX/g, '道歉原因：（示例：产品存在质量问题）');
    result = result.replace(/处理措施：XXXXXXXX/g, '处理措施：（示例：立即整改并赔偿）');
    result = result.replace(/联系方式：XXXXXXXX/g, '联系方式：（示例：0755-12345678）');
    result = result.replace(/账号信息：XXXXXXXX/g, '账号信息：（示例：6222****1234）');
    // 语义引导（必须先于 XXXX 兜底，防止 8X 被拆分）
    result = result.replace(/XXXXXXXX(?=的不实|不实言论|致歉内容|道歉内容|发布了|关于|的行为|事件|原因|事由)/g, '（示例：具体内容）');
    result = result.replace(/XXXXXXXX(?=[）\s]|$)/g, '（示例：具体内容）');
    result = result.replace(/XXXX(?!年)/g, '（示例：XX）');
    result = result.replace(/XXX(?![\u4e00-\u9fa5\d])/g, '（示例：张三）');

  } else if (categoryName === '表扬信' || categoryName === '宣传稿' || categoryName === '招标公告') {
    result = result.replace(/XXXX公司/g, '（示例：XX公司）有限公司');
    result = result.replace(/XXX公司(?!\d)/g, '（示例：XX公司）');
    result = result.replace(/联系人：XXX/g, '联系人：（示例：张三）');
    result = result.replace(/XXXX-XXXXXXXX/g, '（示例：0755-12345678）');
    result = result.replace(/XXXXXXXX(?=[）\s]|$)/g, '（示例：XX）');
    result = result.replace(/XXXX(?!年)/g, '（示例：XX）');
    result = result.replace(/XXX(?![\u4e00-\u9fa5\d])/g, '（示例：张三）');

  } else {
    // 未知分类：保守处理
    result = result.replace(/XXXX公司/g, '（示例：XX公司）有限公司');
    result = result.replace(/XXX公司(?!\d)/g, '（示例：XX公司）');
    result = result.replace(/XXXX-XXXXXXXX/g, '（示例：0755-12345678）');
    result = result.replace(/XXXXXXXX(?=[）\s]|$)/g, '（示例：XX）');
    result = result.replace(/XXXX(?!年)/g, '（示例：XX）');
    result = result.replace(/XXX(?![\u4e00-\u9fa5\d])/g, '（示例：张三）');
  }

  // 还原哨兵
  result = result.replace(/统一社会信用代码：__CREDIT__/g, '统一社会信用代码：（示例：91XXXXXXXXXX）');
  result = result.replace(/__NUM__/g, '（示例：91XXXXXXXXXX）');

  return result;
}

module.exports = {
  doSmartReplace: doSmartReplace,
  smartReplace: doSmartReplace  // 兼容别名
};
