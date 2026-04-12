module.exports = {
  extends: [
    'stylelint-config-standard'
  ],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'layer',
          'config',
          'screen'
        ]
      }
    ],
    'property-no-vendor-prefix': null,
    'selector-class-pattern': null
  },
  overrides: [
    {
      files: ['**/*.{vue,html}'],
      customSyntax: 'postcss-html'
    }
  ]
}
