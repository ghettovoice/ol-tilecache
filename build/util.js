const replace = require('rollup-plugin-replace')
const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')
const cjs = require('rollup-plugin-commonjs')
const {uglify} = require('rollup-plugin-uglify')

function plugins (options = {}) {
  const plugins = [
    replace(options.replace),
    babel({
      runtimeHelpers: true,
      sourceMap: true,
      include: [
        'src/**/*',
        'node_modules/ol/**/*',
      ],
    }),
    resolve({
      main: true,
      module: true,
      jsnext: true,
      browser: true,
    }),
    cjs(),
  ]
  if (options.min) {
    plugins.push(uglify({
      mangle: true,
      sourcemap: true,
      compress: {
        warnings: false,
      },
      output: {
        preamble: options.banner,
      },
    }))
  }
  return plugins
}

module.exports = {
  plugins,
}
