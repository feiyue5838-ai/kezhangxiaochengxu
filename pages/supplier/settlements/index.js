// pages/supplier/settlements/index.js — 供应商结算列表
const api = require('../../../utils/api.js');

const STATUS_TEXT = {
  pending: '待确认',
  confirmed: '已确认',
  paid: '已付款',
  cancelled: '已取消',
};

Page({
  data: {
    list: [],
    total: 0,
    page: 1,
    pageSize: 20,
    loading: false,
    finished: false,
  },

  onLoad() {
    this.loadList(true);
  },

  onPullDownRefresh() {
    this.loadList(true).finally(() => wx.stopPullDownRefresh());
  },

  onReachBottom() {
    if (!this.data.finished && !this.data.loading) {
      this.loadList(false);
    }
  },

  loadList(reset) {
    if (this.data.loading) return Promise.resolve();
    this.setData({ loading: true });
    const page = reset ? 1 : this.data.page + 1;
    return api.v2SupplierSettlements({ page, pageSize: this.data.pageSize })
      .then(res => {
        const list = (res && res.list) || [];
        const mapped = list.map(s => ({
          ...s,
          statusText: STATUS_TEXT[s.status] || s.status || '',
          amountText: s.payableAmount != null ? '¥' + Number(s.payableAmount).toFixed(2) : '',
        }));
        this.setData({
          list: reset ? mapped : this.data.list.concat(mapped),
          total: (res && res.total) || 0,
          page,
          finished: mapped.length < this.data.pageSize,
        });
      })
      .catch(err => {
        console.error('加载结算失败', err);
        if (reset) this.setData({ list: [], finished: true });
      })
      .finally(() => this.setData({ loading: false }));
  },
});
