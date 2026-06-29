// 测试导航栏高度计算
const common = require('../../../utils/common.js');

Page({
  data: {
    statusBarHeight: 0,
    navHeight: 0,
    navCalcResult: ''
  },
  
  onLoad() {
    const navCalc = common.getNavigationHeight();
    console.log('=== 导航栏高度计算测试 ===');
    console.log('statusBarHeight:', navCalc.statusBarHeight);
    console.log('navHeight:', navCalc.navHeight);
    console.log('========================');
    
    this.setData({
      statusBarHeight: navCalc.statusBarHeight,
      navHeight: navCalc.navHeight,
      navCalcResult: `statusBarHeight=${navCalc.statusBarHeight}, navHeight=${navCalc.navHeight}`
    });
  }
});
