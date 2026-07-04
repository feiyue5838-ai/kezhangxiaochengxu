/**
 * 登报模块 - 报纸数据统一配置
 * 支持省市区二级联动筛选
 */

const regionData = require('./region-data.js');

module.exports = {

  // 使用最新省市区数据
  provinces: regionData.provinces,
  cities: regionData.cities,

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
      province: '四川省',
      city: '成都市',
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
      province: '四川省',
      city: '成都市',
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
      province: '四川省',
      city: '成都市',
      type: '科技'
    }
  ],

  // 获取省份列表
  getProvinces() {
    return this.provinces;
  },

  // 根据省份获取城市列表
  getCitiesByProvince(province) {
    return this.cities[province] || [];
  },

  // 获取类型列表
  getTypes() {
    return this.types;
  },

  // 根据省份、城市、类型筛选报纸
  filterPapers(province, city, type) {
    return this.papers.filter(p => {
      const provinceMatch = p.province === province || p.province === '全国性';
      const cityMatch = !p.city || p.city === city;
      const typeMatch = !p.type || p.type === type || type === '全部';
      return provinceMatch && cityMatch && typeMatch;
    });
  }
};
