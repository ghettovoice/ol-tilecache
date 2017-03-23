import Map from 'ol/map'
import tilegrid from 'ol/tilegrid'
import Layer from 'ol/layer/vector'

const map = new Map({
  tile: tilegrid.createXYZ()
})

const layer = new Layer()
