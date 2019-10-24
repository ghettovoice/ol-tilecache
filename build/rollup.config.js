const path = require('path')
const config = require('./config')
const util = require('./util')

module.exports = [
  {
    input: config.input,
    external: config.external,
    plugins: util.plugins({
      replace: config.replace,
      banner: config.banner,
    }),
    output: {
      format: 'es',
      file: path.join(__dirname, `../dist/index.js`),
      sourcemap: true,
      banner: config.banner,
      name: config.name,
    },
  },
  {
    input: config.input,
    external: config.external,
    plugins: util.plugins({
      replace: config.replace,
      banner: config.banner,
    }),
    output: {
      format: 'iife',
      file: path.join(__dirname, `../dist/index.iife.js`),
      sourcemap: true,
      banner: config.banner,
      name: config.name,
      globals: {
        'ol/tilegrid': 'ol.tilegrid',
      },
    },
  },
]
