/**
 * @file Manages the root configuration settings for project wide eslint.
 * @copyright Copyright (c) 2017-present, ProReNata AB
 * @module eslint/root/configuration
 * @version 1.0.0
 * @since 0.0.2
 * @see {@link https://eslint.org} for further information.
 */

/** Configuration. */
module.exports = {
  /**
   * @see {@link https://eslint.org/docs/user-guide/configuring#specifying-environments|env}
   */
  env: {},

  /**
   * @see {@link https://eslint.org/docs/user-guide/configuring#extending-configuration-files|extends}
   */
  extends: ['@prorenata/eslint-config-vue'],

  /**
   * You can define global variables here.
   *
   * @see {@link https://eslint.org/docs/user-guide/configuring#specifying-globals|globals}
   */
  globals: {},

  /**
   * Sometimes a more fine-controlled configuration is necessary, for example if the configuration
   * for files within the same directory has to be different.
   *
   * @see {@link https://eslint.org/docs/user-guide/configuring#configuration-based-on-glob-patterns|overrides}
   */
  overrides: [
    {
      files: ['helpers.js'],
      rules: {
        'no-loop-func': 'off',
      },
    },
    {
      files: ['index.js'],
      rules: {
        'no-console': 'off',
      },
    },
    {
      files: ['Http.js', 'Rest.js'],
      rules: {
        'class-methods-use-this': 'off',
      },
    },
    {
      files: ['http.js'],
      rules: {
        'no-console': ['error', {allow: ['error']}],
      },
    },
    {
      files: ['requestsStore.js'],
      rules: {
        'no-console': ['error', {allow: ['info']}],
      },
    },
  ],

  /**
   * @see {@link https://eslint.org/docs/user-guide/configuring#specifying-parser-options|parserOptions}
   */
  parserOptions: {},

  /**
   * @see {@link https://eslint.org/docs/user-guide/configuring#configuring-plugins|plugins}
   */
  plugins: [],

  /**
   * @see {@link https://eslint.org/docs/user-guide/configuring#configuration-cascading-and-hierarchy|root}
   */
  root: true,

  /**
   * @see {@link https://eslint.org/docs/user-guide/configuring#configuring-rules|rules
   */
  rules: {
    'default-param-last': 'off',
    'no-constructor-return': 'off',
    'no-callback-in-promise': 'off',
  },

  /**
   * Webpack-literate module resolution plugin for eslint-plugin-import.
   *
   * @see {@link https://www.npmjs.com/package/eslint-import-resolver-webpack|plugin}
   */
  settings: {},
};
