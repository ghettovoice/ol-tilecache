const webpack = require('webpack')
const path = require('path')
const WebpackNotifierPlugin = require('webpack-notifier')
const packageJson = require('./package.json')

module.exports = (env = {}) => {
  const RELEASE = env.release
  const BUILD = env.build
  const DEBUG = !BUILD && !RELEASE
  const VERBOSE = env.verbose
  const PROFILE = env.profile
  const GLOBALS = {
    'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
    __DEV__: DEBUG
  }

  const nodeModulesDir = path.join(__dirname, 'node_modules')
  const srcDir = path.join(__dirname, 'src')
  const outDir = path.join(__dirname, 'dist')
  const bundleName = RELEASE ? 'bundle.min.js' : 'bundle.js'
  const exportName = [ 'ol', 'tileCacheFn' ]
  const entry = [ path.join(srcDir, 'index.js') ]

  const banner =
    `${packageJson.description}
@package ${packageJson.name}
@author ${packageJson.author}
@version ${packageJson.version}
@licence MIT https://opensource.org/licenses/MIT
@copyright (c) 2016-${new Date().getFullYear()}, ${packageJson.author}`

  const plugins = [
    new webpack.DefinePlugin(GLOBALS),
    new WebpackNotifierPlugin({
      title: packageJson.name,
      alwaysNotify: true
    })
  ]

  if (DEBUG) {
    plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    )
  } else {
    plugins.push(
      new webpack.BannerPlugin(banner)
    )

    if (RELEASE) {
      plugins.push(
        new webpack.optimize.UglifyJsPlugin({
          comments: false,
          mangle: true,
          compress: {
            warnings: VERBOSE
          },
          output: {
            preamble: `/*!\n${banner}\n*/`
          }
        })
      )
    }
  }

  return {
    devtool: DEBUG ? '#cheap-module-eval-source-map' : '#source-map',
    devServer: {
      contentBase: __dirname,
      hot: true,
      inline: true,
      host: 'localhost',
      port: 8080
    },
    stats: {
      colors: true,
      cached: false,
      cachedAssets: false,
      chunks: false,
      chunkModules: false,
      modules: false
    },
    cache: DEBUG,
    profile: PROFILE,
    entry,
    externals: [
      {
        'ol/tilegrid': {
          root: ['ol','tilegrid'],
          amd: 'ol/tilegrid',
          commonjs: 'ol/tilegrid',
          commonjs2: 'ol/tilegrid'
        }
      }
    ],
    output: {
      path: outDir,
      filename: bundleName,
      publicPath: DEBUG ? 'http://localhost:8080/dist/' : '/dist/',
      crossOriginLoading: "anonymous",
      library: exportName,
      libraryTarget: 'umd'
    },
    resolve: {
      modules: [ nodeModulesDir ],
      extensions: [ '.jsx', '.js', '.json' ]
    },
    node: {
      console: false,
      global: true,
      process: true,
      Buffer: true,
      __filename: "mock",
      __dirname: "mock",
      setImmediate: true,
      fs: "empty"
    },
    module: {
      rules: [ {
        test: /\.jsx?$/,
        exclude: [ outDir ],
        loader: 'babel-loader'
      }, {
        test: /\.json$/i,
        exclude: [ outDir ],
        loader: 'json-loader'
      }, {
        test: /\.txt$/i,
        exclude: [ outDir ],
        loader: 'raw-loader'
      } ]
    },
    plugins: plugins
  }
}
