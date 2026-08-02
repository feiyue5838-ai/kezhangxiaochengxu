// components/template-select-grid/index.js
Component({
  properties: {
    // 模板列表
    templates: {
      type: Array,
      value: []
    },
    // 当前选中的模板ID
    selectedId: {
      type: String,
      value: ''
    },
    // 是否显示预览
    showPreview: {
      type: Boolean,
      value: true
    }
  },

  data: {
    previewContent: ''
  },

  observers: {
    'selectedId': function(_id) {
      // 延迟执行，确保组件已完全初始化
      if (this._updatePreview) {
        this._updatePreview();
      }
    },
    'templates': function() {
      if (this._updatePreview) {
        this._updatePreview();
      }
    }
  },

  lifetimes: {
    ready() {
      // 组件就绪后执行一次预览更新
      this._updatePreview();
    }
  },

  methods: {
    // 选中模板
    selectTemplate(e) {
      const id = e.currentTarget.dataset.id;
      this.triggerEvent('select', { id });
    },

    // 更新预览内容
    _updatePreview() {
      const { templates, selectedId } = this.data;
      const template = templates.find(t => t.id === selectedId);
      if (template) {
        this.setData({ previewContent: template.content });
      } else {
        this.setData({ previewContent: '' });
      }
    },

    // 获取当前选中的模板
    getSelectedTemplate() {
      const { templates, selectedId } = this.data;
      return templates.find(t => t.id === selectedId) || null;
    }
  }
});
