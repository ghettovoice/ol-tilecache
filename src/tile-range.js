/**
 * This file is part of ol-tilecache package.
 * @module ol-tilecache
 * @license MIT
 * @author Vladimir Vershinin
 */
import { isArray } from './util'
/**
 * @param {TileGrid} tileGrid
 * @param {number[]} extent
 * @param {number} z
 * @return {{minX, minY, maxX, maxY}}
 */
export function calculateTileRangeForZ (tileGrid, extent, z) {
  const resolution = tileGrid.getResolution(z)
  const [ minX, minY ] = getTileCoordForXYAndResolution(tileGrid, extent[ 0 ], extent[ 1 ], resolution, false)
  const [ maxX, maxY ] = getTileCoordForXYAndResolution(tileGrid, extent[ 2 ], extent[ 3 ], resolution, true)

  return { minX, minY, maxX, maxY }
}

/**
 * @param {TileGrid} tileGrid
 * @param {number} x
 * @param {number} y
 * @param {number} resolution
 * @param {boolean} reverseIntersectionPolicy
 * @return {number[]}
 */
export function getTileCoordForXYAndResolution (tileGrid, x, y, resolution, reverseIntersectionPolicy) {
  const z = tileGrid.getZForResolution(resolution)
  const scale = resolution / tileGrid.getResolution(z)
  const origin = tileGrid.getOrigin(z)
  let tileSize = tileGrid.getTileSize(z)

  if (!isArray(tileSize)) {
    tileSize = [ tileSize, tileSize ]
  }

  const adjustX = reverseIntersectionPolicy ? 0.5 : 0
  const adjustY = reverseIntersectionPolicy ? 0 : 0.5
  const xFromOrigin = Math.floor((x - origin[ 0 ]) / resolution + adjustX)
  const yFromOrigin = Math.floor((y - origin[ 1 ]) / resolution + adjustY)
  let tileCoordX = scale * xFromOrigin / tileSize[ 0 ]
  let tileCoordY = scale * yFromOrigin / tileSize[ 1 ]

  if (reverseIntersectionPolicy) {
    tileCoordX = Math.ceil(tileCoordX) - 1
    tileCoordY = Math.ceil(tileCoordY) - 1
  } else {
    tileCoordX = Math.floor(tileCoordX)
    tileCoordY = Math.floor(tileCoordY)
  }

  return [ tileCoordX, tileCoordY ]
}

/**
 * @param {{minX, minY, maxX, maxY}} tileRange
 * @return {number}
 */
export function getTileRangeHeight (tileRange) {
  return tileRange.maxY - tileRange.minY + 1
}
