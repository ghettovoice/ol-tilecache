/**
 * This file is part of ol-tilecache package.
 * @module ol-tilecache
 * @license MIT
 * @author Vladimir Vershinin
 */
import { createXYZ } from 'ol/tilegrid'
import { modulo, zeroPad } from './util'

const zRegEx = /{z}/g
const zPadRegEx = /{0z}/g
const xRegEx = /{x\d?}/g
const yRegEx = /{y\d?}/g
const dashYRegEx = /{-y\d?}/g

/**
 * Basic create factory.
 *
 * @param {string} url Url template
 * @param {TileGrid} [tileGrid] Tile grid.
 * @returns {function(tileCoord: TileCoord)}
 * @static
 * @public
 */
export function createTileUrlFunction (url, tileGrid = createXYZ()) {
  return createTileUrlFunctionFromTemplates(expandUrl(url), tileGrid)
}

/**
 * Creates tile URL function from single template.
 *
 * @param {string} template Source url
 * @param {TileGrid} [tileGrid] Tile grid.
 * @returns {function(tileCoord: TileCoord)}
 * @private
 */
export function createTileUrlFunctionFromTemplate (template, tileGrid = createXYZ()) {
  return (
    /**
     * @param {TileCoord} tileCoord Tile Coordinate.
     * @return {string | undefined} Tile URL.
     */
    function (tileCoord) {
      if (tileCoord != null) {
        return template.replace(zRegEx, zoomReplacer(tileCoord[0]))
          .replace(zPadRegEx, zoomReplacer(tileCoord[0], true))
          .replace(xRegEx, coordReplacer(tileCoord[1]))
          .replace(yRegEx, coordReplacer(tileCoord[2]))
          .replace(dashYRegEx, function (part) {
            const z = tileCoord[0]
            const range = tileGrid.getFullTileRange(z)
            if (!range) throw new Error('The {-y} placeholder requires a tile grid with extent.')
            const y = range.getHeight() - tileCoord[2] - 1

            return coordReplacer(y)(part)
          })
      }
    })
}

/**
 * Creates tile URL function from multiple templates.
 *
 * @param {string[]} templates Url templates
 * @param {TileGrid} [tileGrid] Tile grid.
 * @returns {function(tileCoord: TileCoord)}
 * @private
 */
export function createTileUrlFunctionFromTemplates (templates, tileGrid = createXYZ()) {
  return createTileUrlFunctionFromTileUrlFunctions(
    templates.map(tileUrlFunction => createTileUrlFunctionFromTemplate(tileUrlFunction, tileGrid)),
  )
}

/**
 * @param zoom
 * @param pad
 * @returns {function}
 * @private
 */
function zoomReplacer (zoom, pad) {
  return function () {
    return pad ? zeroPad(zoom, 2) : zoom.toString()
  }
}

/**
 * @param coord
 * @returns {function}
 * @private
 */
function coordReplacer (coord) {
  return function (part) {
    const match = part.match(/\d/)

    if (match) {
      return zeroPad(coord, 9).slice((match[0] - 1) * 3, match[0] * 3)
    }

    return coord.toString()
  }
}

/**
 * @param {string} url
 * @returns {Array.<string>}
 * @private
 */
function expandUrl (url) {
  const urls = []
  const match = /{(\d)-(\d)}/.exec(url) ||
    /{([a-z])-([a-z])}/.exec(url)

  if (match) {
    const startCharCode = match[1].charCodeAt(0)
    const stopCharCode = match[2].charCodeAt(0)

    for (let charCode = startCharCode; charCode <= stopCharCode; ++charCode) {
      urls.push(url.replace(match[0], String.fromCharCode(charCode)))
    }
  } else {
    urls.push(url)
  }

  return urls
}

/**
 * @param {Array.<function(tileCoord: TileCoord)>} tileUrlFunctions
 * @returns {function(tileCoord: TileCoord)}
 * @private
 */
function createTileUrlFunctionFromTileUrlFunctions (tileUrlFunctions) {
  if (tileUrlFunctions.length === 1) {
    return tileUrlFunctions[0]
  }

  return (
    /**
     * @param {TileCoord} tileCoord Tile Coordinate.
     * @param {number} pixelRatio Pixel ratio.
     * @param {Projection} projection Projection.
     * @return {string | undefined} Tile URL.
     */
    function (tileCoord, pixelRatio, projection) {
      if (tileCoord != null) {
        const h = (tileCoord[1] << tileCoord[0]) + tileCoord[2]
        const index = modulo(h, tileUrlFunctions.length)

        return tileUrlFunctions[index](tileCoord, pixelRatio, projection)
      }
    })
}
