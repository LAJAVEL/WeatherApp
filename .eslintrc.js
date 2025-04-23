module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['expo', 'airbnb', 'prettier'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'react/prop-types': 'off',
  },
};
