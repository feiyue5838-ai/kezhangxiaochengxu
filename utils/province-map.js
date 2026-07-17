/**
 * 省份名称映射工具
 * 后端 province 字段不含"省/市/自治区/特别行政区"后缀
 * 前端 region-data.js 含后缀，需双向转换
 */

const FULL_TO_SHORT = {
  '北京市': '北京',
  '天津市': '天津',
  '上海市': '上海',
  '重庆市': '重庆',
  '河北省': '河北',
  '山西省': '山西',
  '辽宁省': '辽宁',
  '吉林省': '吉林',
  '黑龙江省': '黑龙江',
  '江苏省': '江苏',
  '浙江省': '浙江',
  '安徽省': '安徽',
  '福建省': '福建',
  '江西省': '江西',
  '山东省': '山东',
  '河南省': '河南',
  '湖北省': '湖北',
  '湖南省': '湖南',
  '广东省': '广东',
  '海南省': '海南',
  '四川省': '四川',
  '贵州省': '贵州',
  '云南省': '云南',
  '陕西省': '陕西',
  '甘肃省': '甘肃',
  '青海省': '青海',
  '内蒙古自治区': '内蒙古',
  '广西壮族自治区': '广西',
  '西藏自治区': '西藏',
  '宁夏回族自治区': '宁夏',
  '新疆维吾尔自治区': '新疆',
  '香港特别行政区': '香港',
  '澳门特别行政区': '澳门',
};

// 直辖市列表（它们也是省级行政区，但全称和短名不同）
const SHORT_TO_FULL = {};
for (const [full, short] of Object.entries(FULL_TO_SHORT)) {
  SHORT_TO_FULL[short] = full;
}

const NATIONAL_PROVINCES = ['北京', '天津', '上海', '重庆'];
const MUNICIPALITIES = ['北京市', '天津市', '上海市', '重庆市'];

/**
 * 将全称转短名
 * "四川省" → "四川"，"内蒙古自治区" → "内蒙古"
 */
function toShort(fullName) {
  if (!fullName) return fullName;
  return FULL_TO_SHORT[fullName] || fullName;
}

/**
 * 将短名转全称
 * "四川" → "四川省"，"内蒙古" → "内蒙古自治区"
 * 直辖市特殊处理："北京" → "北京市"
 */
function toFull(shortName) {
  if (!shortName) return shortName;
  if (MUNICIPALITIES.includes(shortName)) return shortName; // 已经是全称
  return SHORT_TO_FULL[shortName] || shortName;
}

/**
 * 根据后端 province 字段过滤报纸
 * 后端返回的 province 是不带"省/市/自治区"后缀的短名
 */
function matchesProvince(paperProvince, selectedProvinceShort) {
  if (!paperProvince) return false;
  // 匹配该省报纸 + 全国性报纸
  return paperProvince === selectedProvinceShort || paperProvince === '全国';
}

module.exports = {
  toShort,
  toFull,
  matchesProvince,
  NATIONAL_PROVINCES,
  MUNICIPALITIES
};
