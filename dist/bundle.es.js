/*!
OpenLayers tile url function to load tile seeded with TileCache url scheme

@package ol-tilecache
@author Vladimir Vershinin <ghettovoice@gmail.com>
@version 2.0.0-beta.4
@licence MIT https://opensource.org/licenses/MIT
@copyright (c) 2016-2017, Vladimir Vershinin <ghettovoice@gmail.com>
*/
import tilegrid from 'ol/tilegrid';

/**
 * Left zero pad.
 *
 * @param {string | number} num
 * @param {number} places
 * @returns {string}
 */
function zeroPad(num, places) {
  var zero = places - num.toString().length + 1;

  return (new Array(parseInt(zero > 0 && zero, 10)).join("0") + num).toString().slice(-places);
}

/**
 * The % operator in JavaScript returns the remainder of a / b, but differs from
 * some other languages in that the result will have the same sign as the
 * dividend. For example, -1 % 8 == -1, whereas in some other languages
 * (such as Python) the result would be 7. This function emulates the more
 * correct modulo behavior, which is useful for certain applications such as
 * calculating an offset index in a circular list.
 *
 * @param {number} a The dividend.
 * @param {number} b The divisor.
 * @return {number} a % b where the result is between 0 and b (either 0 <= x < b
 *     or b < x <= 0, depending on the sign of b).
 * @link https://closure-library.googlecode.com/git-history/docs/local_closure_goog_math_math.js.source.html#line73
 */
function modulo(a, b) {
  var m = a % b;

  return m * b < 0 ? m + b : m;
}

/**
 * @param {*} value
 * @param {string} [message]
 * @throws {Error} Throws on false value
 */


function isArray(value) {
  return Object.prototype.toString.call(value) === '[object Array]';
}

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * @param {ol.tilegrid.TileGrid} tileGrid
 * @param {ol.Extent} extent
 * @param {number} z
 * @return {{minX, minY, maxX, maxY}}
 */
function calculateTileRangeForZ(tileGrid, extent, z) {
  var resolution = tileGrid.getResolution(z);

  var _getTileCoordForXYAnd = getTileCoordForXYAndResolution(tileGrid, extent[0], extent[1], resolution, false),
      _getTileCoordForXYAnd2 = _slicedToArray(_getTileCoordForXYAnd, 2),
      minX = _getTileCoordForXYAnd2[0],
      minY = _getTileCoordForXYAnd2[1];

  var _getTileCoordForXYAnd3 = getTileCoordForXYAndResolution(tileGrid, extent[2], extent[3], resolution, true),
      _getTileCoordForXYAnd4 = _slicedToArray(_getTileCoordForXYAnd3, 2),
      maxX = _getTileCoordForXYAnd4[0],
      maxY = _getTileCoordForXYAnd4[1];

  return { minX: minX, minY: minY, maxX: maxX, maxY: maxY };
}

/**
 * @param {ol.tilegrid.TileGrid} tileGrid
 * @param {number} x
 * @param {number} y
 * @param {number} resolution
 * @param {boolean} reverseIntersectionPolicy
 * @return {number[]}
 */
function getTileCoordForXYAndResolution(tileGrid, x, y, resolution, reverseIntersectionPolicy) {
  var z = tileGrid.getZForResolution(resolution);
  var scale = resolution / tileGrid.getResolution(z);
  var origin = tileGrid.getOrigin(z);
  var tileSize = tileGrid.getTileSize(z);

  if (!isArray(tileSize)) {
    tileSize = [tileSize, tileSize];
  }

  var adjustX = reverseIntersectionPolicy ? 0.5 : 0;
  var adjustY = reverseIntersectionPolicy ? 0 : 0.5;
  var xFromOrigin = Math.floor((x - origin[0]) / resolution + adjustX);
  var yFromOrigin = Math.floor((y - origin[1]) / resolution + adjustY);
  var tileCoordX = scale * xFromOrigin / tileSize[0];
  var tileCoordY = scale * yFromOrigin / tileSize[1];

  if (reverseIntersectionPolicy) {
    tileCoordX = Math.ceil(tileCoordX) - 1;
    tileCoordY = Math.ceil(tileCoordY) - 1;
  } else {
    tileCoordX = Math.floor(tileCoordX);
    tileCoordY = Math.floor(tileCoordY);
  }

  return [tileCoordX, tileCoordY];
}

/**
 * @param {{minX, minY, maxX, maxY}} tileRange
 * @return {number}
 */
function getTileRangeHeight(tileRange) {
  return tileRange.maxY - tileRange.minY + 1;
}

var zRegEx = /\{z\}/g;
var zPadRegEx = /\{0z\}/g;
var xRegEx = /\{x\d?\}/g;
var yRegEx = /\{y\d?\}/g;
var dashYRegEx = /\{-y\d?\}/g;

var EPSG3857_EXTENT = [-20037508.342789244, -20037508.342789244, 20037508.342789244, 20037508.342789244];

/**
 * Basic create factory.
 *
 * @param {string} url Url template
 * @param {ol.tilegrid.TileGrid} [tileGrid] Tile grid.
 * @param {ol.Extent | number[]} [extent] Tile grid extent.
 * @returns {ol.TileUrlFunctionType}
 * @static
 * @public
 */
