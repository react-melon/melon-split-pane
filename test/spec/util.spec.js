/**
 * @file util 测试用例
 * @author ludafa <ludafa@outlook.com>
 */

import * as util from '../../src/util.js';

describe('util', function () {

    it('`limitInRange` should work', function () {
        expect(typeof util.limitInRange === 'function').toBe(true);
        expect(util.limitInRange(100, 0, 1000)).toBe(100);
        expect(util.limitInRange(100, 100, 1000)).toBe(100);
        expect(util.limitInRange(1000, 100, 1000)).toBe(1000);
        expect(util.limitInRange(1, 10, 1000)).toBe(10);
        expect(util.limitInRange(1001, 0, 1000)).toBe(1000);
    });

    it('`capitalize` should work', function () {
        expect(typeof util.capitalize === 'function').toBe(true);
        expect(util.capitalize('width')).toBe('Width');
        expect(util.capitalize('WIDTH')).toBe('Width');
    });

});
