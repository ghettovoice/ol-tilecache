[![Build Status](https://travis-ci.org/ghettovoice/ol3-tilecache.svg?branch=master)](https://travis-ci.org/ghettovoice/ol3-tilecache)
[![view on npm](http://img.shields.io/npm/v/ol3-tilecache.svg)](https://www.npmjs.org/package/ol3-tilecache)

# TileCache url function for OpenLayers 3

Allows create custom [`ol.TileUrlFunctionType`](http://openlayers.org/en/latest/apidoc/ol.html#.TileUrlFunctionType) to load tiles seeded with [TileCache](http://tilecache.org/).

## Installation

Install it thought NPM:

```shell
npm install ol3-tilecache
```

Or download the latest version archive and add it with script tag:

```html
<script src="ol3-tilecache/dist/bundle.min.js"></script>
```

## Usage

Plugin is packed into UMD wrapper, import it with CommonJS or ES6:

```js
import TileCacheUrlFunction from 'ol3-tilecache';
const TileCacheUrlFunction = require('ol3-tilecache');
```

In Browser environment it is available as `ol.TileCacheUrlFunction`.

### Members

#### createTileUrlFunction
**Arguments**

* `url : string` _URL template_
    
**Returns**: `ol.TileUrlFunctionType`

Available URL placeholders:
```
z | 0z - zoom level (simple number or padded with zero)
x1, x2, x3 - X axis index parts (remnants from dividing the integer part of the tile X index on 10^3, 10^6, 10^9)
y1, y2, y3 - Y axis index parts (remnants from dividing the integer part of the tile Y index on 10^3, 10^6, 10^9)
```
    
### Example usage:

```js
import ol from 'openlayers';
import TileCacheUrlFunction from 'ol3-tilecache';

const map = new ol.Map({
    target: 'map',
    view: new ol.View({
        projection: 'EPSG:3857',
        center: [4189972.14, 7507950.67],
        zoom: 5
    }),
    layers: [
        new ol.layer.Tile({
            source: new ol.source.XYZ({
                tileUrlFunction: ol.TileCacheUrlFunction.createTileUrlFunction('http://tilecache_server/{0z}/{x1}/{x2}/{x3}/{-y1}/{-y2}/{-y3}.png')
            })
        })
    ]
});
```

## License

MIT (c) 2016, Vladimir Vershinin
