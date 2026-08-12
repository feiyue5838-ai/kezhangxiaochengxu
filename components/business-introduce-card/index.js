// components/business-introduce-card/index.js
const api = require('../../utils/api.js');
// 小程序端 <image> 不识别相对路径 /uploads/...，必须拼成完整 URL（API_BASE）才能显示
// 复用 api.resolveImage：相对路径拼 API_BASE，http(s) 外链原样返回
function normImg(u) { return api.resolveImage(u); }

Component({
  properties: {
    isPersonal: { type: Boolean, value: false },
    isElectronic: { type: Boolean, value: false }
  },

  data: {
    imageList: [],
    loading: true
  },

  lifetimes: {
    attached() {
      this.loadIntros();
    }
  },

  observers: {
    'isPersonal': function() { this.loadIntros(); },
    'isElectronic': function() { this.loadIntros(); }
  },

  methods: {
    async loadIntros() {
      try {
        // 根据印章类型请求对应业务介绍（personal=个人印章，electronic=电子印章，company=企业刻章）
        const type = this.properties.isElectronic ? 'electronic' : (this.properties.isPersonal ? 'personal' : 'company');
        const res = await api.getIntros(type);
        // 解析数据：res 可能是数组或 {list: [...]}
        const list = Array.isArray(res) ? res : (res.list || []);
        // 过滤启用的记录（type=all + 指定类型的已在后端过滤）
        const images = list.filter(item => item.status === 1 && item.image).map(item => normImg(item.image));
        this.setData({ imageList: images, loading: false });
      } catch (e) {
        console.error('加载业务介绍失败:', e);
        // 失败时回退到本地默认图片
        this.setData({
          imageList: this.properties.isPersonal
            ? ['/assets/images/business-intro-1.jpg', '/assets/images/business-intro-2.jpg']
            : ['/assets/images/business-intro-1.jpg'],
          loading: false
        });
      }
    },

    onImagePreview(e) {
      const src = e.currentTarget.dataset.src;
      wx.previewImage({ urls: this.data.imageList, current: src });
    }
  }
});
