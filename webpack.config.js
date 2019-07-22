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
const merge = require('webpack-merge');
const childProcess = require('child_process');
const TerserPlugin = require('terser-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const eslintFriendlyFormatter = require('eslint-friendly-formatter');
const stylish = require('eslint/lib/formatters/stylish');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');

const getGlobal = function() {
  'use strict';

  if (typeof self !== 'undefined') {
    return self;
  }

  if (typeof window !== 'undefined') {
    return window;
  }

  if (typeof global !== 'undefined') {
    return global;
  }

  return Function('return this')();
};

/**
 * Whether eslint should use the friendly formatter.
 *
 * @type {boolean}
 */
const USE_FRIENDLY_FORMATTER = false;

/**
 * The name of the output distribution file.
 *
 * @type {string}
 */
const FILENAME = 'vue-rest-resource';

const LIBRARY = 'VueRestResource';

/**
 * The number of logical CPUs in the build system.
 *
 * @type {number}
 */
const CPU_COUNT = os.cpus().length;

/**
 * How many logical system CPUS to use for Uglify process.
 *
 * @type {number}
 */
const LOGICAL_CPU_USE = CPU_COUNT > 1 ? CPU_COUNT - 1 : 1;

/**
 * The NODE_ENV environment variable.
 *
 * @type {!object}
 */
const {NODE_ENV} = process.env;

/**
 * The distribution directory of Byxelkrok.
 *
 * @type {string}
 */
const BUILD_DIR = path.resolve(__dirname, './dist/');

/**
 * The production string.
 *
 * @type {string}
 */
const PRODUCTION = 'production';

/**
 * The development string.
 *
 * @type {string}
 */
const DEVELOPMENT = 'development';

/**
 * The default include paths.
 *
 * @type {string}
 */
const DEFAULT_INCLUDE = [path.resolve(__dirname, 'src'), path.resolve(__dirname, '__tests__')];

/**
 * Allows you to pass in as many environment variables as you like using --env.
 * - cli: Indicates if build is via CLI. (a form of quiet when in IDE)
 * - keepDistFiles: Enable keeping of "/dist" files.
 * - lint: Enable linting.
 * - lintFail: Enable fail on linting errors.
 * - report: Run the webpack reporter.
 * See {@link http://webpack.js.org/guides/environment-variables}.
 *
 * @param {!object} [env={}] - The env object.
 */
module.exports = (env = {}) => {
  /**
   * The JSON content of `package.json`.
   *
   * @type {!object}
   */
  const PACKAGE = require('./package.json');

  /**
   * The reference created bu git describe --dirty`.
   *
   * @type {string}
   * @see {@link https://git-scm.com/docs/git-describe}
   */
  const DESCRIBE = childProcess
    .spawnSync('git', ['describe', '--dirty'])
    .output[1].toString()
    .trim();

  /**
   * The date as of now.
   *
   * @type {string}
   */
  const NOW = new Date().toISOString();

  /**
   * Indicates if source maps should be built.
   *
   * @type {boolean}
   */
  const BUILD_SOURCEMAPS = true;

  /**
   * Indicates if linting should be performed.
   *
   * @type {boolean}
   */
  const PERFORM_LINTING = !!env.lint;

  /**
   * Indicates if linting errors should fail the build.
   *
   * @type {boolean}
   */
  const FAIL_ON_LINT_ERRORS = !!env.lintFail;

  /**
   * Indicates if build is via CLI.
   *
   * @type {boolean}
   */
  const CLI_BUILD = !!env.cli;

  if (CLI_BUILD) {
    console.info(`::: Build platform ${os.platform()}.`);
    console.info(`::: Number of logical system CPUs ${CPU_COUNT}.`);
    console.info(`::: Running Webpack ${NODE_ENV === PRODUCTION ? PRODUCTION : DEVELOPMENT} build.`);
    console.info(`::: Building source maps: ${BUILD_SOURCEMAPS}.`);
    console.info(`::: Using ${LOGICAL_CPU_USE} logical system CPUs for Uglify.`);
  }

  /**
   * This option controls if and how source maps are generated.
   *
   * Nosources-source-map - A SourceMap is created without the sourcesContent in it.
   * It can be used to map stack traces on the client without exposing all of the
   * source code. You can deploy the Source Map file to the webserver.
   *
   * Eval-source-map - Each module is executed with eval() and a SourceMap is added as
   * a DataUrl to the eval(). Initially it is slow, but it provides fast rebuild speed
   * and yields real files. Line numbers are correctly mapped since it gets mapped to
   * the original code. It yields the best quality SourceMaps for development.
   *
   * Source-map - A full SourceMap is emitted as a separate file. It adds a reference
   * comment to the bundle so development tools know where to find it.
   *
   * @type {string}
   * @see {@link https://webpack.js.org/configuration/devtool/}
   */
  const devTool = 'source-map';

  /**
   * Plugins are the backbone of webpack. Webpack itself is built on the same plugin system
   * that you use in your webpack configuration!
   *
   * A webpack plugin is a JavaScript object that has an apply property. This apply property
   * is called by the webpack compiler, giving access to the entire compilation lifecycle.
   *
   * @type {Array.<!object>}
   */
  const plugins = [
    /**
     * Use the shorthand version.
     *
     * @type {!object}
     * @see {@link https://webpack.js.org/plugins/environment-plugin/}
     */
    new webpack.EnvironmentPlugin({
      DEBUG: false, // use 'false' unless process.env.DEBUG is defined.
      NODE_ENV: DEVELOPMENT, // use 'development' unless process.env.NODE_ENV is defined.
    }),

    /**
     * Smaller lodash builds. We are not opting in to path feature.
     *
     * @type {!object}
     * @see {@link https://github.com/lodash/lodash-webpack-plugin}
     */
    new LodashModuleReplacementPlugin({
      paths: true,
    }),

    /**
     * Adds a banner to the top of each generated chunk.
     *
     * @type {!object}
     * @see {@link https://webpack.js.org/plugins/banner-`plugin/}
     */
    new webpack.BannerPlugin({
      banner: `/*!\n${JSON.stringify(
        {
          copywrite: `${PACKAGE.copyright}`,
          date: `${NOW}`,
          describe: `${DESCRIBE}`,
          description: `${PACKAGE.description}`,
          file: '[file]',
          hash: '[hash]',
          license: `${PACKAGE.license}`,
          version: `${PACKAGE.version}`,
        },
        null,
        2,
      )}\n*/`,
      raw: true,
    }),
  ];

  /**
   * Shared (.js & .vue) eslint-loader options.
   *
   * @type {!object}
   * @see {@link https://github.com/MoOx/eslint-loader}
   */
  const eslintLoader = {
    loader: 'eslint-loader',
    options: {
      emitError: true,
      emitWarning: NODE_ENV !== PRODUCTION,
      failOnError: FAIL_ON_LINT_ERRORS,
      failOnWarning: false,
      formatter: USE_FRIENDLY_FORMATTER ? eslintFriendlyFormatter : stylish,
      quiet: NODE_ENV === PRODUCTION,
    },
  };

  /**
   * Shared (.js & .vue) babel-loader options.
   *
   * @type {!object}
   * @see {@link https://github.com/babel/babel-loader}
   */
  const babelLoader = {
    include: DEFAULT_INCLUDE,
    loader: 'babel-loader',
  };

  /**
   * In modular programming, developers break programs up into discrete chunks of functionality
   * called a module. Each module has a smaller surface area than a full program, making verification,
   * debugging, and testing trivial. Well-written modules provide solid abstractions and encapsulation
   * boundaries, so that each module has a coherent design and a clear purpose within the overall
   * application.
   *
   * Webpack supports modules written in a variety of languages and preprocessors, via loaders.
   * Loaders describe to webpack how to process non-JavaScript modules and include these dependencies
   * into your bundles.
   *
   * @type {Array.<!object>}
   * @see {@link https://webpack.js.org/configuration/module/#module-rules}
   */
  const moduleRules = [
    /* We only want eslint-loader when specified, using webpack --env. */
    PERFORM_LINTING
      ? {
          ...eslintLoader,
          enforce: 'pre',
          include: DEFAULT_INCLUDE,
          // json does not work because of ESM import
          test: /\.(js|vue)$/,
        }
      : null,

    /**
     * Extract sourceMappingURL comments from modules and offer it to webpack.
     *
     * @see {@link https://github.com/webpack-contrib/source-map-loader}
     */
    {
      enforce: 'pre',
      loader: 'source-map-loader',
      test: /\.js$/,
    },

    /**
     * This package allows transpiling JavaScript files using Babel and webpack.
     *
     * @type {!object}
     * @see {@link https://webpack.js.org/loaders/babel-loader/}
     */
    {
      ...babelLoader,
      test: /\.js$/,
    },
  ].filter(Boolean);

  const base = {
    context: path.resolve(__dirname, '.'),

    /* See devTool. */
    devtool: devTool,

    /**
     * Define the entry points for the application.
     *
     * @type {Array.<string>}
     * @see {@link https://webpack.js.org/concepts/entry-points/}
     */
    entry: [path.join(__dirname, 'src/index.js')],

    mode: NODE_ENV === PRODUCTION ? PRODUCTION : DEVELOPMENT,

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

    optimization: {
      minimize: false,
    },

    /**
     * Configuring the output configuration options tells webpack how to write the compiled
     * files to disk.
     *
     * @type {!object}
     * @see {@link https://webpack.js.org/configuration/output/}
     */
    output: {
      // https://github.com/webpack/webpack/issues/6525
      globalObject: `(${getGlobal.toString()}())`,
      library: LIBRARY,
      libraryTarget: 'umd',
      path: BUILD_DIR,
    },

    /**
     * These options allows you to control how webpack notifies you of assets and
     * entrypoints that exceed a specific file limit.
     *
     * @type {!object}
     * @see {@link https://webpack.js.org/configuration/performance/}
     */
    performance: {
      assetFilter(assetFilename) {
        return !assetFilename.includes(FILENAME);
      },
      hints: 'warning', // set to `false` to disable.
      maxAssetSize: 450000,
    },

    /* See plugins. */
    plugins,

    /**
     * These options change how modules are resolved.
     *
     * @type {!object}
     * @see {@link https://webpack.js.org/configuration/resolve/}
     */
    resolve: {
      /**
       * Create aliases to import or require certain modules more easily.
       *
       * @type {!object}
       * @see {@link https://webpack.js.org/configuration/resolve/#resolve-alias}
       */
      alias: {
        HTTP: path.resolve(__dirname, './src'),
        RootDir: path.resolve(__dirname, '.'),
      },
      extensions: ['.js', '.json'],
    },

    /**
     * Webpack can compile for multiple environments or targets.
     *
     * @type {string}
     * @see {@link https://webpack.js.org/configuration/target/}
     */
    target: 'web',

    /**
     * A set of options used to customize watch mod.
     *
     * @type {!object}
     * @see {@link https://webpack.js.org/configuration/watch/#watchoptions}
     */
    watchOptions: {
      aggregateTimeout: 300,
    },
  };

  const raw = merge(base, {
    output: {
      filename: `${FILENAME}.js`,
    },
  });

  const minified = merge(base, {
    output: {
      filename: `${FILENAME}.min.js`,
    },

    /**
     * Webpack plugin and CLI utility that represents bundle content as convenient
     * interactive zoomable treemap.
     *
     * @see {@link https://github.com/webpack-contrib/webpack-bundle-analyzer}
     */
    plugins: [
      new TerserPlugin({
        parallel: LOGICAL_CPU_USE,
        sourceMap: BUILD_SOURCEMAPS,
        terserOptions: {
          ecma: 5,
        },
      }),

      ...(env && env.report ? [new BundleAnalyzerPlugin()] : []),
    ],
  });

  return [raw, minified];
};
