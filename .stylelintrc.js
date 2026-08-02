// Stylelint 配置 - 微信小程序 WXSS
module.exports = {
  extends: ['stylelint-config-standard'],
  customSyntax: 'postcss-scss',
  rules: {
    'at-rule-no-unknown': [true, {
      ignoreAtRules: ['import', 'page', 'container', 'apply', 'screen', 'keyframes', 'charset', 'font-face', 'supports']
    }],
    'import-notation': null,
    'no-descending-specificity': null,
    'selector-class-pattern': null,
    // 微信小程序兼容：禁用现代颜色函数语法（rgb(0 0 0 / .5) 改法有渲染风险），保持 rgba() 写法
    'color-function-notation': null,
    // 禁用别名/透明度现代写法：保持 rgba(r,g,b,a) 与 0.5 数字透明度（现代语法小程序有渲染风险）
    'color-function-alias-notation': null,
    'alpha-value-notation': null,
    // 微信小程序大量依赖 -webkit- 前缀（如 -webkit-line-clamp 多行省略），禁用避免误删
    'property-no-vendor-prefix': null,
    'color-hex-length': 'short',
    'comment-whitespace-inside': 'always',
    'shorthand-property-no-redundant-values': true,
    'selector-not-notation': 'simple',
    'declaration-property-value-no-unknown': null,
    'declaration-block-no-redundant-longhand-properties': null,
    'selector-type-no-unknown': null,
    'declaration-block-single-line-max-declarations': null,
    'no-duplicate-selectors': null,
    'keyframes-name-pattern': null,
    'selector-pseudo-element-no-unknown': null
  },
  ignoreFiles: [
    'node_modules/**',
    'miniprogram_npm/**'
  ]
};
