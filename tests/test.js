/**
 * Unit tests
 *
 * @package ol-tilecache
 * @author Vladimir Vershinin <ghettovoice@gmail.com>
 */
var assert = chai.assert

var urlTemplate = 'http://{a-c}.tileserver.org/{0z}/{x1}/{x2}/{x3}/{y1}/{y2}/{y3}.png'
var flipUrlTemplate = 'http://{a-c}.tileserver.org/{0z}/{x1}/{x2}/{x3}/{-y1}/{-y2}/{-y3}.png'
var tiles = [
  [ [ 5, 160, -10 ], 'http://b.tileserver.org/05/000/000/160/000/000/009.png', 'http://b.tileserver.org/05/000/000/160/000/000/022.png' ],
  [ [ 18, 6053278, -15687 ], 'http://b.tileserver.org/18/006/053/278/000/015/686.png', 'http://b.tileserver.org/18/006/053/278/000/246/457.png' ],
  [ [ 10, 10907, -826 ], 'http://b.tileserver.org/10/000/010/907/000/000/825.png', 'http://b.tileserver.org/10/000/010/907/000/000/198.png' ],
]

suite('ol-tilecache tests', function () {
  test('Test URL template ' + urlTemplate, function () {
    var tileUrlFunction = ol.tileCacheUrlFn.createTileUrlFunction(urlTemplate)
    var tileUrl

    assert.typeOf(tileUrlFunction, 'function')

    tiles.map(function (arr) {
      tileUrl = tileUrlFunction(arr[ 0 ])
      assert.equal(tileUrl, arr[ 1 ])
    })
  })

  test('Test URL template ' + flipUrlTemplate, function () {
    var tileUrlFunction = ol.tileCacheUrlFns.createTileUrlFunction(flipUrlTemplate)
    var tileUrl

    tiles.map(function (arr) {
      tileUrl = tileUrlFunction(arr[ 0 ])
      assert.equal(tileUrl, arr[ 2 ])
    })
  })
})
