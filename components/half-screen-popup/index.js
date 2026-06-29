// components/half-screen-popup/index.js
Component({
  properties: {
    title: { type: String, value: '个体户' },
    // 来源页面导航栏标题，用于弹窗顶部导航显示（如"个人印章"）
    sourceTitle: { type: String, value: '印章预览' }
  },

  data: {
    statusBarHeight: 20,
    topPreviewHeight: 420, // 上半屏高度（64 导航 + 356 内容区），动态计算覆盖
    visible: false,
    show: false,
    selectedIds: [],
    selectedSealImg: '',
    selectedSealName: '',
    selectedSealDesc: '',
    previewSeals: [],
    previewCurrent: 0,

    // 印章用途描述映射
    sealDescMap: {
      s26: '个人签名章，适用于个人文件签署',
      s27: '适用于拆迁协议、买房合同签署',
      s28: '适用于公证处公证文件',
      s29: '适用于企业内部员工身份证明',
      s30: '一级造价工程师执业印章',
      s31: '一级注册建造师执业印章',
      s32: '一级注册结构工程师执业印章',
      s33: '注册监理工程师执业印章',
      s34: '二级注册建筑师执业印章',
      s35: '电气工程师执业印章',
      s36: '房地产评估师执业印章',
      s37: '会计师执业印章',
      s38: '项目经理执业印章',
      s39: '二级造价工程师执业印章',
      s40: '二级注册建造师执业印章',
      s41: '二级注册结构工程师执业印章',
      s42: '一级注册建筑师执业印章',
      s43: '土木工程师执业印章',
      s44: '化工工程师执业印章',
      s45: '执业律师执业印章',
      s46: '税务师执业印章',
      s47: '其他职业印章（请在下单时备注）'
    },

    // 筛选后数据
    filteredSingleSeals: [],
    filteredPackages: [],

    // 全部原始数据
    singleSeals: [
      { id: 's1', name: '财务章', img: '/assets/images/seal-caiwuzhang.svg' },
      { id: 's2', name: '公章', img: '/assets/images/seal-gongzhang.svg' },
      { id: 's3', name: '合同章', img: '/assets/images/seal-hetongzhang.svg' },
      { id: 's4', name: '法人章', img: '/assets/images/seal-farenzhang.svg' },
      { id: 's5', name: '发票章', img: '/assets/images/seal-fapiaozhang.svg' },
      { id: 's6', name: '中英文公章', img: '/assets/images/seal-gongzhang-en.svg' },
      { id: 's7', name: '中英文合同章', img: '/assets/images/seal-hetongzhang-en.svg' },
      { id: 's8', name: '手动钢印章', img: '/assets/images/seal-gang-yinshang.svg' },
      { id: 's9', name: '自动钢印章', img: '/assets/images/seal-gang-yinshang.svg' },
      { id: 's10', name: '业务专用章', img: '/assets/images/seal-gang-yinshang.svg' },
      { id: 's11', name: '销售合同章', img: '/assets/images/seal-gang-yinshang.svg' },
      { id: 's12', name: '发货专用章', img: '/assets/images/seal-gang-yinshang.svg' },
      { id: 's13', name: '技术专用章', img: '/assets/images/seal-gang-yinshang.svg' },
      { id: 's14', name: '质检章', img: '/assets/images/seal-gang-yinshang.svg' },
      { id: 's15', name: '收据专用章', img: '/assets/images/seal-gang-yinshang.svg' },
      { id: 's16', name: '委员会章', img: '/assets/images/seal-gang-yinshang.svg' },
      { id: 's17', name: '生产办公室章', img: '/assets/images/seal-gang-yinshang.svg' },
      { id: 's18', name: '人事专用章', img: '/assets/images/seal-gang-yinshang.svg' },
      { id: 's19', name: '授权专用章', img: '/assets/images/seal-gang-yinshang.svg' },
      { id: 's20', name: '资质专用章', img: '/assets/images/seal-gang-yinshang.svg' },
      { id: 's21', name: '质量管理部章', img: '/assets/images/seal-gang-yinshang.svg' },
      { id: 's22', name: '项目章', img: '/assets/images/seal-gang-yinshang.svg' },
      { id: 's23', name: '办事机构印章', img: '/assets/images/seal-gang-yinshang.svg' },
      { id: 's24', name: '组委会章', img: '/assets/images/seal-gang-yinshang.svg' },
      { id: 's25', name: '其他章(下单备注章名)', img: '/assets/images/seal-gang-yinshang.svg' },
      { id: 's26', name: '个人签名章', img: '/assets/images/seal-farenzhang.svg' },
      { id: 's27', name: '拆迁、买房使用', img: '/assets/images/seal-farenzhang.svg' },
      { id: 's28', name: '公证使用', img: '/assets/images/seal-farenzhang.svg' },
      { id: 's29', name: '企业员工使用', img: '/assets/images/seal-farenzhang.svg' },
      { id: 's30', name: '一级造价工程师', img: '/assets/images/seal-gang-yinshang.svg' },
      { id: 's31', name: '一级注册建造师', img: '/assets/images/seal-gang-yinshang.svg' },
      { id: 's32', name: '一级注册结构工程师', img: '/assets/images/seal-gang-yinshang.svg' },
      { id: 's33', name: '注册监理工程师', img: '/assets/images/seal-gang-yinshang.svg' },
      { id: 's34', name: '二级注册建筑师', img: '/assets/images/seal-gang-yinshang.svg' },
      { id: 's35', name: '电气工程师', img: '/assets/images/seal-gang-yinshang.svg' },
      { id: 's36', name: '房地产评估师', img: '/assets/images/seal-gang-yinshang.svg' },
      { id: 's37', name: '会计师', img: '/assets/images/seal-gang-yinshang.svg' },
      { id: 's38', name: '项目经理', img: '/assets/images/seal-gang-yinshang.svg' },
      { id: 's39', name: '二级造价工程师', img: '/assets/images/seal-gang-yinshang.svg' },
      { id: 's40', name: '二级注册建造师', img: '/assets/images/seal-gang-yinshang.svg' },
      { id: 's41', name: '二级注册结构工程师', img: '/assets/images/seal-gang-yinshang.svg' },
      { id: 's42', name: '一级注册建筑师', img: '/assets/images/seal-gang-yinshang.svg' },
      { id: 's43', name: '土木工程师', img: '/assets/images/seal-gang-yinshang.svg' },
      { id: 's44', name: '化工工程师', img: '/assets/images/seal-gang-yinshang.svg' },
      { id: 's45', name: '执业律师', img: '/assets/images/seal-gang-yinshang.svg' },
      { id: 's46', name: '税务师', img: '/assets/images/seal-gang-yinshang.svg' },
      { id: 's47', name: '其他(下单请备注章名）', img: '/assets/images/seal-gang-yinshang.svg' },
      // 电子印章有效期选项
      { id: 'e1y', name: '一年有效期(不限次数)', img: '' },
      { id: 'e2y', name: '两年有效期(不限次数)', img: '' },
      { id: 'e3y', name: '三年有效期(不限次数)', img: '' },
      { id: 'e4y', name: '四年有效期(不限次数)', img: '' },
      { id: 'e5y', name: '五年有效期(不限次数)', img: '' }
    ],
    packages: [
      { id: 'p1', name: '公章、财务章、法人章', badge: '特惠', seals: ['s2', 's1', 's4'] },
      { id: 'p2', name: '公章、财务章、发票章、法人章', badge: '特惠', seals: ['s2', 's1', 's5', 's4'] },
      { id: 'p3', name: '公章、发票章、财务章', badge: '特惠', seals: ['s2', 's5', 's1'] },
      { id: 'p4', name: '公章、财务章、合同章', badge: '特惠', seals: ['s2', 's1', 's3'] },
      { id: 'p5', name: '公章、合同章、发票章', badge: '特惠', seals: ['s2', 's3', 's5'] },
      { id: 'p6', name: '公章、财务章、发票章、合同章', badge: '特惠', seals: ['s2', 's1', 's5', 's3'] },
      { id: 'p7', name: '公章、财务章、发票章、合同章、法人章', badge: '特惠', seals: ['s2', 's1', 's5', 's3', 's4'] }
    ],

    // 当前业务类型ID，0=全部
    currentCategoryId: 0,

    // 各类型印章筛选规则
    categoryFilters: {
      // 个体户：公章/财务章/发票章/合同章/法人章/中英文公章/中英文合同章 + 7个套餐
      1: {
        singleSeals: ['s2', 's1', 's5', 's3', 's4', 's6', 's7'],
        packages: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7']
      },
      // 公司：同个体户
      2: {
        singleSeals: ['s2', 's1', 's5', 's3', 's4', 's6', 's7'],
        packages: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7']
      },
      // 新成立开户必备章：公章/财务章/法人章 + 3个套餐
      3: {
        singleSeals: ['s2', 's1', 's4'],
        packages: ['p1', 'p2', 'p7']
      },
      // 单位名称变更必备章：仅2个套餐
      4: {
        singleSeals: [],
        packages: ['p1', 'p6']
      },
      // 单位法人变更必备章：仅法人章
      5: {
        singleSeals: ['s4'],
        packages: []
      },
      // 政府事业单位：公章/财务章/发票章/合同章/法人章/中英文公章/中英文合同章 + 6个套餐
      6: {
        singleSeals: ['s2', 's1', 's5', 's3', 's4', 's6', 's7'],
        packages: ['p1', 'p3', 'p4', 'p5', 'p6', 'p7']
      },
      // 钢印章：手动钢印章 + 自动钢印章
      7: {
        singleSeals: ['s8', 's9'],
        packages: []
      },
      // 其他章名：16种专用章
      8: {
        singleSeals: ['s10','s11','s12','s13','s14','s15','s16','s17','s18','s19','s20','s21','s22','s23','s24','s25'],
        packages: []
      },
      // 个人印章：个人签名章/拆迁买房/公证/企业员工
      9: {
        singleSeals: ['s26', 's27', 's28', 's29'],
        packages: []
      },
      // 个人职业章：18种职业章
      10: {
        singleSeals: ['s30','s31','s32','s33','s34','s35','s36','s37','s38','s39','s40','s41','s42','s43','s44','s45','s46','s47'],
        packages: []
      },
      // 电子印章-财务章
      11: {
        singleSeals: ['e1y', 'e2y', 'e3y', 'e4y', 'e5y'],
        packages: []
      },
      // 电子印章-公章
      12: {
        singleSeals: ['e1y', 'e2y', 'e3y', 'e4y', 'e5y'],
        packages: []
      },
      // 电子印章-合同章
      13: {
        singleSeals: ['e1y', 'e2y', 'e3y', 'e4y', 'e5y'],
        packages: []
      },
      // 电子印章-法人章
      14: {
        singleSeals: ['e1y', 'e2y', 'e3y', 'e4y', 'e5y'],
        packages: []
      },
      // 电子印章-发票章
      15: {
        singleSeals: ['e1y', 'e2y', 'e3y', 'e4y', 'e5y'],
        packages: []
      },
      // 电子印章-个人签名章
      16: {
        singleSeals: ['e1y', 'e2y', 'e3y', 'e4y', 'e5y'],
        packages: []
      },
      // 电子印章-其他印章
      17: {
        singleSeals: ['e1y', 'e2y', 'e3y', 'e4y', 'e5y'],
        packages: []
      }
    }
  },

  lifetimes: {
    attached() {
      const sys = wx.getSystemInfoSync();
      const statusBarHeight = sys.statusBarHeight;
      // 上半屏预览内容区高度（导航栏64px已独立为固定元素，在顶部）
      const topPreviewHeight = Math.round(380 / 750 * sys.windowWidth);
      this.setData({ statusBarHeight, topPreviewHeight });
    }
  },

  methods: {
    // 根据类型筛选印章数据
    _applyFilter(catId) {
      const filter = this.data.categoryFilters[catId];
      const selectedIds = this.data.selectedIds;
      const isSelected = id => selectedIds.indexOf(id) !== -1;
      if (filter) {
        const singleSeals = filter.singleSeals === 'all' ? this.data.singleSeals : this.data.singleSeals.filter(s => filter.singleSeals.indexOf(s.id) !== -1);
        const packages = filter.packages === 'all' ? this.data.packages : this.data.packages.filter(p => filter.packages.indexOf(p.id) !== -1);
        this.setData({
          filteredSingleSeals: singleSeals.map(s => ({ ...s, selected: isSelected(s.id) })),
          filteredPackages: packages.map(p => ({ ...p, selected: isSelected(p.id) })),
          currentCategoryId: catId
        });
      } else {
        this.setData({
          filteredSingleSeals: this.data.singleSeals.map(s => ({ ...s, selected: isSelected(s.id) })),
          filteredPackages: this.data.packages.map(p => ({ ...p, selected: isSelected(p.id) })),
          currentCategoryId: 0
        });
      }
    },

    // 打开弹窗（默认，显示全部）
    open() {
      this._applyFilter(0);
      this.setData({ visible: true });
      setTimeout(() => { this.setData({ show: true }); }, 30);
    },

    // 打开弹窗并指定业务类型
    openWithCategory(catId) {
      this._applyFilter(catId);
      this.setData({ visible: true });
      setTimeout(() => { this.setData({ show: true }); }, 30);
    },

    close() {
      this.setData({ show: false });
      setTimeout(() => {
        this.setData({
          visible: false,
          selectedIds: [],
          selectedSealImg: '',
          selectedSealName: '',
          selectedSealDesc: '',
          previewSeals: [],
          previewCurrent: 0
        });
      }, 300);
    },

    onMaskTap() { this.close(); },
    onClose() { this.close(); },
    preventClose() {},

    onPreviewTap() {
      this.setData({ selectedSealImg: '', selectedSealName: '', selectedSealDesc: '', previewSeals: [], previewCurrent: 0 });
    },

    onSwiperChange(e) {
      this.setData({ previewCurrent: e.detail.current });
    },

    onSelect(e) {
      const { id } = e.currentTarget.dataset;
      const ids = [...this.data.selectedIds];
      const idx = ids.indexOf(id);
      if (idx === -1) {
        ids.push(id);
      } else {
        ids.splice(idx, 1);
      }
      this.setData({ selectedIds: ids });
      // 更新列表选中状态
      const isSelected = sid => ids.indexOf(sid) !== -1;
      this.setData({
        filteredSingleSeals: this.data.filteredSingleSeals.map(s => ({ ...s, selected: isSelected(s.id) })),
        filteredPackages: this.data.filteredPackages.map(p => ({ ...p, selected: isSelected(p.id) }))
      });
      this._updatePreview();
    },

    _resolveSealDesc(ids) {
      if (!ids || !ids.length) return '';
      const id = ids[0];
      return this.data.sealDescMap[id] || '';
    },


    _updatePreview() {
      const all = this.data.singleSeals.concat(this.data.packages);
      const chosen = this.data.selectedIds.map(sid => all.find(s => s.id === sid)).filter(Boolean);
      if (chosen.length === 0) {
        this.setData({ selectedSealImg: '', selectedSealName: '', selectedSealDesc: '', previewSeals: [], previewCurrent: 0 });
        return;
      }
      if (chosen.length === 1 && chosen[0].img) {
        const desc = this._resolveSealDesc(this.data.selectedIds);
        this.setData({ selectedSealImg: chosen[0].img, selectedSealName: chosen[0].name, selectedSealDesc: desc, previewSeals: [], previewCurrent: 0 });
      } else if (chosen.length === 1 && chosen[0].seals) {
        const seals = chosen[0].seals.map(sid => {
          const s = this.data.singleSeals.find(x => x.id === sid);
          return s ? { name: s.name, img: s.img } : null;
        }).filter(Boolean);
        const desc = this._resolveSealDesc(this.data.selectedIds);
        this.setData({ selectedSealImg: '', selectedSealName: chosen[0].name, selectedSealDesc: desc, previewSeals: seals, previewCurrent: 0 });
      } else {
        // 多选：收集所有图片
        const imgs = chosen.map(c => c.img).filter(Boolean);
        const firstImg = imgs[0] || '';
        const nameStr = chosen.map(c => c.name).join(' + ');
        const desc = this._resolveSealDesc(this.data.selectedIds);
        this.setData({ selectedSealImg: firstImg, selectedSealName: nameStr, selectedSealDesc: desc, previewSeals: [], previewCurrent: 0 });
      }
    },

    onConfirm() {
      if (!this.data.selectedIds.length) {
        wx.showToast({ title: '请先选择印章', icon: 'none' });
        return;
      }
      const all = this.data.singleSeals.concat(this.data.packages);
      const chosen = this.data.selectedIds.map(sid => all.find(s => s.id === sid)).filter(Boolean);
      const ids = chosen.map(c => c.id);
      const names = chosen.map(c => c.name);
      const seals = chosen.map(c => c.seals ? c.seals.join(',') : c.id).join(',');
      this.triggerEvent('confirm', { ids, names, seals, count: chosen.length });
      this.close();
    }
  }
});
