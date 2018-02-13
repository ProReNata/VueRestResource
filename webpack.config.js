/**
 * @file Manages the root configuration settings for webpack.
 * @copyright Copyright (c) 2017-present, ProReNata AB
 * @module webpack/root/configuration
 * @version 1.0.0
 * @since 0.0.2
 * @see {@link https://webpack.js.org/} for further information.
 */

const path = require('path');
const os = require('os');
const webpack = require('webpack');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const eslintFriendlyFormatter = require('eslint-friendly-formatter');
const {
  BundleAnalyzerPlugin,
} = require('webpack-bundle-analyzer');

/**
 * The number of logical CPUs in the build system.
 * @type {number}
 */
const CPU_COUNT = os.cpus().length;

/**
 * The NODE_ENV environment variable.
 * @type {!Object}
 */
const {NODE_ENV} = process.env;

/**
 * The distribution directory of Byxelkrok.
 * @type {string}
 */
const BUILD_DIR = path.resolve(__dirname, './dist/');

/**
 * The production string.
 * @type {string}
 */
const PRODUCTION = 'production';

/**
 * The development string.
 * @type {string}
 */
const DEVELOPMENT = 'development';

/**
 * The default exclude regex.
 * @type {string}
 */
const DEFAULT_EXCLUDE_RX = /(node_modules|bower_components)/;

/**
 * Allows you to pass in as many environment variables as you like using --env.
 * - keepDistFiles: Enable keeping of "/dist" files.
 * - lint: Enable linting.
 * - lintFail: Enable fail on linting errors.
 * - sourceMap: Enable source maps.
 *
 * @param {!Object} env - The env object.
 * @see {@link https://webpack.js.org/guides/environment-variables/}
 */
