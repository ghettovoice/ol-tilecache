(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['openlayers'], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        
        module.exports = factory(require('openlayers'));
    } else {
        // Browser globals (root is window)
        root.ol.TileCacheUrlFunction = factory(root.ol);
    }
}(this, function(ol) {

/**
 * OpenLayers 3 OpenLayer 3 tile url function to load tile seeded with TileCache url schema.
 * Adds helper function for TileCache function creation.
 *
 * @author Vladimir Vershinin (https://github.com/ghettovoice)
 * @version 1.0.0
 * @license MIT https://opensource.org/licenses/MIT
 *          Based on OpenLayers 3. Copyright 2005-2015 OpenLayers Contributors. All rights reserved. http://openlayers.org
 * @copyright (c) 2015, Vladimir Vershinin https://github.com/ghettovoice
 */
ol.TileCacheUrlFunction = (function() {
    "use strict";

    /**
     * Create helper function.
     *
     * @param {string} url Url template
     * @returns {ol.TileUrlFunction}
     * @static
     * @public
     */
    function createTileUrlFunction(url) {
        return createTileUrlFunctionFromTemplates(expandUrl(url));
    }

    /**
     * @param num
     * @param places
     * @returns {string}
     * @private
     */
    function zeroPad(num, places) {
        var zero = places - num.toString().length + 1;
        return (new Array(+(zero > 0 && zero)).join("0") + num).toString().slice(-places);
    }

    /**
     * @param zoom
     * @param pad
     * @returns {function}
     * @private
     */
    function zoomReplacer(zoom, pad) {
        return function() {
            return pad ? zeroPad(zoom, 2) : zoom.toString();
        };
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
     * @private
     */
    function modulo(a, b) {
        var m = a % b;
        return (m * b) < 0 ? m + b : m;
    }

    /**
     * @param coord
     * @returns {function}
     * @private
     */
    function coordReplacer(coord) {
        return function(part) {
            var match = part.match(/\d/);

            if (match) {
                return zeroPad(coord, 9).slice((match[0] - 1) * 3, match[0] * 3);
            }

            return coord.toString();
        };
    }

    /**
     * @param {string} template Source url
     * @returns {ol.TileUrlFunction}
     * @private
     */
    function createTileUrlFunctionFromTemplate(template) {
        var zRegEx     = /\{z\}/g,
            zPadRegEx  = /\{0z\}/g,
            xRegEx     = /\{x\d?\}/g,
            yRegEx     = /\{y\d?\}/g,
            dashYRegEx = /\{-y\d?\}/g;

        return (
            /**
             * @param {ol.TileCoord} tileCoord Tile Coordinate.
             * @return {string|undefined} Tile URL.
             */
            function(tileCoord) {
                if (tileCoord != null) {
                    return template.replace(zRegEx, zoomReplacer(tileCoord[0]))
                        .replace(zPadRegEx, zoomReplacer(tileCoord[0], true))
                        .replace(xRegEx, coordReplacer(tileCoord[1]))
                        .replace(yRegEx, function(part) {
                            var y = -tileCoord[2] - 1;
                            return coordReplacer(y)(part);
                        })
                        .replace(dashYRegEx, function(part) {
                            var y = (1 << tileCoord[0]) + tileCoord[2];
                            return coordReplacer(y)(part);
                        });
                }
            });
    }

    /**
     * @param url
     * @returns {Array.<string>}
     * @private
     */
    function expandUrl(url) {
        var urls = [];
        var match = /\{(\d)-(\d)\}/.exec(url) || /\{([a-z])-([a-z])\}/.exec(url);

        if (match) {
            var startCharCode = match[1].charCodeAt(0);
            var stopCharCode = match[2].charCodeAt(0);
            var charCode;

            for (charCode = startCharCode; charCode <= stopCharCode; ++charCode) {
                urls.push(url.replace(match[0], String.fromCharCode(charCode)));
            }
        } else {
            urls.push(url);
        }

        return urls;
    }

    /**
     * @param {string[]} templates Url templates
     * @returns {ol.TileUrlFunction}
     * @private
     */
    function createTileUrlFunctionFromTemplates(templates) {
        return createTileUrlFunctionFromTileUrlFunctions(templates.map(createTileUrlFunctionFromTemplate));
    }

    /**
     * @param {Array.<ol.TileUrlFunction>} tileUrlFunctions
     * @returns {ol.TileUrlFunction}
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
             * @return {string|undefined} Tile URL.
             */
            function(tileCoord, pixelRatio, projection) {
                if (tileCoord != null) {
                    var h = (tileCoord[1] << tileCoord[0]) + tileCoord[2];
                    var index = modulo(h, tileUrlFunctions.length);
                    return tileUrlFunctions[index](tileCoord, pixelRatio, projection);
                }
            });
    }

    return { createTileUrlFunction: createTileUrlFunction };
}());

return ol.TileCacheUrlFunction;

}));
