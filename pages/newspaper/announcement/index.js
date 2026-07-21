// pages/newspaper/announcement/index.js
const common = require('../../../utils/common.js');
const announcementConfig = require('../../../utils/announcement.js');
const api = require('../../../utils/api.js');

// API 返回的模板按 templateType 分组
// 结构：{ id, name, desc, color, hot, total, docs: [{ name, content, desc }] }
// fallback：使用 announcement.js 的 CATEGORIES
let categoriesFromApi = null

Page({
  data: {
    selectedCategory: '',
    categories: announcementConfig.categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      desc: cat.desc,
      color: cat.color,
      hot: cat.hot,
      items: cat.docs
    })),
    pickedIndex: -1,
    pickedItems: [],
    showDocPicker: false,
    searchKey: '',
    loading: false,
    useApi: false, // 是否使用了 API 数据
  },

  onLoad() {
    this._loadFromApi()
  },

  async _loadFromApi() {
    this.setData({ loading: true })
    try {
      const res = await api.getAnnouncementTemplates()
      if (Array.isArray(res) && res.length > 0) {
        categoriesFromApi = res
        const cats = res.map(g => ({
          id: g.id,
          name: g.name,
          desc: g.desc,
          color: g.color,
          hot: g.hot,
          items: g.docs.map(d => ({ name: d.name, content: d.content, desc: d.desc || '' }))
        }))
        this.setData({ categories: cats, loading: false, useApi: true })
        return
      }
    } catch (e) {
      console.warn('[announcement] API 调用失败，使用前端硬编码兜底', e)
    }
    this.setData({ loading: false })
  },

  goBack() {
    wx.navigateBack()
  },

  selectTemplate(e) {
    const { id } = e.currentTarget.dataset
    const idx = this.data.categories.findIndex(c => c.id === id)
    const cat = this.data.categories[idx]
    this.setData({
      selectedCategory: id,
      pickedIndex: idx,
      pickedItems: cat.items || [],
      showDocPicker: true,
      searchKey: ''
    })
  },

  closeDocPicker() {
    this.setData({ showDocPicker: false, searchKey: '' })
  },

  onSearch(e) {
    const v = e.detail.value.trim().toLowerCase()
    const cat = this.data.categories[this.data.pickedIndex]
    if (!v) {
      this.setData({ searchKey: '', pickedItems: cat.items || [] })
      return
    }
    const filtered = (cat.items || []).filter(d => d.name.toLowerCase().includes(v))
    this.setData({ searchKey: e.detail.value, pickedItems: filtered })
  },

  selectItem(e) {
    const { name } = e.currentTarget.dataset
    const { pickedIndex, categories } = this.data
    const cat = categories[pickedIndex]
    if (!name || !cat) return

    const item = (cat.items || []).find(d => d.name === name)
    if (!item) return

    // API 有 content 用 API content，无则 fallback 到规则生成
    const content = (item.content && item.content.trim())
      ? item.content
      : announcementConfig.generateContent(name)

    wx.setStorageSync('newspaperTemplate', {
      name: item.name,
      content,
      businessType: '公告声明',
      category: cat.name,
      _timestamp: Date.now()
    })
    wx.setStorageSync('formPageNavData', {
      type: '公告声明',
      docName: item.name,
      categoryName: cat.name,
      itemName: item.name,
      _timestamp: Date.now()
    })

    this.setData({ showDocPicker: false }, () => {
      wx.navigateTo({ url: '/pages/newspaper/content-edit/index' })
    })
  }
})
