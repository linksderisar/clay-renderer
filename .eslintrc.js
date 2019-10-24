module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    '@vue/airbnb',
    'plugin:vue/recommended',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'max-len': ['error', {
      code: 150,
      ignoreTemplateLiterals: true,
      ignoreStrings: true,
    }],
    'no-underscore-dangle': 'off',
    'vue/html-indent': [
      'error', 4, {
        attribute: 1,
        closeBracket: 0,
        alignAttributesVertically: true,
        ignores: [],
      },
    ],
    'no-trailing-spaces': [
      'error', {
        skipBlankLines: true,
      },
    ],
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
