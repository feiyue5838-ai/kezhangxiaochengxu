/**
 * smartReplace 核心逻辑 — 独立文件，避免微信编译器解析大函数时出错
 * 规则优先级：专用规则在前，通用规则在最后
 */

function doSmartReplace(content) {
  var currentDate = new Date();
  var year = currentDate.getFullYear();
  var month = String(currentDate.getMonth() + 1).padStart(2, '0');
  var day = String(currentDate.getDate()).padStart(2, '0');
  var dateStr = year + '年' + month + '月' + day + '日';

  var result = content;

  // ══════════════════════════════════════
  // 第一优先级：日期、社会信用代码（必须在最前）
  // ══════════════════════════════════════

  // 1. 日期占位符
  result = result.replace(/XXXX年XX月XX日/g, dateStr);

  // 2. 统一社会信用代码（必须在一切XXX/XXXX之前）
  result = result.replace(/统一社会信用代码：X{8,}/g, '统一社会信用代码：__CREDIT__');
  result = result.replace(/统一社会信用代码：\d{2}X{6,}/g, '统一社会信用代码：__CREDIT__');

  // ══════════════════════════════════════
  // 第二优先级：姓名类（必须在通用XXX之前）
  // ══════════════════════════════════════

  // 3. 本人XXX
  result = result.replace(/本人XXX/g, '本人（示例：张三）');

  // 4. 姓名类标签（label: XXX）→ 姓名示例
  var nameLabels = ['声明人', '致歉人', '联系人', '法定代表人', '债权申报联系人',
                   '申请人', '被申请人', '当事人', '负责人', '声明人（单位）',
                   '新郎', '新娘', '学生', '学子', '祝福人', '祝福你的人', '永远的朋友',
                   '家人', '家长', '出借人', '借款人', '股东', '权利人'];
  nameLabels.forEach(function(field) {
    result = result.replace(new RegExp(field + '：XXX'), field + '：（示例：张三）');
  });

  // 4.1 XXX（...）
  result = result.replace(/XXX（[^）]*）/g, '（示例：张三）');
  // 4.2 称呼
  result = result.replace(/XXX (?=先生|女士|老师|小姐|公子|寿星|喜结连理)/g, '张三 ');
  // 4.3 情感句式
  result = result.replace(/致我最好的朋友 XXX/g, '致我最好的朋友 张三');
  result = result.replace(/(亲爱的|敬爱的) XXX/g, '$1 张三');
  result = result.replace(/致 XXX/g, '致 张三');
  result = result.replace(/致我亲爱的宝宝 XXX/g, '致我亲爱的宝宝 张三');
  result = result.replace(/永远爱你的：XXX/g, '永远爱你的：（示例：张三）');
  // 4.4 英文标签
  result = result.replace(/TO: XXX/g, 'TO: 张三');
  result = result.replace(/FROM: XXX/g, 'FROM: 张三');
  // 4.5 修饰语
  result = result.replace(/您的孩子：XXX/g, '您的孩子：（示例：张三）');
  // 4.6 链式XXX
  result = result.replace(/XXX  XXX(\s*XXX)*/g, function(m) {
    return m.replace(/XXX/g, '（示例：张三）');
  });

  // ══════════════════════════════════════
  // 第三优先级：公司名（必须在通用XXXX之前）
  // ══════════════════════════════════════

  // 5. 声明单位（保护"有限公司"后缀）
  result = result.replace(/声明单位：XXX有限公司/g, '声明单位：XX有限公司'.replace('XX', '（示例：XX）'));

  // 6. XXXX公司（必须在XXX公司之前，防止XXXX公司的后3个X被XXX公司先匹配）
  result = result.replace(/XXXX公司/g, '（示例：XX公司）有限公司');
  result = result.replace(/（示例：XX公司）有限公司）有限公司/g, '（示例：XX公司）有限公司');
  result = result.replace(/（示例：XX公司有限公司/g, '（示例：XX公司）有限公司');

  // 7. XXX公司
  result = result.replace(/XXX公司(?!\d)/g, '（示例：XX公司）');

  // 7b. 保险/物业等特殊公司后缀
  result = result.replace(/XXX保险公司/g, '（示例：XX保险公司）');
  result = result.replace(/XXX物业管理有限公司/g, '（示例：XX物业管理有限公司）');
  result = result.replace(/投保了XXX保险/g, '投保了（示例：XX保险）');
  result = result.replace(/XXX保险/g, '（示例：XX保险）');

  // ══════════════════════════════════════
  // 第四优先级：号码/证件类（必须在通用XXXX之前）
  // ══════════════════════════════════════

  // 8. 长串X（10+）→ 兜底提示
  var longNumFields = ['身份证号', '注册号', '执业证号', '许可证编号', '许可证号',
                       '保单号', '机构编码', '账号'];
  longNumFields.forEach(function(field) {
    result = result.replace(new RegExp(field + '：X{8,}'), field + '：（请填写完整信息）');
  });

  // 9. 票据/证件/编号字段
  var numFields = ['票据号码', '证号', '编号', '权证编号', '证书编号', '设备编号',
                   '证件编号', '合同编号', '备案/登记编号', '许可证号/证书号', '证件号码'];
  numFields.forEach(function(field) {
    result = result.replace(new RegExp(field + '：X{4,}'), field + '：__NUM__');
    result = result.replace(new RegExp(field + '：XXX'), field + '：（示例：12345678）');
  });

  // 10. 公告/通知类特有
  result = result.replace(/公告单位：XXX/g, '公告单位：（示例：XX有限公司）');
  result = result.replace(/通知人：XXX/g, '通知人：（示例：张三）');
  result = result.replace(/致：XXX/g, '致：（示例：张三）');
  result = result.replace(/联系地址：XXXX/g, '联系地址：（示例：XX市XX区XX路XX号）');

  // 11. 债权债务
  result = result.replace(/受让人：XXX/g, '受让人：（示例：张三）');
  result = result.replace(/受让方：XXX/g, '受让方：（示例：张三）');
  result = result.replace(/转让人：XXX/g, '转让人：（示例：张三）');
  result = result.replace(/原债权人：XXX/g, '原债权人：（示例：张三）');
  result = result.replace(/名称：XXX/g, '名称：（示例：XX公司）');
  result = result.replace(/贷款机构：XXX/g, '贷款机构：（示例：XX银行）');
  result = result.replace(/授权代表：XXX/g, '授权代表：（示例：张三）');
  result = result.replace(/保险公司：XXX/g, '保险公司：（示例：XX保险公司）');

  // ══════════════════════════════════════
  // 第五优先级：法院/法律格式
  // ══════════════════════════════════════

  // 12. 案号年份
  result = result.replace(/案号：XXXX/g, '案号：（示例：2026）');
  result = result.replace(/（案号：XXXX）/g, '（案号：（示例：2026））');
  // 删除过于宽泛的 /（XXXX）/ 规则 — 会导致 XXXX公司 等被误匹配
  // result = result.replace(/（XXXX）/g, '（（示例：2026））');
  result = result.replace(/〔XXXX〕/g, '〔2026〕');
  result = result.replace(/([民刑]初)XXX号/g, '$1（示例：1234）号');

  // 13. 电话（必须在通用XXXX之前）
  result = result.replace(/XXXX-XXXXXXXX/g, '（示例：0755-12345678）');

  // ══════════════════════════════════════
  // 第六优先级：角色名（无冒号）
  // ══════════════════════════════════════

  // 14. 无冒号角色标签（必须在通用XXX之前）
  var roles = ['被告', '债务人', '借款人', '出借人', '被执行人', '被征收人',
               '失踪人', '担保人', '债权人', '遗赠人', '受遗赠人', '抚养人',
               '收养人', '申请人', '被申请人', '声明人', '当事人', '通知人',
               '公告人', '被保险人', '主要负责人', '权利人', '股东'];
  roles.forEach(function(role) {
    result = result.replace(new RegExp(role + 'XXX(?!（)'), role + '（示例：张三）');
  });
  result = result.replace(/XXX诉/g, '（示例：张三）诉');

  // 15. 句中角色名
  result = result.replace(/XXX与/g, '（示例：张三）与');
  result = result.replace(/就XXX/g, '就（示例：XX）');

  // 16. 内容描述型
  result = result.replace(/XXX罪/g, '（示例：XX罪）');
  result = result.replace(/XXX事项/g, '（示例：XX事项）');
  result = result.replace(/XXX情形/g, '（示例：XX情形）');
  result = result.replace(/XXX争议/g, '（示例：XX争议）');
  result = result.replace(/XXX内容/g, '（示例：XX内容）');
  result = result.replace(/XXX名称/g, '（示例：XX名称）');
  result = result.replace(/XXX概要/g, '（示例：XX概要）');

  // ══════════════════════════════════════
  // 第七优先级：方括号占位符
  // ══════════════════════════════════════

  // 17. 方括号占位符
  result = result.replace(/【XXX】/g, '（示例：张三）');
  result = result.replace(/【XX】/g, '（示例：XX）');
  result = result.replace(/【名称】/g, '（示例：XX机构）');
  result = result.replace(/【日期】/g, '（日期：____年__月__日）');
  result = result.replace(/【电话】/g, '（示例：138****5678）');
  result = result.replace(/【公司全称】/g, '（示例：XX公司）');
  result = result.replace(/【公司地址】/g, '（示例：XX市XX区XX路XX号）');
  result = result.replace(/【仲裁委员会名称】/g, '（示例：XX仲裁委员会）');
  result = result.replace(/【仲裁委员会地址】/g, '（示例：XX市XX区XX路XX号）');
  result = result.replace(/【工伤认定部门】/g, '（示例：XX人社局）');
  result = result.replace(/【劳动争议事项】/g, '（示例：XX争议）');
  result = result.replace(/【调解内容】/g, '（请填写调解内容）');
  result = result.replace(/【部门\/岗位】/g, '（示例：XX部/XX岗）');
  result = result.replace(/【解除原因】/g, '（示例：个人原因）');
  result = result.replace(/【辞退原因】/g, '（示例：违反公司制度）');
  result = result.replace(/【原因】/g, '（示例：XX原因）');
  result = result.replace(/【事故地点】/g, '（示例：XX车间/岗位）');
  result = result.replace(/XXXX（事项/g, '（示例：XX事项');
  result = result.replace(/XXXX（行为/g, '（示例：XX行为');
  result = result.replace(/XXXX（相关/g, '（示例：XX相关');
  result = result.replace(/案由：XXX/g, '案由：（示例：XX纠纷）');

  // 规划条件
  result = result.replace(/原规划条件：XXX/g, '原规划条件：（示例：XX）');
  result = result.replace(/变更后规划条件：XXX/g, '变更后规划条件：（示例：XX）');

  // 地址/户名/账号
  result = result.replace(/地址：XXXX/g, '地址：（示例：XX市XX区XX路XX号）');
  result = result.replace(/户名：XXXX/g, '户名：（示例：XX银行）');
  result = result.replace(/账号：X{8,20}/g, '账号：（示例：6222****1234）');

  // 无括号案号年份
  result = result.replace(/XXXX(劳人仲|合同仲|民仲)/g, '（示例：2026）$1');
  result = result.replace(/X{4,8}字第/g, '（示例：2026）字第');

  // 法院专业名词
  result = result.replace(/XXX律师事务所/g, '（示例：XX律师事务所）');
  result = result.replace(/XXX律师/g, '（示例：XX律师）');
  result = result.replace(/XXX证券期货有限公司/g, '（示例：XX证券期货有限公司）');
  result = result.replace(/XXX出版社/g, '（示例：XX出版社）');
  result = result.replace(/车牌号：X{6,8}/g, '车牌号：（示例：粤B12345）');
  result = result.replace(/票号：X{6,10}/g, '票号：（示例：12345678）');
  result = result.replace(/存放编号：X{8,}/g, '存放编号：（示例：12345678）');
  result = result.replace(/机构名称：XXX/g, '机构名称：（示例：XX证券）');
  result = result.replace(/XXX单位/g, '（示例：XX单位）');
  result = result.replace(/XXX项目/g, '（示例：XX项目）');
  result = result.replace(/随身携带物品：XXX/g, '随身携带物品：（示例：XX）');
  result = result.replace(/《XXXX》/g, '《（示例：XXXX）》');
  result = result.replace(/XXX系列/g, '（示例：XX系列）');
  result = result.replace(/ISBN：X{13,}/g, 'ISBN：（示例：978-7-XXXX-XXXX-X）');
  result = result.replace(/XXX路/g, '（示例：XX）路');
  result = result.replace(/XXX号/g, '（示例：XX）号');
  result = result.replace(/XXX室/g, '（示例：XX）室');
  result = result.replace(/XXX平方米/g, '（示例：XX）平方米');
  result = result.replace(/提存原因：XXX/g, '提存原因：（示例：XX）');
  result = result.replace(/车型：XXX/g, '车型：（示例：XX牌XX型）');
  result = result.replace(/身高：XXXcm/g, '身高：（示例：170）cm');
  result = result.replace(/体貌特征：XXX/g, '体貌特征：（示例：XX）');
  result = result.replace(/(起火|死亡)原因为XXX/g, '$1原因为（示例：XX）');
  result = result.replace(/授权范围：XXX/g, '授权范围：（示例：XX）');
  result = result.replace(/办理XXX案件/g, '办理（示例：XX）案件');

  // ══════════════════════════════════════
  // 第八优先级：环评公示专项
  // ══════════════════════════════════════

  // 18. 环评公示 — 邮箱/数量单位/邮编（必须在通用XXXX之前）
  result = result.replace(/XXXX@[^\s，,。.!?？\n]+/g, '（示例：test@example.com）');
  result = result.replace(/XXXX万元/g, '（示例：100）万元');
  result = result.replace(/XXXX千瓦时/g, '（示例：100）千瓦时');
  result = result.replace(/XXXX吨(?=\/|年|\s)/g, '（示例：10）吨');
  result = result.replace(/XXXX个/g, '（示例：2）个');
  result = result.replace(/XXXX平方米/g, '（示例：1000）平方米');
  // 邮编（6位数字）
  result = result.replace(/XXXXXX(?=[）\s]|$)/g, '（示例：518000）');

  // 环评具体措施占位符（8个X）
  var huanpingFields = [
    '废气', '废水', '噪声', '固废', '噪声防治设施', '固体废物污染防治设施',
    '排放口数量及分布', '主要污染防治设施', '查阅方式和途径',
    '验收报告及验收意见查阅方式', '联系方式', '联系人及联系方式',
    '验收调查单位', '验收监测单位', '主要建设内容', '许可排放量及排放标准',
    '年排放量', '应急预案备案编号', '备案编号', '风险等级', '主要风险源',
    '可能影响', '防范措施', '许可证编号', '变更前主要内容', '变更后主要内容',
    '变更原因', '注销原因', '延续申请理由', '场地原使用情况',
    '污染物识别结果', '土壤检测结果', '地下水检测结果',
    '许可经营危险废物类别及规模', '许可范围'
  ];
  huanpingFields.forEach(function(field) {
    result = result.replace(new RegExp(field + '：XXXXXXXX'), field + '：（请填写具体内容）');
  });
  result = result.replace(/行业类别：XXXX/g, '行业类别：（示例：制造业）');
  result = result.replace(/变更原因：XXXXXX（如：.*?）/g, '变更原因：（示例：生产规模扩大）（如：增加生产线）');

  // ══════════════════════════════════════
  // 第九优先级：长串X兜底（必须在所有XXXX/XXX之前）
  // ══════════════════════════════════════

  // 19. 长串X（15+）→ 兜底提示
  result = result.replace(/X{15,}/g, '（请填写完整信息）');

  // ══════════════════════════════════════
  // 第十优先级：通用规则（最后兜底）
  // ══════════════════════════════════════

  // 20. 通用XXXX（4个X，不在数字后）→ 电话示例
  //     【关键】此时所有专用XXXX已被前面的规则处理完毕
  result = result.replace(/XXXX(?!\d)/g, '（示例：138****5678）');

  // 21. 通用XXX（3个X，不在数字后）→ 姓名示例
  //     【关键】此时所有专用XXX已被前面的规则处理完毕
  result = result.replace(/XXX(?!\d)/g, '（示例：张三）');

  // ══════════════════════════════════════
  // 还原哨兵
  // ══════════════════════════════════════
  result = result.replace(/统一社会信用代码：__CREDIT__/g, '统一社会信用代码：（示例：91XXXXXXXXXX）');
  result = result.replace(/__NUM__/g, '（示例：91XXXXXXXXXX）');

  return result;
}

module.exports = {
  doSmartReplace: doSmartReplace
};
