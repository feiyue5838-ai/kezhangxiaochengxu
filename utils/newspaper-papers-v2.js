/**
 * 登报模块 - 报纸数据统一配置
 * 支持省市区二级联动筛选
 * 直辖市特殊处理：城市列表只显示["全市"]
 */

const regionData = require('./region-data.js');

// 直辖市列表
const municipalities = ['北京市', '天津市', '上海市', '重庆市'];

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
    }
  ],

  // 获取省份列表
  getProvinces() {
    return this.provinces;
  },

  // 根据省份获取城市列表（直辖市特殊处理）
  getCitiesByProvince(province) {
    // 直辖市：只显示"全市"
    if (municipalities.includes(province)) {
      return ['全市'];
    }
    return this.cities[province] || [];
  },

  // 获取类型列表
  getTypes() {
    return this.types;
  },

  // 根据省份、城市、类型筛选报纸
  filterPapers(province, city, type) {
    return this.papers.filter(p => {
      // 省份匹配
      const provinceMatch = p.province === province || p.province === '全国性';
      
      // 城市匹配（直辖市的"全市"匹配该直辖市所有报纸）
      const cityMatch = city === '全市' || !p.city || p.city === city;
      
      // 类型匹配
      const typeMatch = type === '全部' || !p.type || p.type === type;
      
      return provinceMatch && cityMatch && typeMatch;
    });
  }
};
