/**
 * 蓉城企服 - 在线刻章
 */

const api = require('../utils/api.js');
const util = require('../utils/util.js');

class SealService {
  /**
   * 获取刻章列表
   */
  async getList(params = {}) {
    return await api.getSealList(params);
  }
  
  /**
   * 获取刻章详情
   */
  async getDetail(id) {
    return await api.getSealDetail(id);
  }
  
  /**
   * 创建刻章订单
   */
  async createOrder(data) {
    return await api.createSealOrder(data);
  }
  
  /**
   * 获取订单列表
   */
  async getOrderList(params = {}) {
    return await api.getSealOrderList(params);
  }
  
  /**
   * 获取订单详情
   */
  async getOrderDetail(id) {
    return await api.getSealOrderDetail(id);
  }
  
  /**
   * 取消订单
   */
  async cancelOrder(id) {
    // 需要后端接口支持
    util.showToast('请联系客服取消订单');
  }
}

module.exports = new SealService();