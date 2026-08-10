// 订单状态 文本/样式 单一事实源
// 必须与后端 src/common/constants/order-status.ts 的 ORDER_STATUS_TEXT 完全一致
// 1=待支付 2=已支付 3=制作中 4=已发货 5=已完成 6=已取消 7=售后中 8=退款中 9=已退款
const ORDER_STATUS_TEXT = {
  1: '待支付', 2: '已支付', 3: '制作中', 4: '已发货', 5: '已完成', 6: '已取消', 7: '售后中', 8: '退款中', 9: '已退款',
};
const ORDER_STATUS_CLASS = {
  1: { status: 'pending', cls: 'pending' }, 2: { status: 'processing', cls: 'processing' },
  3: { status: 'processing', cls: 'processing' }, 4: { status: 'shipped', cls: 'completed' },
  5: { status: 'completed', cls: 'completed' }, 6: { status: 'cancelled', cls: 'cancelled' },
  7: { status: 'aftersale', cls: 'aftersale' }, 8: { status: 'refunding', cls: 'refunding' }, 9: { status: 'refunded', cls: 'refunded' },
};
function getOrderStatusText(s){ return ORDER_STATUS_TEXT[s] || '待支付'; }
module.exports = { ORDER_STATUS_TEXT, ORDER_STATUS_CLASS, getOrderStatusText };
