/**
 * Unit tests
 *
 * @package ol3-tilecache
 * @author Vladimir Vershinin <ghettovoice@gmail.com>
 */
const assert = require('chai').assert;
const TileUrlFunction = require('../src');

const urlTemplate = 'http://{a-c}.tileserver.org/{0z}/{x1}/{x2}/{x3}/{y1}/{y2}/{y3}.png';
const flipUrlTemplate = 'http://{a-c}.tileserver.org/{0z}/{x1}/{x2}/{x3}/{-y1}/{-y2}/{-y3}.png';
const tiles = [
    [5, 180, -78],
    [5, 180, -78],
];

suite('ol3-tilecache tests', function () {
    test(`Test URL template ${urlTemplate}`, function () {
        const tileUrlFunction = TileUrlFunction.createTileUrlFunction(urlTemplate);


    });
});

