//@flow
import ol from "openlayers";
import { zeroPad, modulo } from "./util";

const zRegEx = /\{z\}/g;
const zPadRegEx = /\{0z\}/g;
const xRegEx = /\{x\d?\}/g;
const yRegEx = /\{y\d?\}/g;
const dashYRegEx = /\{-y\d?\}/g;

/**
 * Create helper function.
 *
 * @param {string} url Url template
 * @returns {ol.TileUrlFunctionType}
 * @static
 * @public
 */
export default function createTileUrlFunction(url) {
    return createTileUrlFunctionFromTemplates(expandUrl(url));
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
        const match = part.match(/\d/);

        if (match) {
            return zeroPad(coord, 9).slice((match[0] - 1) * 3, match[0] * 3);
        }

        return coord.toString();
    };
}

/**
 * @param {string} template Source url
 * @returns {ol.TileUrlFunctionType}
 * @private
 */
function createTileUrlFunctionFromTemplate(template) {
    return (
        /**
         * @param {ol.TileCoord} tileCoord Tile Coordinate.
         * @return {string | undefined} Tile URL.
         */
        function(tileCoord) {
            if (tileCoord != null) {
                return template.replace(zRegEx, zoomReplacer(tileCoord[0]))
                               .replace(zPadRegEx, zoomReplacer(tileCoord[0], true))
                               .replace(xRegEx, coordReplacer(tileCoord[1]))
                               .replace(yRegEx, function (part) {
                                   const y = -tileCoord[2] - 1;

                                   return coordReplacer(y)(part);
                               })
                               .replace(dashYRegEx, function (part) {
                                   const y = (1 << tileCoord[0]) + tileCoord[2];

                                   return coordReplacer(y)(part);
                               });
            }
        });
}

/**
 * @param {string} url
 * @returns {Array.<string>}
 * @private
 */
function expandUrl(url) {
    const urls = [];
    const match = /\{(\d)-(\d)\}/.exec(url) ||
                  /\{([a-z])-([a-z])\}/.exec(url);

    if (match) {
        const startCharCode = match[1].charCodeAt(0);
        const stopCharCode = match[2].charCodeAt(0);

        for (let charCode = startCharCode; charCode <= stopCharCode; ++charCode) {
            urls.push(url.replace(match[0], String.fromCharCode(charCode)));
        }
    } else {
        urls.push(url);
    }

    return urls;
}

/**
 * @param {string[]} templates Url templates
 * @returns {ol.TileUrlFunctionType}
 * @private
 */
function createTileUrlFunctionFromTemplates(templates) {
    return createTileUrlFunctionFromTileUrlFunctions(templates.map(createTileUrlFunctionFromTemplate));
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
                const h = (tileCoord[1] << tileCoord[0]) + tileCoord[2];
                const index = modulo(h, tileUrlFunctions.length);

                return tileUrlFunctions[index](tileCoord, pixelRatio, projection);
            }
        });
}
