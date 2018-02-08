/**
 * This file is part of ol-tilecache package.
 * @module ol-tilecache
 * @license MIT
 * @author Vladimir Vershinin
 */

/**
 * Left zero pad.
 *
 * @param {string | number} num
 * @param {number} places
 * @returns {string}
 */
export function zeroPad (num, places) {
  const zero = places - num.toString().length + 1

  return (new Array(parseInt(zero > 0 && zero, 10)).join("0") + num)
    .toString()
    .slice(-places)
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
export function modulo (a, b) {
  const m = a % b

  return (m * b) < 0 ? m + b : m
}

/**
 * @param {*} value
 * @param {string} [message]
 * @throws {Error} Throws on false value
 */
export function assert (value, message = 'Assertion failed') {
  if (!value) {
    throw new Error(message)
  }
}

export function isArray (value) {
  return Object.prototype.toString.call(value) === '[object Array]'
}
