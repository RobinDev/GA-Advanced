// @ts-nocheck
const js = require('@eslint/js')
const globals = require('globals')

const prettier = require('eslint-plugin-prettier')
const noFloatingPromise = require('eslint-plugin-no-floating-promise')
const eslintPluginUnicorn = require('eslint-plugin-unicorn')
const jsdoc = require('eslint-plugin-jsdoc')
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended')

module.exports = [
  jsdoc.configs['flat/recommended'],
  eslintPluginUnicorn.configs['flat/recommended'],
  js.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    plugins: {
      prettier,
      jsdoc,
      noFloatingPromise,
    },

    rules: {
      'unicorn/prefer-regexp-test': 0,
      'unicorn/no-await-expression-member': 0,
      'unicorn/no-null': 0,
      'jsdoc/require-description': 0,
      'jsdoc/require-returns-description': 0,
      'jsdoc/require-param-description': 0,
      'noFloatingPromise/no-floating-promise': 2,
      'prettier/prettier': ['error'],
      'no-var': ['error'],
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
    parserOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.webextensions,
        ...globals.es2021,
        ...globals.serviceworker,
        //"chrome":"readonly"
      },
    },
  },
  {
    files: ['background.js', 'src/*'],
  },
  {
    ignores: ['eslint.config.js', 'app.js', '.repo/**/*', '_archive/**/*', '**/third-party/**', '**/node_modules/**/*'],
  },
]
