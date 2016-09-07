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
