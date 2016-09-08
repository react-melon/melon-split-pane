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
export function limitInRange(target, min, max) {

    return target > max
        ? max
        : (target < min ? min : target);

}


/**
 * Converts the first character of string to upper case and the remaining to lower case.
 *
 * @param  {string} str str
 * @return {string}
 */
export function capitalize(str = '') {
    return `${str.charAt(0).toUpperCase()}${str.slice(1).toLowerCase()}`;
}
