/**
 * 企业证件登报模板配置
 */
module.exports = {
  // 根据证件名称和分类生成登报模板内容
  generateContent(name, categoryName) {
    const templates = {
      '印章/证照类': `遗失声明\n\n本单位不慎遗失${name}，编号：XXX，现声明作废。\n自遗失之日起，该印章/证照一切使用行为均与本单位无关。\n\n特此声明！\n\n声明单位：XXX有限公司\n统一社会信用代码：91XXXXXXXXXXXXXXXX\n日期：XXXX年XX月XX日`,
      '合同/协议类': `遗失声明\n\n本单位不慎遗失${name}，合同编号：XXX，现声明作废。\n自遗失之日起，该合同/协议一切使用行为均与本单位无关。\n\n特此声明！\n\n声明单位：XXX有限公司\n日期：XXXX年XX月XX日`,
      '许可证/资质类': `遗失声明\n\n本单位不慎遗失${name}，证件编号：XXX，现声明作废。\n自遗失之日起，该证件一切使用行为均与本单位无关。\n\n特此声明！\n\n声明单位：XXX有限公司\n统一社会信用代码：91XXXXXXXXXXXXXXXX\n日期：XXXX年XX月XX日`,
      '票据/凭证类': `遗失声明\n\n本单位不慎遗失${name}，票据编号：XXX，现声明作废。\n该票据不再具有任何法律效力。\n\n特此声明！\n\n声明单位：XXX有限公司\n日期：XXXX年XX月XX日`,
      '交通/运输类': `遗失声明\n\n本单位不慎遗失${name}，证号：XXX，现声明作废。\n自遗失之日起，该证件一切使用行为均与本单位无关。\n\n特此声明！\n\n声明单位：XXX有限公司\n日期：XXXX年XX月XX日`,
      '建筑/工程类': `遗失声明\n\n本单位不慎遗失${name}，证书编号：XXX，现声明作废。\n自遗失之日起，该证书一切使用行为均与本单位无关。\n\n特此声明！\n\n声明单位：XXX有限公司\n统一社会信用代码：91XXXXXXXXXXXXXXXX\n日期：XXXX年XX月XX日`,
      '营业执照/资质类': `遗失声明\n\n本单位不慎遗失${name}，统一社会信用代码：91XXXXXXXXXXXXXXXX，现声明作废。\n自遗失之日起，该证照一切使用行为均与本单位无关。\n\n特此声明！\n\n声明单位：XXX有限公司\n日期：XXXX年XX月XX日`,
      '医疗/医药类': `遗失声明\n\n本单位不慎遗失${name}，证件编号：XXX，现声明作废。\n自遗失之日起，该证件一切使用行为均与本单位无关。\n\n特此声明！\n\n声明单位：XXX有限公司\n日期：XXXX年XX月XX日`,
      '金融/税务类': `遗失声明\n\n本单位不慎遗失${name}，编号：XXX，现声明作废。\n自遗失之日起，该证件/凭证一切使用行为均与本单位无关。\n\n特此声明！\n\n声明单位：XXX有限公司\n统一社会信用代码：91XXXXXXXXXXXXXXXX\n日期：XXXX年XX月XX日`,
      '进出口/贸易类': `遗失声明\n\n本单位不慎遗失${name}，备案/登记编号：XXX，现声明作废。\n自遗失之日起，该证件一切使用行为均与本单位无关。\n\n特此声明！\n\n声明单位：XXX有限公司\n统一社会信用代码：91XXXXXXXXXXXXXXXX\n日期：XXXX年XX月XX日`,
      '文化/食品/其他类': `遗失声明\n\n本单位不慎遗失${name}，许可证号/证书号：XXX，现声明作废。\n自遗失之日起，该证件一切使用行为均与本单位无关。\n\n特此声明！\n\n声明单位：XXX有限公司\n日期：XXXX年XX月XX日`,
      '交通/特种设备类': `遗失声明\n\n本单位不慎遗失${name}，设备编号/证号：XXX，现声明作废。\n自遗失之日起，该证件一切使用行为均与本单位无关。\n\n特此声明！\n\n声明单位：XXX有限公司\n日期：XXXX年XX月XX日`
    };
    return templates[categoryName] || `遗失声明\n\n本单位不慎遗失${name}，编号：XXX，现声明作废。\n\n特此声明！\n\n声明单位：XXX有限公司\n日期：XXXX年XX月XX日`;
  },

  // 分类列表
  categories: [
    {
      id: 1,
      name: '印章/证照类',
      iconSvg: '/assets/icons/icon-doc-02-generic.svg',
      color: '#5B6FE8',
      docs: [
        { name: '财务监理印鉴章', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '工会章', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '报关章', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '人事专用章', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '安全鉴定专用章', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '检验检疫专用章', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '税务业务专用章', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '银行预留印鉴章', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '印花税票收讫专用章', iconSvg: '/assets/icons/icon-doc-04-generic.svg' },
        { name: '启用新公章的声明', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '印章缴销回执', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '公章更名', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '行政章印章', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '刻章登记卡', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '印章刻制/查询/缴销证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '公章', iconSvg: '/assets/icons/icon-doc-02-generic.svg' },
        { name: '财务章', iconSvg: '/assets/icons/icon-doc-04-generic.svg' },
        { name: '合同章', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '发票章', iconSvg: '/assets/icons/icon-doc-05-generic.svg' },
        { name: '法人章', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '银行印鉴财务章', iconSvg: '/assets/icons/icon-doc-03-generic.svg' }
      ]
    },
    {
      id: 2,
      name: '合同/协议类',
      iconSvg: '/assets/icons/icon-doc-03-generic.svg',
      color: '#5B6FE8',
      docs: [
        { name: '乘用车买卖合同', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '国内游合同', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '土地买卖合同', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '项目资金专户章', iconSvg: '/assets/icons/icon-doc-04-generic.svg' },
        { name: '农村集体经济组织登记证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '工程勘察资质证书', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '工程审图合格证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '商品房预售许可证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '国有建设用地使用权出让合同', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '资金监管协议', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '咨询服务协议', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '独家代理委托协议', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '合同协议', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '租赁合同', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '租房合同', iconSvg: '/assets/icons/icon-doc-03-generic.svg' }
      ]
    },
    {
      id: 3,
      name: '许可证/资质类',
      iconSvg: '/assets/icons/icon-doc-06-generic.svg',
      color: '#5B6FE8',
      docs: [
        { name: '人力资源服务许可证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '食品生产许可证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '医疗器械注册证变更批件', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '危险化学品经营许可证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '保险中介许可证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '快递业务经营许可证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '农药经营许可证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '烟花爆竹零售许可证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '动物诊疗许可证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '建筑施工起重机械登记证', iconSvg: '/assets/icons/icon-doc-07-generic.svg' },
        { name: '水利部三类人员证书', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '建筑业企业资质证书', iconSvg: '/assets/icons/icon-doc-08-generic.svg' },
        { name: '建设工程施工许可证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '办学许可证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '旅行社业务经营许可证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '劳务派遣许可证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '食品经营许可证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '快递经营许可分支名录', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '食品生产/流通/摊贩备案证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' }
      ]
    },
    {
      id: 4,
      name: '票据/凭证类',
      iconSvg: '/assets/icons/icon-doc-05-generic.svg',
      color: '#5B6FE8',
      docs: [
        { name: '工会经费收入专用收据', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '社会团体会费统一票据', iconSvg: '/assets/icons/icon-doc-05-generic.svg' },
        { name: '海关保证金专用收据', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '票据领购证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '银行贷款单/证/卡', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '银保通正本打印纸', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '银行密码单', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '托收凭证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '罚款单', iconSvg: '/assets/icons/icon-doc-04-generic.svg' },
        { name: '借支单', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '税票联', iconSvg: '/assets/icons/icon-doc-05-generic.svg' },
        { name: '住宅专项维修资金专用收据', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '企业贷款卡', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '企业IC卡', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '银行印鉴卡', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '防伪税控盘', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '海关进口增值税专用缴款书', iconSvg: '/assets/icons/icon-doc-03-generic.svg' }
      ]
    },
    {
      id: 5,
      name: '交通/运输类',
      iconSvg: '/assets/icons/icon-doc-09-generic.svg',
      color: '#5B6FE8',
      docs: [
        { name: '客运出租汽车经营证', iconSvg: '/assets/icons/icon-doc-10-4A8CFF.svg' },
        { name: '船舶营运运输证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '船舶内贸营运证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '船舶抵押权登记证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '船舶营业运输证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '重型罐式半挂车', iconSvg: '/assets/icons/icon-doc-09-generic.svg' },
        { name: '重型半挂牵引车', iconSvg: '/assets/icons/icon-doc-09-generic.svg' },
        { name: '道路包车客运经营许可证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '出租汽车经营权使用证书', iconSvg: '/assets/icons/icon-doc-10-4A8CFF.svg' },
        { name: '汽车准运证', iconSvg: '/assets/icons/icon-doc-09-generic.svg' },
        { name: '汽车保养券', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '车辆完税证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '车辆标识卡', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '营运证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '道路运输经营许可证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '车辆证照', iconSvg: '/assets/icons/icon-doc-03-generic.svg' }
      ]
    },
    {
      id: 6,
      name: '建筑/工程类',
      iconSvg: '/assets/icons/icon-doc-07-generic.svg',
      color: '#5B6FE8',
      docs: [
        { name: '建设工程消防验收意见书', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '建设许可证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '规划审批成果图', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '工程勘察资质证书', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '建筑废弃物处置证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '防雷检测证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '建筑废弃物运输船舶信息卡', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '建筑市场诚信登记表', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '二次供水卫生许可证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '混凝土泵车合格证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '钢筋焊接检测报告', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '人防工程质量监督书', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '工程监理资质证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '工程设计资质证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '工程规划许可证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '施工企业材料员证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '建造师证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '结构工程师注册证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '监理工程师资格证书', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '特种设备作业/安全管理证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '建筑废弃物运输车辆标识', iconSvg: '/assets/icons/icon-doc-09-generic.svg' }
      ]
    },
    {
      id: 7,
      name: '营业执照/资质类',
      iconSvg: '/assets/icons/icon-doc-08-generic.svg',
      color: '#5B6FE8',
      docs: [
        { name: '营业执照', iconSvg: '/assets/icons/icon-doc-08-generic.svg' },
        { name: '个体营业执照', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '营业执照（个体工商户）', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '营业执照（未五证合一）', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '民办非企业单位登记证书', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '社会团体法人登记证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '事业单位法人证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '股权证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' }
      ]
    },
    {
      id: 8,
      name: '医疗/医药类',
      iconSvg: '/assets/icons/icon-doc-11-generic.svg',
      color: '#5B6FE8',
      docs: [
        { name: '医疗器械生产/经营许可证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '医疗器械生产企业许可证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '医疗器械经营备案凭证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '药品生产许可证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '药品经营质量管理规范认证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '保健食品经营企业卫生条件审核证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' }
      ]
    },
    {
      id: 9,
      name: '金融/税务类',
      iconSvg: '/assets/icons/icon-doc-04-generic.svg',
      color: '#5B6FE8',
      docs: [
        { name: '银行机构信用代码证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '税务IC卡', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '税收电子转帐专用完税证', iconSvg: '/assets/icons/icon-doc-05-generic.svg' },
        { name: '税收通用完税证', iconSvg: '/assets/icons/icon-doc-05-generic.svg' },
        { name: '税收缴款书', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '外汇登记证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '外债业务登记凭证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '外汇管理局外债登记凭证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '外商投资企业批准证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '台港澳侨投资企业批准证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '开户许可证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '税务登记证（国税/地税）', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '企业贷款卡', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '企业IC卡', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '银行印鉴卡', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '防伪税控盘', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '海关进口增值税专用缴款书', iconSvg: '/assets/icons/icon-doc-03-generic.svg' }
      ]
    },
    {
      id: 10,
      name: '进出口/贸易类',
      iconSvg: '/assets/icons/icon-doc-12-generic.svg',
      color: '#5B6FE8',
      docs: [
        { name: 'FormE产地证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '出入境检验检疫报检企业备案表', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '入境货物检验检疫证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '自理报检单位备案登记证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '报关单位注册登记证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '报关注册登记证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '出口货物报关单', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '出口收汇核销单', iconSvg: '/assets/icons/icon-doc-05-generic.svg' },
        { name: '企业报关注册登记证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '进出口货物收发货人报关注册登记证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '国际货运代理企业备案表', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '对外贸易经营者备案登记表', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '货物进口证/证明书', iconSvg: '/assets/icons/icon-doc-03-generic.svg' }
      ]
    },
    {
      id: 11,
      name: '文化/食品/其他类',
      iconSvg: '/assets/icons/icon-doc-13-generic.svg',
      color: '#5B6FE8',
      docs: [
        { name: '印刷经营许可证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '网络文化经营许可证', iconSvg: '/assets/icons/icon-doc-12-generic.svg' },
        { name: '电影放映许可证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '食品小作坊证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '食品生产许可证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '酒类零售许可证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '渔业捕捞许可证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '采矿许可证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '高危险性体育项目经营许可证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '作品登记证书', icon: '©️' },
        { name: '林木种子生产/经营许可证', iconSvg: '/assets/icons/icon-doc-10-4A8CFF.svg' },
        { name: '特种设备安全许可证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '特种设备安装合格证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '计量器具型式批准证书', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '高新技术企业证书', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '强制产品认证证书', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '特种设备使用登记证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '卫生/公共场所/特种行业许可证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '土地证/房产证/土地承包经营权证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' }
      ]
    },
    {
      id: 12,
      name: '交通/特种设备类',
      iconSvg: '/assets/icons/icon-doc-14-generic.svg',
      color: '#5B6FE8',
      docs: [
        { name: '电梯使用登记证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '电梯定期检验报告', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '特种设备作业证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '特种设备安装监督检验证', iconSvg: '/assets/icons/icon-doc-03-generic.svg' },
        { name: '特种设备注册登记表', iconSvg: '/assets/icons/icon-doc-03-generic.svg' }
      ]
    }
  ],

  // 根据分类ID获取分类信息
  getCategoryById(id) {
    return this.categories.find(c => c.id === id) || null;
  },

  // 根据文档名称查找所属分类
  getCategoryByDoc(docName) {
    for (const cat of this.categories) {
      if (cat.docs.find(d => d.name === docName)) {
        return cat;
      }
    }
    return null;
  },

  // 获取所有证件总数
  getTotalCount() {
    let total = 0;
    for (const cat of this.categories) {
      total += cat.docs.length;
    }
    return total;
  }
};