function createTileUrlFunction(url) {
  var tileGrid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : tilegrid.createXYZ();
  var extent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EPSG3857_EXTENT;

  return createTileUrlFunctionFromTemplates(expandUrl(url), tileGrid, extent);
}

/**
 * Creates tile URL function from single template.
 *
 * @param {string} template Source url
 * @param {ol.tilegrid.TileGrid} [tileGrid] Tile grid.
 * @param {ol.Extent | number[]} [extent] Tile grid extent.
 * @returns {ol.TileUrlFunctionType}
 * @private
 */
function createTileUrlFunctionFromTemplate(template) {
  var tileGrid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : tilegrid.createXYZ();
  var extent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EPSG3857_EXTENT;

  return (
    /**
     * @param {ol.TileCoord} tileCoord Tile Coordinate.
     * @return {string | undefined} Tile URL.
     */
    function (tileCoord) {
      if (tileCoord != null) {
        return template.replace(zRegEx, zoomReplacer(tileCoord[0])).replace(zPadRegEx, zoomReplacer(tileCoord[0], true)).replace(xRegEx, coordReplacer(tileCoord[1])).replace(yRegEx, function (part) {
          var y = -tileCoord[2] - 1;

          return coordReplacer(y)(part);
        }).replace(dashYRegEx, function (part) {
          var z = tileCoord[0];
          // The {-y} placeholder requires a tile grid with extent
          var range = calculateTileRangeForZ(tileGrid, extent, z);
          var y = getTileRangeHeight(range) + tileCoord[2];

          return coordReplacer(y)(part);
        });
      }
    }
  );
}

/**
 * Creates tile URL function from multiple templates.
 *
 * @param {string[]} templates Url templates
 * @param {ol.tilegrid.TileGrid} [tileGrid] Tile grid.
 * @param {ol.Extent | number[]} [extent] Tile grid extent.
 * @returns {ol.TileUrlFunctionType}
 * @private
 */
function createTileUrlFunctionFromTemplates(templates) {
  var tileGrid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : tilegrid.createXYZ();
  var extent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EPSG3857_EXTENT;

  return createTileUrlFunctionFromTileUrlFunctions(templates.map(function (tileUrlFunction) {
    return createTileUrlFunctionFromTemplate(tileUrlFunction, tileGrid, extent);
  }));
}

/**
 * @param zoom
 * @param pad
 * @returns {function}
 * @private
 */
function zoomReplacer(zoom, pad) {
  return function () {
    return pad ? zeroPad(zoom, 2) : zoom.toString();
  };
}

/**
 * @param coord
 * @returns {function}
 * @private
 */
function coordReplacer(coord) {
  return function (part) {
    var match = part.match(/\d/);

    if (match) {
      return zeroPad(coord, 9).slice((match[0] - 1) * 3, match[0] * 3);
    }

    return coord.toString();
  };
}

/**
 * @param {string} url
 * @returns {Array.<string>}
 * @private
 */
function expandUrl(url) {
  var urls = [];
  var match = /\{(\d)-(\d)\}/.exec(url) || /\{([a-z])-([a-z])\}/.exec(url);

  if (match) {
    var startCharCode = match[1].charCodeAt(0);
    var stopCharCode = match[2].charCodeAt(0);

    for (var charCode = startCharCode; charCode <= stopCharCode; ++charCode) {
      urls.push(url.replace(match[0], String.fromCharCode(charCode)));
    }
  } else {
    urls.push(url);
  }

  return urls;
}

/**
 * @param {Array.<ol.TileUrlFunctionType>} tileUrlFunctions
 * @returns {ol.TileUrlFunctionType}
 * @private
 */
function createTileUrlFunctionFromTileUrlFunctions(tileUrlFunctions) {
  if (tileUrlFunctions.length === 1) {
    return tileUrlFunctions[0];
  }

  return (
    /**
     * @param {ol.TileCoord} tileCoord Tile Coordinate.
     * @param {number} pixelRatio Pixel ratio.
     * @param {ol.proj.Projection} projection Projection.
     * @return {string | undefined} Tile URL.
     */
    function (tileCoord, pixelRatio, projection) {
      if (tileCoord != null) {
        var h = (tileCoord[1] << tileCoord[0]) + tileCoord[2];
        var index = modulo(h, tileUrlFunctions.length);

        return tileUrlFunctions[index](tileCoord, pixelRatio, projection);
      }
    }
  );
}

/* global '2.0.0-beta.4' */
/**
 * OpenLayers tile url function to load tile seeded with TileCache url scheme.
 *
 * @package ol-tilecache
 * @author Vladimir Vershinin <ghettovoice@gmail.com>
 * @licence MIT https://opensource.org/licenses/MIT
 * @copyright (c) 2016-2017, Vladimir Vershinin
 */
var index = {
  VERSION: '2.0.0-beta.4',
  createTileUrlFunction: createTileUrlFunction,
  createTileUrlFunctionFromTemplate: createTileUrlFunctionFromTemplate,
  createTileUrlFunctionFromTemplates: createTileUrlFunctionFromTemplates
};

export { createTileUrlFunction, createTileUrlFunctionFromTemplate, createTileUrlFunctionFromTemplates };export default index;
//# sourceMappingURL=bundle.es.js.map
