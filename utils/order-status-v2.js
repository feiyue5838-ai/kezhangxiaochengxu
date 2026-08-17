/**
 * V2.0 订单五维状态 → UI 展示映射（原型文档 2.8）
 * 数据源：后端 orders 表的 order_status / payment_status / fulfillment_status / refund_status
 * 用法：const { label, color, action, step } = orderStatusV2(order);
 */
const ORDER_STEPS = ['支付', '派单', '接单', '制作', '备案', '发货', '签收'];

/**
 * 由五维状态推导 UI 展示状态
 * @param {object} order orders 记录（含 order_status/payment_status/fulfillment_status/refund_status）
 * @returns {{key:string, label:string, color:string, action:string, step:number}}
 */
function orderStatusV2(order) {
  if (!order) return { key: 'unknown', label: '未知', color: '#999', action: '', step: -1 };

  const os = order.order_status;
  const ps = order.payment_status;
  const fs = order.fulfillment_status;
  const rs = order.refund_status;

  // 已取消 / 已关闭
  if (os === 'cancelled') return { key: 'cancelled', label: '已取消', color: '#999', action: '', step: -1 };
  if (os === 'closed') return { key: 'closed', label: '已关闭', color: '#999', action: '', step: -1 };

  // 退款优先展示
  if (rs === 'applying') return { key: 'refunding', label: '退款中', color: '#fa5151', action: '', step: -1 };
  if (rs === 'partial_refund') return { key: 'partial_refund', label: '部分退款', color: '#999', action: '', step: -1 };
  if (rs === 'full_refund') return { key: 'refunded', label: '已退款', color: '#999', action: '', step: -1 };
  if (rs === 'rejected') return { key: 'refund_rejected', label: '退款被拒', color: '#fa5151', action: '', step: -1 };

  // 待支付
  if (ps === 'unpaid' || os === 'pending_payment') {
    return { key: 'pending_payment', label: '待支付', color: '#ff8f1f', action: 'pay', step: 0 };
  }

  // 已完成
  if (os === 'completed') return { key: 'completed', label: '已完成', color: '#07c160', action: '', step: 7 };

  // 履约进度
  const fsMap = {
    pending_assignment: { key: 'pending_assign', label: '待派单', color: '#576b95', action: '', step: 1 },
    assigned: { key: 'assigned', label: '待接单', color: '#576b95', action: '', step: 2 },
    accepted: { key: 'accepted', label: '制作中', color: '#576b95', action: '', step: 3 },
    processing: { key: 'processing', label: '制作中', color: '#576b95', action: '', step: 3 },
    delivering: { key: 'delivering', label: '已发货', color: '#10aeff', action: 'confirm', step: 6 },
    signed: { key: 'signed', label: '待签收', color: '#10aeff', action: 'confirm', step: 6 },
    completed: { key: 'completed', label: '已完成', color: '#07c160', action: '', step: 7 },
  };
  return fsMap[fs] || { key: fs || 'unknown', label: '处理中', color: '#576b95', action: '', step: 3 };
}

/** 履约进度条（原型文档 5.2）：返回当前已完成的步数（0-7） */
function progressStep(order) {
  const st = orderStatusV2(order);
  return st.step;
}

module.exports = {
  ORDER_STEPS,
  orderStatusV2,
  progressStep,
};
