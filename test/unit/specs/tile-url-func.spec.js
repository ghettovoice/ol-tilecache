import 'ol/map' // initialize basic projections
import { createTileUrlFunction } from '../../../src'

const urlTemplate = 'http://{a-c}.tileserver.org/{0z}/{x1}/{x2}/{x3}/{y1}/{y2}/{y3}.png'
const flipUrlTemplate = 'http://{a-c}.tileserver.org/{0z}/{x1}/{x2}/{x3}/{-y1}/{-y2}/{-y3}.png'
const tiles = [
  [ [ 5, 160, -10 ], 'http://b.tileserver.org/05/000/000/160/000/000/009.png', 'http://b.tileserver.org/05/000/000/160/000/000/022.png' ],
  [ [ 18, 6053278, -15687 ], 'http://b.tileserver.org/18/006/053/278/000/015/686.png', 'http://b.tileserver.org/18/006/053/278/000/246/457.png' ],
  [ [ 10, 10907, -826 ], 'http://b.tileserver.org/10/000/010/907/000/000/825.png', 'http://b.tileserver.org/10/000/010/907/000/000/198.png' ],
]

describe('ol-tilecache tests', function () {
  it('should correctly work with template ' + urlTemplate, function () {
    const tileUrlFunction = createTileUrlFunction(urlTemplate)
    let tileUrl

    expect(tileUrlFunction).to.be.a('function')

    tiles.map(function (arr) {
      tileUrl = tileUrlFunction(arr[ 0 ])
      expect(tileUrl).to.be.equal(arr[ 1 ])
    })
  })

  it('should correctly work with template ' + flipUrlTemplate, function () {
    const tileUrlFunction = createTileUrlFunction(flipUrlTemplate)
    let tileUrl

    tiles.map(function (arr) {
      tileUrl = tileUrlFunction(arr[ 0 ])
      expect(tileUrl).to.be.equal(arr[ 2 ])
    })
  })
})
