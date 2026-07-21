/**
 * 登报分类配置 - 统一数据源
 */
module.exports = {

  // 中文字符串 -> ID 的快速映射
  nameToId: {
    '身份证挂失': 1, '个人证件': 2, '企业证件': 3, '发票收据': 4,
    '声明公告': 5, '公告声明': 6, '法院公告': 7, '政府送达': 8,
    '债权债务': 9, '解除劳动': 10, '环评公示': 11, '拍卖公告': 12,
    '登报道歉': 13, '表扬信': 14, '宣传稿': 15,
    '招标公告': 16
  },

  list: [
    { id: 1,  name: '身份证挂失', iconSvg: '/assets/icons/icon-cat-idcard.svg', bgColor: '#5B6FE8',  route: '/pages/newspaper/idcard-page/index' },
    { id: 2,  name: '个人证件',   iconSvg: '/assets/icons/icon-cat-personal.svg', bgColor: '#FA8C16',  route: '/pages/newspaper/personal-docs/index' },
    { id: 3,  name: '企业证件',   iconSvg: '/assets/icons/icon-cat-company.svg', bgColor: '#52C41A', route: '/pages/newspaper/company-docs/index' },
    { id: 4,  name: '发票收据',   iconSvg: '/assets/icons/icon-cat-invoice.svg', bgColor: '#9BA8FF',  route: '/pages/newspaper/invoice-receipt/index' },
    { id: 5,  name: '声明公告',    iconSvg: '/assets/icons/icon-cat-announcement.svg', bgColor: '#F5222D',  route: '/pages/newspaper/announcement/index' },
    { id: 6,  name: '公告声明',    iconSvg: '/assets/icons/icon-cat-announcement.svg', bgColor: '#F5222D',  route: '/pages/newspaper/announcement/index' },
    { id: 7,  name: '法院公告',    iconSvg: '/assets/icons/icon-cat-court.svg', bgColor: '#F5222D',  route: '/pages/newspaper/court/index' },
    { id: 8,  name: '政府送达',    iconSvg: '/assets/icons/icon-cat-government.svg', bgColor: '#7B8FF7',  route: '/pages/newspaper/government/index' },
    { id: 9,  name: '债权债务',    iconSvg: '/assets/icons/icon-cat-creditor.svg', bgColor: '#FAAD14',  route: '/pages/newspaper/creditor/index' },
    { id: 10, name: '解除劳动',   iconSvg: '/assets/icons/icon-cat-labor.svg', bgColor: '#5B6FE8',  route: '/pages/newspaper/labor-dispute/index' },
    { id: 11, name: '环评公示',    iconSvg: '/assets/icons/icon-cat-env.svg', bgColor: '#0FCB7D',  route: '/pages/newspaper/env-assessment/index' },
    { id: 12, name: '拍卖公告',   iconSvg: '/assets/icons/icon-cat-auction.svg', bgColor: '#F5222D',  route: '/pages/newspaper/auction/index' },
    { id: 13, name: '登报道歉',    iconSvg: '/assets/icons/icon-cat-apology.svg', bgColor: '#5B6FE8',  route: '/pages/newspaper/apology/index' },
    { id: 14, name: '表扬信',      iconSvg: '/assets/icons/icon-cat-praise.svg', bgColor: '#5B6FE8',  route: '/pages/newspaper/praise/index' },
    { id: 15, name: '宣传稿',      iconSvg: '/assets/icons/icon-cat-press.svg', bgColor: '#5B6FE8',  route: '/pages/newspaper/publicity/index' },
    { id: 16, name: '招标公告',    iconSvg: '/assets/icons/icon-cat-bidding.svg', bgColor: '#5B6FE8',  route: '/pages/newspaper/bidding/index' },
  ],

  // 根据 ID 查找分类
  getById(id) {
    return this.list.find(c => String(c.id) === String(id)) || null;
  },

  // 统一路由函数：支持数字 ID 或中文字符串
  getRoute(id) {
    if (typeof id === 'string' && this.nameToId[id] !== undefined) {
      id = this.nameToId[id];
    }
    var cat = this.getById(id);
    if (!cat) return null;
    if (id >= 5) return cat.route + '?id=' + id;
    return cat.route;
  },

  // 按分类名称获取路由
  getRouteByName(name) {
    var id = this.nameToId[name];
    if (id === undefined) return null;
    var cat = this.getById(id);
    if (!cat) return null;
    if (id >= 5) return cat.route + '?id=' + id;
    return cat.route;
  }
};
