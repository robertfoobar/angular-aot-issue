const fs = require('fs');
const webpack = require('webpack');
const helpers = require('./helpers');

// Webpack Plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const DedupePlugin = require('webpack/lib/optimize/DedupePlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const WebpackChunkHash = require('webpack-chunk-hash');
const AotPlugin = require('@ngtools/webpack').AotPlugin;

const HOST = 'localhost';
const PORT = 443;

/*
 * Webpack configuration
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
var configuration = {

  entry: {
    'polyfills': './src/polyfills.ts',
    'vendor': './src/vendor.ts'
  },

  output: {
    path: helpers.root('dist')
  },

  resolve: {

    extensions: ['.ts', '.js'],

    modules: [
      helpers.root('src'),
      'node_modules'
    ]
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: [
          'source-map-loader'
        ],
        exclude: [
          // these packages have problems with their sourcemaps
          helpers.root('node_modules/rxjs'),
          helpers.root('node_modules/@angular')
        ]
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'to-string-loader' },
          { loader: 'css-loader' }
        ]
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          'raw-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.html$/,
        use: [
          'raw-loader'
        ],
        exclude: [helpers.root('src/index.html')]
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  },

  plugins: [


    new CommonsChunkPlugin({
      name: ['polyfills', 'vendor'].reverse()
    }),

    new HtmlWebpackPlugin({
      template: 'src/index.html',
      chunksSortMode: 'dependency'
    }),

    new WebpackChunkHash({algorithm: 'md5'}),

    new DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    }),

    new ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)@angular/,
      helpers.root('./src'),
      {}
    )
  ],

  devServer: {
    host: HOST,
    port: PORT,
    https: true,
    historyApiFallback: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    outputPath: helpers.root('dist')
  }
};

module.exports = function(envOptions) {
  envOptions = envOptions || {};
  console.log('Node Env Options: ' + envOptions);
  if(envOptions.AOT === 'true') {
    console.log('Building in AOT mode');
    configuration.entry.main = './src/main.aot.ts';
    configuration.output.filename = '[name].[chunkhash].bundle.js';
    configuration.output.chunkFilename = '[id].[chunkhash].chunk.js';
    var aotCompilationRule = {
      test: /\.ts$/,
      loaders: ['@ngtools/webpack'],
      exclude: [/\.(spec|e2e)\.ts$/]
    };
    configuration.module.rules.push(
      aotCompilationRule
    );
    configuration.plugins = configuration.plugins.concat([
        new AotPlugin({
          tsConfigPath: './tsconfig.aot.json',
          entryModule: 'src/app/app.module#AppModule'
        }),
        new UglifyJsPlugin({
          beautify: false,
          mangle: {
            screw_ie8: true,
            keep_fnames: true
          },
          compress: {
            warnings: false,
            screw_ie8: true
          },
          comments: false
        }),
        new LoaderOptionsPlugin({
          minimize: true,
          debug: false
        })
      ]);
    configuration.node = {
      global: true,
      crypto: 'empty',
      process: false,
      module: false,
      clearImmediate: false,
      setImmediate: false
    }
  } else {
    console.log('Building in JIT mode');
    configuration.entry.main = './src/main.jit.ts';
    configuration.devtool = 'eval-source-map';
    configuration.output.filename = '[name].bundle.js';
    configuration.output.sourceMapFilename = '[name].map';
    configuration.output.chunkFilename = '[id].chunk.js';
    configuration.output.library = 'ac_[name]';
    configuration.output.libraryTarget = 'var';
    var jitCompilationRule = {
      test: /\.ts$/,
      use: [
        { loader: 'awesome-typescript-loader' },
        { loader: 'angular2-template-loader' }
      ],
      exclude: [/\.(spec|e2e)\.ts$/]
    };
    configuration.module.rules.push(
      jitCompilationRule
    );
    configuration.plugins = configuration.plugins.concat([
      new LoaderOptionsPlugin({
        minimize: false,
        debug: true
      })
    ]);
    configuration.node = {
      global: true,
        crypto: 'empty',
        process: true,
        module: false,
        clearImmediate: false,
        setImmediate: false
    }
  }
  return configuration;
};


