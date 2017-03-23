[![Build Status](https://travis-ci.org/ghettovoice/ol-tilecache.svg?branch=master)](https://travis-ci.org/ghettovoice/ol-tilecache)
[![Coverage Status](https://coveralls.io/repos/github/ghettovoice/ol-tilecache/badge.svg?branch=master)](https://coveralls.io/github/ghettovoice/ol-tilecache?branch=master)
[![GitHub tag](https://img.shields.io/github/tag/ghettovoice/ol-tilecache.svg)](https://github.com/ghettovoice/ol-tilecache/releases)
[![view on npm](http://img.shields.io/npm/v/ol-tilecache.svg)](https://www.npmjs.org/package/ol-tilecache)
[![License](https://img.shields.io/github/license/ghettovoice/ol-tilecache.svg)](https://github.com/ghettovoice/ol-tilecache/blob/master/LICENSE)

# TileCache url function for OpenLayers

Allows create custom [`ol.TileUrlFunctionType`](http://openlayers.org/en/latest/apidoc/ol.html#.TileUrlFunctionType) to load tiles 
seeded with [TileCache](http://tilecache.org/).

## Installation

Install it with NPM or Bower:

```shell
npm install ol openlayers ol-tilecache
bower install openlayers ol-tilecache
```

Or download the latest versions of OpenLayers and ol-tilecache and add them with script tags:

```html
<script src="/js/openlayers/dist/ol.js"></script>
<script src="/js/ol-tilecache/dist/bundle.min.js"></script>
```

### Note about peer dependencies 
**ol-tilecache requires both [openlayers](https://www.npmjs.com/package/openlayers) and [ol](https://www.npmjs.com/package/ol)
to be installed.  
In browser or CommonJS env it uses standard [openlayers](https://www.npmjs.com/package/openlayers) package.  
In ES2015 env it uses ES2015 modules from [ol](https://www.npmjs.com/package/ol). (assumes bundling with Webpack or Browserify).
You can install one as dependency and another as dev dependency to suppress NPM warning**

## Usage

Plugin may be used as UMD module or ES2015 module:

```js
// Use as ES2015 module (based on NPM package `ol`) 
// imports source files as is from `ol-tilecache/src` directory 
// assumes bundling with Webpack or Browserify
import Map from 'ol/map'
...
import * as tileCacheUrlFn from 'ol-tilecache'

// Use as CommonJS module (based on NPM package `openlayers`) without bundling 
// imports UMD module from `ol-tilecache/dist/bundle.js`
const ol = require('openlayers')
...
const tileCacheUrlFn = require('ol-tilecache')
```

In Browser environment you should add **script** tag pointing to UMD module after OpenLayers js files.
```html
<script src="/js/openlayers/dist/ol.js"></script>
<script src="/js/ol-tilecache/dist/bundle.min.js"></script>
<script>
  // now plugin is available at `ol.tileCacheUrlFn` field
</script>
```

### Members

#### createTileUrlFunction
**Arguments**

* `url : string` _URL template_
* `tileGrid : ol.tilegrid.TileGrid` _Custom tile grid. Default is EPSG:3857 x/y/z grid_
* `extent : ol.Extent` _Tile grid extent. Default is EPSG:3857 extent_
    
**Returns**: `ol.TileUrlFunctionType`

Available URL placeholders:
```
z | 0z - zoom level (simple number or padded with zero)
x1, x2, x3 - X axis index parts (remnant from dividing the tile X index on 10^9 broken down by 3 digits)
y1, y2, y3 - Y axis index parts (remnant from dividing the tile Y index on 10^9 broken down by 3 digits)
```
    
### Example usage:

```js
import Map from 'ol/map'
import View from 'ol/view'
import TileLayer from 'ol/layer/tile'
import XyzSource from 'ol/source/xyz'
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

# build UMD module
npm run build
npm run build-min
# or 
npm run build-all

# run test app
npm start

# run unit tests
npm test
```

## License

MIT (c) 2016-2017, Vladimir Vershinin
