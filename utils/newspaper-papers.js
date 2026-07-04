/**
 * 登报模块 - 报纸数据统一配置
 * 替代各处重复定义的报纸列表
 */
module.exports = {

  // 地域分类
  regions: ['全部', '四川', '西南', '全国'],

  // 报纸类型分类
  types: ['全部', '综合', '经济', '科技', '法制', '都市'],

  // 报纸列表
  papers: [
    {
      id: 'sichuan-jingji',
      name: '四川经济日报',
      price: 128,
      desc: '四川省最具影响力的经济类报纸',
      logoText: '川',
      tag: '热门',
      logoColor: '#5B6FE8',
      logoColorEnd: '#7B8FF7',
      region: '四川',
      type: '经济'
    },
    {
      id: 'huaxi',
      name: '华西都市报',
      price: 158,
      desc: '中国第一张都市报发行量领先',
      logoText: '华',
      tag: '推荐',
      logoColor: '#FA8C16',
      logoColorEnd: '#FFD666',
      region: '四川',
      type: '都市'
    },
    {
      id: 'sichuan-keji',
      name: '四川科技报',
      price: 108,
      desc: '四川省科协主管权威科普日报',
      logoText: '科',
      tag: null,
      logoColor: '#52C41A',
      logoColorEnd: '#95DE64',
      region: '四川',
      type: '科技'
    },
    {
      id: 'sichuan-gongren',
      name: '四川工人日报',
      price: 98,
      desc: '四川省总工会机关报覆盖广泛',
      logoText: '工',
      tag: '性价比',
      logoColor: '#13C2C2',
      logoColorEnd: '#5CDBD3',
      region: '四川',
      type: '综合'
    },
    {
      id: 'sichuan-ribao',
      name: '四川日报',
      price: 188,
      desc: '中共四川省委机关报权威发布',
      logoText: '四',
      tag: '权威',
      logoColor: '#722ED1',
      logoColorEnd: '#B37FEB',
      region: '四川',
      type: '综合'
    },
    {
      id: 'xinan-shangbao',
      name: '西南商报',
      price: 138,
      desc: '立足西南辐射全国的综合性日报',
      logoText: '商',
      tag: null,
      logoColor: '#EB2F96',
      logoColorEnd: '#F759AB',
      region: '西南',
      type: '经济'
    },
    {
      id: 'qiyejia-ribao',
      name: '企业家日报',
      price: 148,
      desc: '面向企业家的专业财经日报',
      logoText: '企',
      tag: null,
      logoColor: '#F5222D',
      logoColorEnd: '#FF7875',
      region: '全国',
      type: '经济'
    },
    {
      id: 'wenzhai-zhoubao',
      name: '文摘周报',
      price: 118,
      desc: '全国性综合文摘类报纸影响力强',
      logoText: '摘',
      tag: null,
      logoColor: '#FAAD14',
      logoColorEnd: '#FFE58F',
      region: '全国',
      type: '综合'
    },
    {
      id: 'renli-ziyuan',
      name: '人力资源报',
      price: 108,
      desc: '人力资源和社会保障部主管专业报',
      logoText: '人',
      tag: null,
      logoColor: '#2F54EB',
      logoColorEnd: '#85A5FF',
      region: '全国',
      type: '综合'
    },
    {
      id: 'jinrong-touzi',
      name: '金融投资报',
      price: 136,
      desc: '专注金融投资领域的专业财经报',
      logoText: '融',
      tag: null,
      logoColor: '#1890FF',
      logoColorEnd: '#69C0FF',
      region: '四川',
      type: '经济'
    },
    {
      id: 'chengdu-ribao',
      name: '成都日报',
      price: 168,
      desc: '中共成都市委机关报区域权威',
      logoText: '蓉',
      tag: '本地',
      logoColor: '#A0D911',
      logoColorEnd: '#D3F261',
      region: '四川',
      type: '综合'
    },
    {
      id: 'chengdu-shangbao',
      name: '成都商报',
      price: 146,
      desc: '西南地区发行量最大综合日报',
      logoText: '商',
      tag: '本地',
      logoColor: '#8C8C8C',
      logoColorEnd: '#BFBFBF',
      region: '四川',
      type: '都市'
    }
  ],

  // 报纸版本（用于身份证登报等场景）
  versions: [
    {
      version: '市州级版',
      name: '四川法制报市州级版',
      price: 98,
      icon: '1',
      cls: 'orange'
    },
    {
      version: '省级版',
      name: '四川法制报省级版',
      price: 128,
      icon: '2',
      cls: 'blue'
    },
    {
      version: '国家级版',
      name: '人民日报国家级版',
      price: 158,
      icon: '3',
      cls: 'green'
    },
    {
      version: '特区级版',
      name: '香港文汇报特区版',
      price: 198,
      icon: '4',
      cls: 'purple'
    }
  ],

  // 根据ID获取报纸
  getPaperById(id) {
    return this.papers.find(p => p.id === id) || null;
  },

  // 获取所有报纸
  getAllPapers() {
    return this.papers;
  },

  // 获取所有版本
  getAllVersions() {
    return this.versions;
  },

  // 获取地域列表
  getRegions() {
    return this.regions;
  },

  // 获取类型列表
  getTypes() {
    return this.types;
  },

  // 根据地域和类型筛选报纸
  filterPapers(region, type) {
    return this.papers.filter(p => {
      const regionMatch = region === '全部' || p.region === region;
      const typeMatch = type === '全部' || p.type === type;
      return regionMatch && typeMatch;
    });
  },

  // 计算价格
  calculatePrice(paperId, charCount, issueCount) {
    const paper = this.getPaperById(paperId);
    if (!paper) {
      return { publishFee: 0, totalPrice: 0 };
    }

    // 基础版面费 + 超字数加收费用
    const baseChars = 20; // 包含字数
    const basePrice = paper.price; // 基础价
    const pricePerChar = Math.round(paper.price / 10); // 每超出10字加收价/10的费用

    let publishFee = basePrice;
    if (charCount > baseChars) {
      publishFee += (charCount - baseChars) * pricePerChar;
    }

    // 叠加期数费用
    publishFee = publishFee * issueCount;

    // 合计（只包含刊登费用）
    const total = publishFee;

    return {
      publishFee: Math.round(publishFee),
      totalPrice: Math.round(total)
    };
  }
};
