[![Build Status](https://travis-ci.org/ghettovoice/ol-tilecache.svg?branch=master)](https://travis-ci.org/ghettovoice/ol-tilecache)
[![Coverage Status](https://coveralls.io/repos/github/ghettovoice/ol-tilecache/badge.svg?branch=master)](https://coveralls.io/github/ghettovoice/ol-tilecache?branch=master)
[![GitHub tag](https://img.shields.io/github/tag/ghettovoice/ol-tilecache.svg)](https://github.com/ghettovoice/ol-tilecache/releases)
[![view on npm](http://img.shields.io/npm/v/ol-tilecache.svg)](https://www.npmjs.org/package/ol-tilecache)
[![License](https://img.shields.io/github/license/ghettovoice/ol-tilecache.svg)](https://github.com/ghettovoice/ol-tilecache/blob/master/LICENSE)

# TileCache url function for OpenLayers

Allows create custom [`ol.TileUrlFunctionType`](http://openlayers.org/en/latest/apidoc/ol.html#.TileUrlFunctionType) to load tiles 
seeded with [TileCache](http://tilecache.org/).

## Installation

Install it with NPM (**recommended**):

```shell
# ES6 version for bundling with Webpack, Rollup and etc.
npm install ol ol-tilecache
```

```js
// Use as ES2015 module (based on NPM package `ol`)
import Map from 'ol/Map'
...
import * as TileCacheUrlFn from 'ol-tilecache'
// or only what you need
import { createTileUrlFunction } from 'ol-tilecache'
```

Or add from CDN:

```html
<script src="https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.0.0/build/ol.js"></script>
<script src="https://unpkg.com/ol-tilecache@latest/dist/bundle.min.js"></script>
<script>
  // plugin exports global variable TileCacheUrlFn
  // in addition it also exported to `ol.tileCacheUrlFn` field (for backward compatibility).
</script>
```

### Note
**Plugin is available in 2 versions: as UMD module and as ES2015 module:**
- **RECOMMENDED: ES2015 version (`dist/bundle.es.js`) should be used with [ol](https://www.npmjs.com/package/ol) package (you should
  install it manually).**
- **UMD version (`dist/bundle[.min].js`) should be used with UMD [ol](https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.0.0/build/ol.js) package.
  You can install `ol` package as dev dependency to suppress NPM warning about required peer dependencies.**

## Usage

Usage same as standard OpenLayers tile url functions.

### Members

#### createTileUrlFunction
**Arguments**

* `url : string` _URL template_
* `tileGrid : ol.tilegrid.TileGrid` _Custom tile grid. Default is EPSG:3857 x/y/z grid_
    
**Returns**: `ol.TileUrlFunctionType`

Available URL placeholders:
```
z | 0z - zoom level (simple number or padded with zero)
x1, x2, x3 - X axis index parts (remnant from dividing the tile X index on 10^9 broken down by 3 digits)
y1, y2, y3 - Y axis index parts (remnant from dividing the tile Y index on 10^9 broken down by 3 digits)
-y1, -y2, -y3 - inverted Y axis index parts (remnant from dividing the tile Y index on 10^9 broken down by 3 digits)
```
    
### Example usage:

```js
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import XyzSource from 'ol/source/XYZ'
import { createTileUrlFunction } from 'ol-tilecache'

const map = new Map({
  target: 'map',
  view: new View({
    projection: 'EPSG:3857',
    center: [ 4189972.14, 7507950.67 ],
    zoom: 5
  }),
  layers: [
    new TileLayer({
      source: new XyzSource({
        tileUrlFunction: createTileUrlFunction('http://{a-z}.tiles.org/{0z}/{x1}/{x2}/{x3}/{-y1}/{-y2}/{-y3}.png')
      })
    })
  ]
})

```

### Build

```bash
git clone https://github.com/ghettovoice/ol-tilecache.git
npm install
# build
npm run build
# run test app
npm start
# run unit tests
npm test
```

## License

MIT (c) 2016-2019, Vladimir Vershinin
