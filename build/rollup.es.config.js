const path = require('path')
const replace = require('rollup-plugin-replace')
const babel = require('rollup-plugin-babel')
const packageJson = require('../package.json')

module.exports = {
  entry: path.join(__dirname, '../src/index.js'),
  dest: path.join(__dirname, '../dist/bundle.es.js'),
  format: 'es'
}
