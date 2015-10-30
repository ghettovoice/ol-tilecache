# OpenLayer 3 tile url function to load tile seeded with [TileCache](http://tilecache.org/) URL scheme

Adds custom `ol.TileUrlFunction` to use with [ol3](https://github.com/openlayers/ol3) map.

## Installation and usage
Install with

```shell    
    npm install ol3-tilecache
```

or

```shell
    bower install ol3-tilecache
```    

Available as AMD module or as global object `olTileCacheUrlFunction`. Requires `openlayers` as dependency.

AMD
```js
define(['openlayers', 'ol3-tilecache'], function(ol, olTileCacheUrlFunction) {
    var map = new ol.Map({
        target: 'map',
        view: new ol.View({
            projection: 'EPSG:3857',
            center: [4189972.14, 7507950.67],
            zoom: 5
        }),
        layers: [
            new ol.layer.Tile({
                source: new ol.source.XYZ({
                    tileUrlFunction: olTileCacheUrlFunction.createTileUrlFunction('//url/to/some/server/{0z}/{x1}/{x2}/{x3}/{-y1}/{-y2}/{-y3}.png')
                })
            })
        ]
    });
});
```

Global  
```js
var map = new ol.Map({
    target: 'map',
    view: new ol.View({
        projection: 'EPSG:3857',
        center: [4189972.14, 7507950.67],
        zoom: 5
    }),
    layers: [
        new ol.layer.Tile({
            source: new ol.source.XYZ({
                tileUrlFunction: ol.TileCacheUrlFunction.createTileUrlFunction('//url/to/some/server/{0z}/{x1}/{x2}/{x3}/{-y1}/{-y2}/{-y3}.png')
            })
        })
    ]
});
```

Created function accepts `0z, x1, x2, x3, y1, y2, y3` in additions to ol3 standard tokens, then can be used with other
standard TMS URL scheme.
```
0z - padded with 0 zoom level
x1, x2, x3 - X axis index parts (remnants from dividing the integer part of the tile X index on 1e3, 1e6, 1e9) 
y1, y2, y3 - Y axis index parts (remnants from dividing the integer part of the tile Y index on 1e3, 1e6, 1e9)
```