module.exports = (env = {}) => {
  /**
   * Indicates if source maps should be built.
   * @type {boolean}
   */
  const BUILD_SOURCEMAPS = !!env.sourceMap;

  /**
   * Indicates if linting should be performed.
   * @type {boolean}
   */
  const PERFORM_LINTING = !!env.lint;

  /**
   * Indicates if linting errors should fail the build.
   * @type {boolean}
   */
  const FAIL_ON_LINT_ERRORS = !!env.lintFail;

  /**
   * Indicates if bundle reporting should be run.
   * @type {boolean}
   */
  const RUN_REPORT = !!env.report;

  /**
   * Indicates if build is via CLI.
   * @type {boolean}
   */
  const CLI_BUILD = !!env.cli;

  /**
   * Indicates if build should be uglified.
   * @type {boolean}
   */
  const UGLIFY = !!env.uglify;

  if (CLI_BUILD) {
    console.info(`::: Build platform ${os.platform()}.`);
    console.info(`::: Number of logical system CPUs ${CPU_COUNT}.`);
    console.info(`::: Running Webpack ${NODE_ENV === PRODUCTION ? PRODUCTION : DEVELOPMENT} build.`);
    console.info(`::: Building source maps: ${BUILD_SOURCEMAPS}.`);
  }

  /**
   * This option controls if and how source maps are generated.
   *
   * nosources-source-map - A SourceMap is created without the sourcesContent in it.
   * It can be used to map stack traces on the client without exposing all of the
   * source code. You can deploy the Source Map file to the webserver.
   *
   * eval-source-map - Each module is executed with eval() and a SourceMap is added as
   * a DataUrl to the eval(). Initially it is slow, but it provides fast rebuild speed
   * and yields real files. Line numbers are correctly mapped since it gets mapped to
   * the original code. It yields the best quality SourceMaps for development.
   *
   * source-map - A full SourceMap is emitted as a separate file. It adds a reference
   * comment to the bundle so development tools know where to find it.
   *
   * @type {string}
   * @see {@link https://webpack.js.org/configuration/devtool/}
   */
  const devTool = NODE_ENV === PRODUCTION ? 'nosources-source-map' : 'eval-source-map';

  // https://github.com/github/fetch
  // https://github.com/webpack-contrib/imports-loader
  // https://github.com/webpack-contrib/exports-loader
  // https://webpack.js.org/guides/migrating/#automatic-loader-module-name-extension-removed
  const WHATWG_FETCH = 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch';

  /**
   * Plugins are the backbone of webpack. webpack itself is built on the same plugin system
   * that you use in your webpack configuration!
   *
   * A webpack plugin is a JavaScript object that has an apply property. This apply property
   * is called by the webpack compiler, giving access to the entire compilation lifecycle.
   *
   * @type {array.<!Object>}
   */
  const plugins = [
    /**
     * Use the shorthand version.
     * @type {!Object}
     * @see {@link https://webpack.js.org/plugins/environment-plugin/}
     */
    new webpack.EnvironmentPlugin({
      DEBUG: false, // use 'false' unless process.env.DEBUG is defined.
      NODE_ENV: DEVELOPMENT, // use 'development' unless process.env.NODE_ENV is defined.
    }),

    /**
     * Fetch polyfill for environments that are missing the API.
     * Only loads if reaquired.
     * @type {!Object}
     * @see {@linkhttps://webpack.js.org/plugins/provide-plugin/
     */
    new webpack.ProvidePlugin({
      fetch: WHATWG_FETCH,
      'window.fetch': WHATWG_FETCH,
    }),

    /**
     * Smaller lodash builds. We are not opting in to path feature.
     * @type {!Object}
     * @see {@link https://github.com/lodash/lodash-webpack-plugin}
     */
    new LodashModuleReplacementPlugin({
      paths: true,
    }),
  ];

  /* Add uglify plugin if production. */
  if (UGLIFY && NODE_ENV === PRODUCTION) {
    /**
     * How many logical system CPUS to use for Uglify process.
     * @type {number}
     */
    const LOGICAL_CPU_USE = CPU_COUNT > 1 ? CPU_COUNT - 1 : 1;

    if (CLI_BUILD) {
      console.info(`::: Using ${LOGICAL_CPU_USE} logical system CPUs for Uglify.`);
    }

    /**
     * This plugin uses UglifyJS v3 (uglify-es) to minify your JavaScript.
     * @type {!Object}
     * @see {@link https://webpack.js.org/plugins/uglifyjs-webpack-plugin/}
     */
    const uglify = new webpack.optimize.UglifyJsPlugin({
      parallel: LOGICAL_CPU_USE,
      sourceMap: BUILD_SOURCEMAPS,
      uglifyOptions: {
        ecma: 8,
      },
    });

    /* Add the uglify plugin object to the list of plugins. */
    plugins.push(uglify);
  }

  /* Add stylelint plugin if requested. */
  if (PERFORM_LINTING) {
    /**
     * A webpack plugin to lint your CSS/Sass code using stylelint.
     * @type {!Object}
     * @see {@link https://github.com/JaKXz/stylelint-webpack-plugin}
     */
    const styleLint = new StyleLintPlugin({
      emitErrors: FAIL_ON_LINT_ERRORS,
      failOnError: false, // https://github.com/JaKXz/stylelint-webpack-plugin/issues/103
      files: ['**/*.+(css|sass|scss|less|vue)'],
      quiet: true, // https://github.com/JaKXz/stylelint-webpack-plugin/issues/61
    });

    /* Add the stylelint plugin object to the list of plugins. */
    plugins.push(styleLint);
  }

  if (RUN_REPORT) {
    plugins.push(new BundleAnalyzerPlugin());
  }

  /**
   * Shared (.js & .vue) eslint-loader options.
   * @type {!Object}
   * @see {@link https://github.com/MoOx/eslint-loader}
   */
  const eslintLoader = {
    enforce: 'pre',
    loader: 'eslint-loader',
    options: {
      emitError: FAIL_ON_LINT_ERRORS,
      emitWarning: false,
      failOnError: FAIL_ON_LINT_ERRORS,
      failOnWarning: false,
      formatter: eslintFriendlyFormatter,
      quiet: true,
    },
  };

  const createLintingRule = () => ({
    exclude: DEFAULT_EXCLUDE_RX,
    test: /\.(js|vue|json)$/,
    ...eslintLoader,
  });

  /**
   * Shared (.js & .vue) babel-loader options.
   * @type {!Object}
   * @see {@link https://github.com/babel/babel-loader}
   */
  const babelLoader = {
    exclude: DEFAULT_EXCLUDE_RX,
    loader: 'babel-loader',
    options: {
      plugins: ['lodash'],
      presets: [['env', {
        modules: false,
        targets: {
          node: 8,
        },
      }]],
    },
  };

  /**
   * If the file is greater than the limit (in bytes) the file-loader is used by default
   * and all query parameters are passed to it.
   *
   * In development, we are unable to serve files so url encode everything.
   *
   * @type {number}
   * @see {@link https://github.com/webpack-contrib/url-loader#limit}
   */
  const urlLoaderBytesLimit = NODE_ENV === PRODUCTION ? 8192 : Number.MAX_SAFE_INTEGER;

  /**
   * Adds CSS to the DOM by injecting a <style> tag.
   * @type {!Object}
   * @see {@link https://webpack.js.org/loaders/style-loader/}
   */
  const styleLoader = {
    loader: 'style-loader',
    options: {
      singleton: true,
      sourceMap: BUILD_SOURCEMAPS,
    },
  };

  /**
   * The css-loader interprets @import and url() like import/require() and will resolve them.
   * Also consider: https://webpack.js.org/loaders/css-loader/#extract
   * @type {!Object}
   * @see {@link https://webpack.js.org/loaders/css-loader/}
   */
  const cssLoader = {
    loader: 'css-loader',
    options: {
      camelCase: true,
      sourceMap: BUILD_SOURCEMAPS,
    },
  };

  /**
   * Compiles Less to CSS.
   * @type {!Object}
   * @see {@link https://webpack.js.org/loaders/less-loader/}
   *
   * Usually, it's recommended to extract the style sheets into a dedicated file in
   * production using the ExtractTextPlugin. This way your styles are not dependent
   * on JavaScript.
   *
   * Uses webpack's resolver by default.
   * @see {@link https://webpack.js.org/loaders/less-loader/#webpack-resolver}
   */
  const lessLoader = {
    loader: 'less-loader',
    options: {
      sourceMap: BUILD_SOURCEMAPS,
      strictMath: true,
    },
  };

  /**
   * Generate style loaders for 'vue-loader'.
   *
   * @param {string} loader - The loader prefix.
   * @returns {Array} A new array with the required loaders.
   */
  const generateLoaders = (loader) => {
    const loaders = [cssLoader];

    if (loader) {
      loaders.push(loader);
    }

    return ['vue-style-loader', ...loaders];
  };

  /**
   * In modular programming, developers break programs up into discrete chunks of functionality
   * called a module. Each module has a smaller surface area than a full program, making verification,
   * debugging, and testing trivial. Well-written modules provide solid abstractions and encapsulation
   * boundaries, so that each module has a coherent design and a clear purpose within the overall
   * application.
   *
   * webpack supports modules written in a variety of languages and preprocessors, via loaders.
   * Loaders describe to webpack how to process non-JavaScript modules and include these dependencies
   * into your bundles.
   *
   * @type {array.<!Object>}
   * @see {@link https://webpack.js.org/configuration/module/#module-rules}
   */
  const moduleRules = [
    /* We only want eslint-loader when specified, using webpack --env. */
    ...(PERFORM_LINTING ? [createLintingRule()] : []),

    /* Style loading. */
    {
      loaders: [
        styleLoader,
        cssLoader,
      ],
      test: /\.(css)(\?\S*)?$/,
    },
    {
      loaders: [
        styleLoader,
        cssLoader,
        lessLoader,
      ],
      test: /\.(less)(\?\S*)?$/,
    },

    /**
   * This package allows transpiling JavaScript files using Babel and webpack.
   * @type {!Object}
   * @see {@link https://webpack.js.org/loaders/babel-loader/}
   */
    {
      ...babelLoader,
      test: /\.js$/,
    },

    /**
   * vue-loader is a loader for webpack that can transform Vue components written
   * in the following format into a plain JavaScript module.
   * @type {!Object}
   * @see {@link https://vue-loader.vuejs.org/en/}
   */
    {
      loaders: [
      // https://vue-loader.vuejs.org/en/
        {
          loader: 'vue-loader',
          options: {
          // https://github.com/vuejs/vue-loader/blob/master/docs/en/options.md#csssourcemap
            cssSourceMap: BUILD_SOURCEMAPS,
            // https://github.com/vuejs/vue-loader/blob/master/docs/en/options.md#loaders
            loaders: {
              css: generateLoaders(),
              js: PERFORM_LINTING ? [babelLoader, eslintLoader] : [babelLoader],
              less: generateLoaders(lessLoader),
            },
            // https://github.com/vuejs/vue-loader/blob/master/docs/en/options.md#transformtorequire
            transformToRequire: {
              image: 'xlink:href',
              img: 'src',
              source: 'src',
              video: ['src', 'poster'],
            },
          },
        },
        // https://www.iviewui.com/docs/guide/iview-loader-en
        {
          loader: 'iview-loader',
          options: {
            prefix: false,
          },
        },
      ],
      test: /\.vue$/,
    },

    /**
   * The url-loader works like the file-loader, but can return a DataURL if the file
   * is smaller than a byte limit.
   * @type {!Object}
   * @see {@link https://github.com/webpack-contrib/url-loader}
   * @see {@link https://webpack.js.org/loaders/}
   */
    {
      loader: 'url-loader',
      options: {
        limit: urlLoaderBytesLimit,
        mimetype: 'application/vnd.ms-fontobject',
      },
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
    },

    {
      loader: 'url-loader',
      options: {
        limit: urlLoaderBytesLimit,
        mimetype: 'application/font-woff',
      },
      test: /\.woff(2)?(\?v=\d+\.\d+\.\d+)?$/,
    },

    {
      loader: 'url-loader',
      options: {
        limit: urlLoaderBytesLimit,
        mimetype: 'application/octet-stream',
      },
      test: /\.[ot]tf(\?v=\d+\.\d+\.\d+)?$/,
    },

    {
      loader: 'url-loader',
      options: {
        limit: urlLoaderBytesLimit,
        mimetype: 'image/svg+xml',
      },
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
    },

    {
      loader: 'url-loader',
      options: {
        limit: urlLoaderBytesLimit,
        mimetype: 'image/bmp',
      },
      test: /\.bmp(\?\S*)?$/,
    },

    {
      loader: 'url-loader',
      options: {
        limit: urlLoaderBytesLimit,
        mimetype: 'image/png',
      },
      test: /\.png(\?\S*)?$/,
    },

    {
      loader: 'url-loader',
      options: {
        limit: urlLoaderBytesLimit,
        mimetype: 'image/jpeg',
      },
      test: /\.jpe?g(\?\S*)?$/,
    },

    {
      loader: 'url-loader',
      options: {
        limit: urlLoaderBytesLimit,
        mimetype: 'image/gif',
      },
      test: /\.gif(\?\S*)?$/,
    },

  ];

  return {
    context: path.resolve(__dirname, '.'),

    /* See devTool. */
    devtool: devTool,

    /**
     * Define the entry points for the application.
     * @type {array.<string>}
     * @see {@link https://webpack.js.org/concepts/entry-points/}
     */
    entry: [path.join(__dirname, 'index.js')],

    /* See moduleRules. */
    module: {
      rules: moduleRules,
    },

    node: {
      child_process: 'empty',
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      // prevent webpack from injecting useless setImmediate polyfill because Vue
      // source contains it (although only uses it if it's native).
      setImmediate: false,
      // prevent webpack from injecting mocks to Node native modules
      // that does not make sense for the client
      tls: 'empty',
    },

    /**
     * Configuring the output configuration options tells webpack how to write the compiled
     * files to disk.
     * @type {!Object}
     * @see {@link https://webpack.js.org/configuration/output/}
     */
    output: {
      filename: 'index.js',
      libraryTarget: 'umd',
      path: BUILD_DIR,
    },

    /* See plugins. */
    plugins,

    /**
     * These options change how modules are resolved.
     * @type {!Object}
     * @see {@link https://webpack.js.org/configuration/resolve/}
     */
    resolve: {
      /**
       * Create aliases to import or require certain modules more easily.
       * @type {!Object}
       * @see {@link https://webpack.js.org/configuration/resolve/#resolve-alias}
       */
      alias: {
        HTTP: path.resolve(__dirname, './src'),
        RootDir: path.resolve(__dirname, '.'),
        /**
         * ES module builds are intended for use with modern bundlers like webpack 2 or rollup.
         * @type {string}
         * @see {@link https://vuejs.org/v2/guide/installation.html#Explanation-of-Different-Builds}
         */
        vue$: 'vue/dist/vue.esm.js',
      },
      extensions: ['.js', ',jsx', '.vue', '.json'],
    },

    /**
     * webpack can compile for multiple environments or targets.
     * @type {string}
     * @see {@link https://webpack.js.org/configuration/target/}
     */
    target: 'web',

    /**
     * A set of options used to customize watch mod.
     * @type {!Object}
     * @see {@link https://webpack.js.org/configuration/watch/#watchoptions}
     */
    watchOptions: {
      aggregateTimeout: 300,
      ignored: DEFAULT_EXCLUDE_RX,
    },
  };
};
