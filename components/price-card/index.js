// components/price-card/index.js
// 价格明细卡片组件，替代原来各页面中重复的 price-card 代码块
Component({
  properties: {
    // 计费参数（由父页面传入）
    basePrice: { type: Number, value: 98 },
    charCount: { type: Number, value: 0 },
    layoutFee:  { type: Number, value: 20 }
  },
  data: {
    total: 0
  },
  observers: {
    'basePrice,charCount,layoutFee': function (base, chars, fee) {
      this.setData({ total: Math.round(base + chars * 1.5 + fee) });
    }
  },
  methods: {
    /** 供父页面获取当前总价 */
    getTotal: function () { return this.data.total; }
  }
});
