(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.util = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  exports.__esModule = true;
  exports.limitInRange = limitInRange;
  exports.capitalize = capitalize;
  /**
   * @file util
   * @author leon <ludafa@outlook.com>
   */

  /**
   * 将指定的数字限制在一个范围内
   *
   * @param  {number} target target
   * @param  {number} min    min
   * @param  {number} max    max
   * @return {number}
   */
  function limitInRange(target, min, max) {

    return target > max ? max : target < min ? min : target;
  }

  /**
   * Converts the first character of string to upper case and the remaining to lower case.
   *
   * @param  {string} str str
   * @return {string}
   */
  function capitalize() {
    var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    return '' + str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
});
//# sourceMappingURL=util.js.map
