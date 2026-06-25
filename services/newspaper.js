/**
 * 蓉城企服 - 登报服务
 */

const api = require('../utils/api.js');
const util = require('../utils/util.js');

class NewspaperService {
  /**
   * 获取登报列表
   */
  async getList(params = {}) {
    return await api.getNewspaperList(params);
  }
  
  /**
   * 获取分类
   */
  async getCategory() {
    return await api.getNewspaperCategory();
  }
  
  /**
   * 获取模板
   */
  async getTemplate(categoryId) {
    return await api.getNewspaperTemplate(categoryId);
  }
  
  /**
   * 创建订单
   */
  async createOrder(data) {
    return await api.createNewspaperOrder(data);
  }
  
  /**
   * 获取订单列表
   */
  async getOrderList(params = {}) {
    return await api.getNewspaperOrderList(params);
  }
  
  /**
   * 获取订单详情
   */
  async getOrderDetail(id) {
    return await api.getNewspaperOrderDetail(id);
  }
}

module.exports = new NewspaperService();
