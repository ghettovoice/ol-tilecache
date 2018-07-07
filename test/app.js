import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import XyzSource from 'ol/source/XYZ'
import 'ol/ol.css'
import { createTileUrlFunction } from '../src'

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
