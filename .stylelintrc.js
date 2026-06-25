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
    'alpha-value-notation': 'number',
    'color-function-notation': 'modern',
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
