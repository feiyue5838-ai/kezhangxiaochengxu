const common = require('../../utils/common.js');

Page({
  data: {
    statusBarHeight: 0,
    openIndex: -1,
    categories: [
      { id: 'order',  name: '订单问题',  icon: '/assets/icons/icon-b64-13.svg' },
      { id: 'pay',    name: '支付问题',  icon: '/assets/icons/icon-b64-14.svg' },
      { id: 'refund', name: '退款售后',  icon: '/assets/icons/icon-b64-16.svg' },
      { id: 'stamp',  name: '印章问题',  icon: '/assets/icons/icon-b64-17.svg' },
      { id: 'paper',  name: '登报问题',  icon: '/assets/icons/icon-b64-7.svg'  },
      { id: 'other',  name: '其他问题',  icon: '/assets/icons/icon-b64-22.svg' },
    ],
    faqs: [
      { id: 'f1', question: '订单提交后多久可以发货？', answer: '一般订单在付款后1-2个工作日内完成制作并发货，节假日顺延。如有加急需求，请联系客服。' },
      { id: 'f2', question: '支持哪些支付方式？', answer: '目前支持微信支付，后续将陆续开放其他支付方式。' },
      { id: 'f3', question: '如何申请退款？', answer: '如需退款，请在订单完成后7天内联系客服申请，服务已开始执行的不支持退款。' },
      { id: 'f4', question: '电子印章具有法律效力吗？', answer: '电子印章与实物印章具有同等的法律效力，符合《电子签名法》相关规定，请放心使用。' },
      { id: 'f5', question: '登报后多久见报？', answer: '一般情况下，提交申请并付款后1-2个工作日内见报。具体见报时间以报纸实际排期为准。' },
      { id: 'f6', question: '可以开具发票吗？', answer: '可以。完成订单后，在「我的」→「发票管理」中申请开具电子发票，发票将在3个工作日内发送至您的邮箱。' },
    ],
  },

  onLoad() {
    const { statusBarHeight } = common.getNavigationHeight();
    this.setData({ statusBarHeight });
  },

  onFaqTap(e) {
    const idx = e.currentTarget.dataset.index;
    this.setData({ openIndex: this.data.openIndex === idx ? -1 : idx });
  },

  onCatTap(e) {
    const cat = e.currentTarget.dataset.id;
    const catNames = { order: '订单问题', pay: '支付问题', refund: '退款售后', stamp: '印章问题', paper: '登报问题', other: '其他问题' };
    wx.showToast({ title: '正在为您解答「' + (catNames[cat] || cat) + '」', icon: 'none' });
    // 实际可跳转至分类详情页
  },

  onCallService() {
    wx.makePhoneCall({ phoneNumber: '4008886666', fail: () => { wx.showToast({ title: '拨打失败', icon: 'none' }); } });
  },


  onBack() {
    wx.navigateBack();
  },
});
