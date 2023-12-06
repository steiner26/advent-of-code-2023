module.exports = {
  extends: ['prettier'],
  parser: '@babel/eslint-parser',
  parserOptions: { requireConfigFile: false },
  root: true,
  env: {
    node: true,
    es6: true,
  },
  settings: {
    'import/parsers': {
      '@babel/eslint-parser': ['.js', '.jsx'],
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};