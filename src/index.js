/**
 * This file is part of ol-tilecache package.
 * @module ol-tilecache
 * @license MIT
 * @author Vladimir Vershinin
 */
import {
  createTileUrlFunction,
  createTileUrlFunctionFromTemplate,
  createTileUrlFunctionFromTemplates
} from './tile-url-function'

export {
  createTileUrlFunction,
  createTileUrlFunctionFromTemplate,
  createTileUrlFunctionFromTemplates
}

// for backward compatibility
if (typeof window !== 'undefined' && window.ol) {
  window.ol.tileCacheUrlFn = {
    createTileUrlFunction,
    createTileUrlFunctionFromTemplate,
    createTileUrlFunctionFromTemplates,
  }
}
