import js from '@eslint/js'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'

export default {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  globals: globals.browser,
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  plugins: ['react-hooks', 'react-refresh'],
  extends: [
    js.configs.recommended,
    reactHooks.configs['recommended-latest'],
    reactRefresh.configs.vite,
    // 'plugin:prettier/recommended' // uncomment if using Prettier
  ],
  rules: {
    'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  settings: {
    react: { version: 'detect' },
  },
  ignorePatterns: ['dist', 'node_modules'],
}
