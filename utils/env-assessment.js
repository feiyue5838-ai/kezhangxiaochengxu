/**
 * 环评公示 - 分类配置
 * 涵盖建设项目环评、竣工验收、排污许可等各类环保公示模板
 */

const categories = [
  {
    id: 1,
    name: '环境影响评价信息公示',
    color: '#52C41A',
    desc: '环评全流程公示模板',
    hot: true,
    docs: [
      { name: '基础通用环评公示' },
      { name: '环评公示' },
      { name: '建设项目环境影响评价报告书公示' },
      { name: '建设项目环境影响评价报告表公示' },
      { name: '报告书专项公示' },
      { name: '二次征求意见公示' },
      { name: '环境影响评价公众参与公示' },
      { name: '建设项目环境影响登记表备案' },
    ]
  },
  {
    id: 2,
    name: '竣工环保验收公示',
    color: '#0FCB7D',
    desc: '建设项目竣工环境保护验收公示',
    hot: true,
    docs: [
      { name: '竣工环境保护验收监测报告公示' },
      { name: '竣工环境保护验收调查报告公示' },
      { name: '建设项目竣工环保验收公示' },
      { name: '噪声、固体废物污染防治设施验收公示' },
    ]
  },
  {
    id: 3,
    name: '排污许可证公示',
    color: '#FA8C16',
    desc: '排污许可证申领、变更、延续公示',
    hot: false,
    docs: [
      { name: '排污许可证申领公示' },
      { name: '排污许可证变更公示' },
      { name: '排污许可证延续公示' },
      { name: '排污许可证注销公示' },
    ]
  },
  {
    id: 4,
    name: '清洁生产与环境预案公示',
    color: '#5B6FE8',
    desc: '清洁生产审核、突发环境事件预案',
    hot: false,
    docs: [
      { name: '企业清洁生产审核公示' },
      { name: '清洁生产审核结果公示' },
      { name: '突发环境事件应急预案公示' },
      { name: '环境风险评估报告公示' },
    ]
  },
  {
    id: 5,
    name: '其他环保公示',
    color: '#7B8FF7',
    desc: '辐射安全、土壤调查等其他公示',
    hot: false,
    docs: [
      { name: '辐射安全许可证公示' },
      { name: '土壤污染状况调查报告公示' },
      { name: '危险废物经营许可公示' },
      { name: '国家重点监控企业环境信息公示' },
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

  // ==================== 1. 环境影响评价信息公示 ====================
  // -- 基础通用环评公示
  if (name === '基础通用环评公示') {
    return `${companyName}\n\n根据《中华人民共和国环境影响评价法》之规定，现将本公司“XXXX项目”环境影响评价有关信息公示如下：\n\n一、项目名称：XXXX项目\n二、建设单位：${companyName}\n三、建设地点：XX省XX市XX区/县XX路XX号\n四、环评机构：XXXX环境影响评价有限公司\n五、主要环境影响及环保措施：详见环评报告书/表。\n\n公众可在公示期内通过电话、邮件等方式提出意见。\n\n公示时间：XXXX年XX月XX日至XXXX年XX月XX日\n联系人：XXX  联系电话：XXXX-XXXXXXXX\n${companyName}\nXXXX年XX月XX日`;
  }

  // -- 环评公示（通用版）
  if (name === '环评公示') {
    return `${companyName}\n\n根据《中华人民共和国环境影响评价法》《建设项目环境保护管理条例》之规定，现将“XXXX项目”环境影响评价信息进行公示：\n\n一、建设项目概况\n  项目名称：XXXX项目\n  建设单位：${companyName}\n  建设地点：XX省XX市XX区/县XX路XX号\n  建设性质：新建/改扩建\n  总投资：XXXX万元\n\n二、主要环保措施\n  （一）废气：XXXXXXXX\n  （二）废水：XXXXXXXX\n  （三）噪声：XXXXXXXX\n  （四）固废：XXXXXXXX\n\n三、环评结论\n  项目符合产业政策及规划要求，在落实各项环保措施后，环境影响可接受。\n\n公众可在公示期内通过以下方式反馈意见：\n电话：XXXX-XXXXXXXX  邮箱：XXXX@XXXX.com\n\n${companyName}\nXXXX年XX月XX日`;
  }

  // -- 报告书专项公示
  if (name === '报告书专项公示') {
    return `${companyName}\n\n根据《中华人民共和国环境影响评价法》第二十二条、《环境影响评价公众参与办法》之规定，现就《XXXX项目环境影响报告书》专项公示如下：\n\n一、项目名称：XXXX项目\n二、建设单位：${companyName}\n三、环评机构：XXXX环境影响评价有限公司\n四、报告书全文网络链接：XXXXXXXX\n五、查阅纸质报告书的方式和途径：XXXXXXXX\n六、征求意见的公众范围：项目周边XXXX米范围内的居民及相关单位。\n七、公众意见表的网络链接：XXXXXXXX\n八、提交公众意见表的方式和途径：信函、电话、电子邮件。\n\n公示时间：XXXX年XX月XX日至XXXX年XX月XX日（共10个工作日）\n联系人：XXX  联系电话：XXXX-XXXXXXXX  邮箱：XXXX@XXXX.com\n${companyName}\nXXXX年XX月XX日`;
  }

  // -- 二次征求意见公示（环评第二次公示）
  if (name === '二次征求意见公示') {
    return `${companyName}\n\n根据《中华人民共和国环境影响评价法》《环境影响评价公众参与办法》之规定，现就《XXXX项目环境影响报告书》征求公众意见的第二次公示如下：\n\n一、项目名称：XXXX项目\n二、建设单位：${companyName}\n三、环评机构：XXXX环境影响评价有限公司\n四、环境影响报告书（征求意见稿）全文网络链接：XXXXXXXX\n五、查阅纸质报告书的方式和途径：XXXXXXXX\n六、征求意见的公众范围：项目周边区域居民、企事业单位及其他利益相关方。\n七、公众意见表的网络链接：XXXXXXXX\n八、提交公众意见表的方式和途径：\n  1. 电子邮件：XXXX@XXXX.com\n  2. 信函：XX省XX市XX区XX路XX号（邮编：XXXXXX）\n  3. 电话：XXXX-XXXXXXXX\n\n九、公示时间\n  XXXX年XX月XX日至XXXX年XX月XX日（共10个工作日）。\n\n${companyName}\n联系人：XXX\n电话：XXXX-XXXXXXXX\n邮箱：XXXX@XXXX.com\nXXXX年XX月XX日`;
  }

  if (name === '建设项目环境影响评价报告书公示') {
    return `${companyName}\n\n根据《中华人民共和国环境影响评价法》第二十二条之规定，现将《XXXX项目环境影响报告书》有关信息公示如下：\n\n一、建设项目名称：XXXX项目\n二、建设单位：${companyName}\n三、建设地点：XX省XX市XX区/县XX路XX号\n四、建设项目概况：XXXXXXXX\n五、环评机构：XXXX环境影响评价有限公司\n六、环境影响评价结论：\n   （一）项目符合国家和地方产业政策要求。\n   （二）项目选址符合城市总体规划及土地利用总体规划。\n   （三）项目排放的污染物符合国家和我省规定的污染物排放标准。\n   （四）项目排放的污染物符合总量控制指标要求。\n   （五）项目在落实报告书提出的各项环保措施后，环境影响可接受。\n\n根据《环境影响评价公众参与办法》要求，本报告书全本已在本网站公示，公众可通过以下方式查阅。公众可通过电话、邮件等方式提出意见。\n\n公示时间：XXXX年XX月XX日至XXXX年XX月XX日（共10个工作日）\n联系人：XXX  联系电话：XXXX-XXXXXXXX\n${companyName}\nXXXX年XX月XX日`;
  }

  if (name === '建设项目环境影响评价报告表公示') {
    return `${companyName}\n\n根据《中华人民共和国环境影响评价法》第十六条之规定，现将《XXXX项目环境影响报告表》有关信息公示如下：\n\n一、建设项目名称：XXXX项目\n二、建设单位：${companyName}\n三、建设地点：XX省XX市XX区/县XX路XX号\n四、环评机构：XXXX环境影响评价有限公司\n五、主要环保措施：\n   （一）废气：XXXXXXXX\n   （二）废水：XXXXXXXX\n   （三）噪声：XXXXXXXX\n   （四）固废：XXXXXXXX\n\n本报告表已在当地生态环境局网站公示，公众可通过电话或邮件方式反馈意见。\n\n公示时间：XXXX年XX月XX日至XXXX年XX月XX日（共5个工作日）\n联系人：XXX  联系电话：XXXX-XXXXXXXX\n${companyName}\nXXXX年XX月XX日`;
  }

  if (name === '环境影响评价公众参与公示') {
    return `${companyName}\n\n一、建设项目名称及概要\n项目名称：XXXX项目\n项目地址：XX省XX市XX区/县XX路XX号\n项目性质：新建/改扩建/技术改造\n总投资：XXXX万元\n主要建设内容：XXXXXXXX\n\n二、建设单位名称及联系方式\n建设单位：${companyName}\n联系人：XXX  电话：XXXX-XXXXXXXX\n地址：XXXX\n\n三、环境影响评价机构名称\n评价机构：XXXX环境影响评价有限公司\n联系人：XXX  电话：XXXX-XXXXXXXX\n\n四、公众意见表的网络链接\n公众可通过以下链接下载《建设项目环境影响评价公众意见表》：\n[填写网络链接]\n\n五、提交公众意见表的方式和途径\n公众可通过信函、电话、电子邮件等方式，在规定时间内将填好的公众意见表提交建设单位或环评机构，反映与建设项目环境影响有关的意见和建议。\n\n六、公示时间\nXXXX年XX月XX日至XXXX年XX月XX日（共10个工作日）\n${companyName}\nXXXX年XX月XX日`;
  }

  if (name === '建设项目环境影响登记表备案') {
    return `${companyName}\n\n根据《中华人民共和国环境影响评价法》第十六条、第二十二条及《建设项目环境影响登记表备案管理办法》之规定，现将本建设项目环境影响登记表予以备案，备案号：XXXXXXXX。\n\n一、项目名称：XXXX项目\n二、建设单位：${companyName}\n三、建设地点：XX省XX市XX区/县XX路XX号\n四、主要环保措施：XXXXXXXX\n\n本登记表已依法向当地生态环境主管部门备案，接受社会监督。如有异议，请向当地生态环境局反映。\n\n${companyName}\nXXXX年XX月XX日`;
  }

  // ==================== 2. 竣工环保验收公示 ====================
  if (name === '竣工环境保护验收监测报告公示') {
    return `${companyName}\n\n根据《建设项目环境保护管理条例》第十七条规定，本公司"XXXX项目"配套建设的环境保护设施已与主体工程同时建成并投入使用。现将《竣工环境保护验收监测报告》主要内容公示如下：\n\n一、项目名称：XXXX项目\n二、建设单位：${companyName}\n三、验收监测单位：XXXX环境监测有限公司\n四、验收监测结论：\n   （一）废气排放：符合《大气污染物综合排放标准》（GB16297-1996）相应标准要求。\n   （二）废水排放：符合《污水综合排放标准》（GB8978-1996）相应标准要求。\n   （三）厂界噪声：符合《工业企业厂界环境噪声排放标准》（GB12348-2008）相应标准。\n   （四）固体废物：委托XXXX单位进行无害化处置。\n\n五、公众反馈方式\n如对该项目验收结果有异议，请在公示期内以书面方式反馈。\n\n公示时间：XXXX年XX月XX日至XXXX年XX月XX日\n联系人：XXX  电话：XXXX-XXXXXXXX\n${companyName}\nXXXX年XX月XX日`;
  }

  if (name === '竣工环境保护验收调查报告公示') {
    return `${companyName}\n\n根据《建设项目环境保护管理条例》第十七条规定，本公司"XXXX项目"配套建设的环境保护设施已与主体工程同时建成并投入使用。现将《竣工环境保护验收调查报告》予以公示：\n\n一、项目名称：XXXX项目\n二、建设单位：${companyName}\n三、验收调查单位：XXXX环境工程有限公司\n四、调查结论：\n   （一）项目选址符合区域规划及生态功能区划要求。\n   （二）项目排放的各项污染物符合国家和地方排放标准。\n   （三）项目对周围环境的影响在可接受范围内。\n   （四）各项环保设施运行正常。\n\n公众可在公示期内通过以下方式提出意见。\n\n公示时间：XXXX年XX月XX日至XXXX年XX月XX日\n联系人：XXX  电话：XXXX-XXXXXXXX\n${companyName}\nXXXX年XX月XX日`;
  }

  if (name === '建设项目竣工环保验收公示') {
    return `${companyName}\n\n根据《建设项目环境保护管理条例》第十七条及《建设项目竣工环境保护验收暂行办法》之规定，现将"XXXX项目"竣工环保验收情况公示如下：\n\n一、项目名称：XXXX项目\n二、建设单位：${companyName}\n三、建设地点：XX省XX市XX区/县XX路XX号\n四、验收结论：经验收监测/调查，项目环境保护设施/措施满足环评及批复要求，各项污染物达标排放，项目竣工环境保护验收合格。\n五、验收报告及验收意见查阅方式：XXXXXXXX\n\n公众可在公示期内通过以下方式提出意见：\n\n公示时间：XXXX年XX月XX日至XXXX年XX月XX日（共20个工作日）\n联系人：XXX  电话：XXXX-XXXXXXXX\n${companyName}\nXXXX年XX月XX日`;
  }

  if (name === '噪声、固体废物污染防治设施验收公示') {
    return `${companyName}\n\n根据《建设项目环境保护管理条例》第十七条之规定，现就"XXXX项目"噪声、固体废物污染防治设施竣工验收情况公示如下：\n\n一、项目名称：XXXX项目\n二、建设单位：${companyName}\n三、验收内容：\n   （一）噪声污染防治设施：隔声墙、消声器、减振垫等，运行正常。\n   （二）固体废物污染防治设施：危险废物暂存间、一般固废堆场等，符合"三防"要求。\n四、验收结论：经验收，噪声及固体废物污染防治设施满足设计和环评要求，运行正常，验收合格。\n\n公众可在公示期内以书面形式反馈意见。\n\n公示时间：XXXX年XX月XX日至XXXX年XX月XX日\n联系人：XXX  电话：XXXX-XXXXXXXX\n${companyName}\nXXXX年XX月XX日`;
  }

  // ==================== 3. 排污许可证公示 ====================
  if (name === '排污许可证申领公示') {
    return `${companyName}\n\n根据《中华人民共和国环境保护法》第四十五条、《排污许可管理条例》第二条之规定，现将本企业排污许可证申领有关信息公示如下：\n\n一、企业名称：${companyName}\n二、生产地址：XX省XX市XX区/县XX路XX号\n三、行业类别：XXXX\n四、排污许可证编号：申领中（编号待发）\n五、主要排放污染物：\n   （一）废气：二氧化硫、氮氧化物、颗粒物等。\n   （二）废水：化学需氧量、氨氮、总磷等。\n六、排放口数量及分布：XXXXXXXX\n七、主要污染防治设施：XXXXXXXX\n\n现依法申请领取排污许可证，如对上述信息有异议，请在公示期内向核发机关反映。\n\n${companyName}\nXXXX年XX月XX日`;
  }

  if (name === '排污许可证变更公示') {
    return `${companyName}\n\n根据《排污许可管理条例》第十六条之规定，本公司排污许可证（编号：XXXXXXXX）因以下原因申请变更，现予以公示：\n\n一、企业名称：${companyName}\n二、原排污许可证编号：XXXXXXXX\n三、变更原因：XXXXXXXX（如：生产工艺变更、产能变化、新增排放口、排放标准调整等）\n四、变更前主要内容：XXXXXXXX\n五、变更后主要内容：XXXXXXXX\n\n变更后排放情况及污染防治措施详见变更申请材料。如有异议，请在公示期内向核发机关反映。\n\n${companyName}\nXXXX年XX月XX日`;
  }

  if (name === '排污许可证延续公示') {
    return `${companyName}\n\n根据《排污许可管理条例》第十四条之规定，本公司排污许可证（编号：XXXXXXXX，有效期至XXXX年XX月XX日）将于到期前依法申请延续，现予以公示：\n\n一、企业名称：${companyName}\n二、排污许可证编号：XXXXXXXX\n三、生产地址：XX省XX市XX区/县XX路XX号\n四、延续申请理由：XXXXXXXX\n五、许可排放量及排放标准：XXXXXXXX\n\n延续申请期间，原排污许可证继续有效。如有异议，请在公示期内向核发机关反映。\n\n${companyName}\nXXXX年XX月XX日`;
  }

  if (name === '排污许可证注销公示') {
    return `${companyName}\n\n根据《排污许可管理条例》第十七条之规定，本公司排污许可证（编号：XXXXXXXX）因以下原因申请注销，现予以公示：\n\n一、企业名称：${companyName}\n二、排污许可证编号：XXXXXXXX\n三、注销原因：XXXXXXXX（如：项目停产关闭、产能淘汰、依法不需要持有排污许可证等）\n四、注销日期：XXXX年XX月XX日\n\n本公司承诺注销后不再排放污染物，原许可范围内的所有排放口已依法停止使用或拆除。如有异议，请在公示期内向核发机关反映。\n\n${companyName}\nXXXX年XX月XX日`;
  }

  // ==================== 4. 清洁生产与应急预案公示 ====================
  if (name === '企业清洁生产审核公示') {
    return `${companyName}\n\n根据《中华人民共和国清洁生产促进法》第十条及《清洁生产审核办法》第八条之规定，本公司被列为强制性/自愿性清洁生产审核单位。现将清洁生产审核有关信息公示如下：\n\n一、企业名称：${companyName}\n二、企业地址：XX省XX市XX区/县XX路XX号\n三、行业类别：XXXX\n四、审核机构：XXXX环境科技有限公司\n五、审核起止时间：XXXX年XX月XX日至XXXX年XX月XX日\n六、主要审核目标：\n   （一）降低原材料消耗。\n   （二）减少能源消耗和污染物排放。\n   （三）提高资源利用效率。\n\n公众可通过以下方式了解审核进展并提出意见：\n联系人：XXX  电话：XXXX-XXXXXXXX\n${companyName}\nXXXX年XX月XX日`;
  }

  if (name === '清洁生产审核结果公示') {
    return `${companyName}\n\n根据《中华人民共和国清洁生产促进法》第十九条之规定，本公司已完成清洁生产审核，现发布审核结果如下：\n\n一、企业名称：${companyName}\n二、审核机构：XXXX环境科技有限公司\n三、审核时间：XXXX年XX月XX日至XXXX年XX月XX日\n四、已实施的无/低费方案（X项）：XXXXXXXX\n五、已实施的中/高费方案（X项）：XXXXXXXX\n六、审核后效果：\n   （一）节电：XXXX千瓦时/年\n   （二）节水：XXXX吨/年\n   （三）减排COD：XXXX吨/年\n   （四）减排SO2：XXXX吨/年\n   （五）减少固废：XXXX吨/年\n七、下一步清洁生产计划：XXXXXXXX\n\n如对上述审核结果有异议，请在公示期内反馈。\n\n联系人：XXX  电话：XXXX-XXXXXXXX\n${companyName}\nXXXX年XX月XX日`;
  }

  if (name === '突发环境事件应急预案公示') {
    return `${companyName}\n\n根据《中华人民共和国环境保护法》第四十七条及《突发环境事件应急管理办法》之规定，本公司编制了《突发环境事件应急预案》，现予以公示：\n\n一、企业名称：${companyName}\n二、预案备案编号：XXXXXXXX\n三、备案机关：XX市生态环境局\n四、预案适用范围：XXXXXXXX\n五、可能发生的突发环境事件类型：\n   （一）危险化学品泄漏。\n   （二）废水超标排放。\n   （三）废气事故性排放。\n   （四）危险废物突发泄漏。\n六、应急组织机构及联系方式：XXXXXXXX\n七、应急物资储备情况：XXXXXXXX\n\n本公司承诺严格执行应急预案，发生突发环境事件时，按照规定及时启动预案并报告环保部门。\n\n${companyName}\nXXXX年XX月XX日`;
  }

  if (name === '环境风险评估报告公示') {
    return `${companyName}\n\n根据《企业事业单位突发环境事件应急预案备案管理办法（试行）》之规定，本公司已完成环境风险评估并编制环境应急预案，现公示评估结论：\n\n一、企业名称：${companyName}\n二、评估机构：XXXX环境安全评估有限公司\n三、风险等级：重大/较大/一般环境风险\n四、主要风险源：XXXXXXXX\n五、可能影响：XXXXXXXX\n六、防范措施：XXXXXXXX\n\n公众如对评估结果有意见，请在公示期内反馈。\n\n联系人：XXX  电话：XXXX-XXXXXXXX\n${companyName}\nXXXX年XX月XX日`;
  }

  // ==================== 5. 其他环保公示 ====================
  if (name === '辐射安全许可证公示') {
    return `${companyName}\n\n根据《中华人民共和国放射性污染防治法》及《放射性同位素与射线装置安全和防护条例》之规定，本公司辐射安全许可证相关信息公示如下：\n\n一、单位名称：${companyName}\n二、许可证编号：XXXXXXXX\n三、许可范围：XXXXXXXX（如：使用II类/III类射线装置；销售II类/III类射线装置等）\n四、发证机关：XX省生态环境厅\n五、有效期至：XXXX年XX月XX日\n六、辐射安全管理负责人：XXX  联系电话：XXXX-XXXXXXXX\n\n本公司承诺严格按照辐射安全许可证规定的范围从事相关活动，接受生态环境部门监督管理。\n\n${companyName}\nXXXX年XX月XX日`;
  }

  if (name === '土壤污染状况调查报告公示') {
    return `${companyName}\n\n根据《中华人民共和国土壤污染防治法》第五十九条之规定，现将本公司场地土壤污染状况调查有关信息公示如下：\n\n一、地块名称：XXXX地块\n二、调查单位：XXXX环境科技有限公司\n三、调查结果：\n   （一）地块原使用情况：XXXXXXXX\n   （二）污染物识别结果：XXXXXXXX\n   （三）土壤检测结果：XXXXXXXX\n   （四）地下水检测结果：XXXXXXXX\n   （五）调查结论：该地块土壤/地下水污染物含量【未超过/超过】《土壤环境质量 建设用地土壤污染风险管控标准》（GB36600-2018）筛选值，需【不需要/开展进一步风险评估】。\n\n详细调查报告可在XXXXXXXX查阅。公众如有异议，请在公示期内反馈。\n\n联系人：XXX  电话：XXXX-XXXXXXXX\n${companyName}\nXXXX年XX月XX日`;
  }

  if (name === '危险废物经营许可公示') {
    return `${companyName}\n\n根据《中华人民共和国固体废物污染环境防治法》第八十条之规定，本公司持有危险废物经营许可证，相关事项公示如下：\n\n一、单位名称：${companyName}\n二、许可证编号：XXXXXXXX\n三、许可经营方式：收集、贮存、利用、处置（选填）\n四、许可经营危险废物类别及规模：XXXXXXXX\n五、发证机关：XX省生态环境厅\n六、有效期至：XXXX年XX月XX日\n\n本公司承诺严格按照许可证规定的范围从事危险废物经营活动，接受生态环境部门监督管理。\n\n${companyName}\nXXXX年XX月XX日`;
  }

  if (name === '国家重点监控企业环境信息公示') {
    return `${companyName}\n\n根据《企业环境信息依法披露管理办法》之规定，本公司作为国家重点监控企业，现依法披露环境信息如下：\n\n一、企业基本信息\n企业名称：${companyName}\n统一社会信用代码：XXXXXXXX\n所属行业：XXXX\n二、主要污染物排放信息\n排放口数量：XX个\n主要污染物：COD、氨氮、二氧化硫、氮氧化物、颗粒物\n年排放量：XXXXXXXX\n排放标准：XXXXXXXX\n三、污染防治设施运行情况：正常/异常\n四、环评及排污许可信息：XXXXXXXX\n五、强制性清洁生产审核信息（如适用）：XXXXXXXX\n\n以上信息真实有效，如有异议请向当地生态环境部门反映。\n\n${companyName}\nXXXX年XX月XX日`;
  }

  // 默认兜底
  return `${companyName}\n\n根据国家和地方环境保护法律法规之规定，本公司现就XXXX环境保护相关事宜予以公示：\n\n一、公示事项：XXXXXXXX\n二、主要内容：XXXXXXXX\n三、公示依据：XXXXXXXX\n四、公众反馈：如有异议，请在见报之日起十五日内以书面方式向XXXX生态环境局反映，联系电话：XXXX-XXXXXXXX。\n\n${companyName}\nXXXX年XX月XX日`;
}

module.exports = { categories, generateContent, getTotalCount };
