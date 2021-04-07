const OFF = 'off';

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'quote-props': 'off',
    'import/prefer-default-export': 'off',
    'arrow-body-style': 'off',
    'no-param-reassign': 'off',
    'no-eval': 'off',
    'guard-for-in': OFF,
    'no-restricted-syntax': OFF,
  },
};
