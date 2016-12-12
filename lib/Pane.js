(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', 'react', 'melon-core/classname/cxBuilder', './util.js', './babelHelpers'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('react'), require('melon-core/classname/cxBuilder'), require('./util.js'), require('./babelHelpers'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.react, global.cxBuilder, global.util, global.babelHelpers);
        global.Pane = mod.exports;
    }
})(this, function (exports, _react, _cxBuilder, _util, babelHelpers) {
    'use strict';

    exports.__esModule = true;

    var _react2 = babelHelpers.interopRequireDefault(_react);

    /**
     * @file Pane
     * @author leon <ludafa@outlook.com>
     */

    var cx = (0, _cxBuilder.create)('Pane');

    /**
     * 窗口容器
     *
     * @extends React.Component
     */

    var Pane = function (_Component) {
        babelHelpers.inherits(Pane, _Component);

        function Pane() {
            babelHelpers.classCallCheck(this, Pane);
            return babelHelpers.possibleConstructorReturn(this, _Component.apply(this, arguments));
        }

        Pane.prototype.render = function render() {
            var _babelHelpers$extends;

            var _props = this.props,
                children = _props.children,
                max = _props.max,
                min = _props.min,
                basis = _props.basis,
                grow = _props.grow,
                shrink = _props.shrink,
                direction = _props.direction,
                style = _props.style;


            var limitPropName = (0, _util.capitalize)(direction === 'horizontal' ? 'width' : 'height');

            return _react2['default'].createElement(
                'div',
                {
                    className: cx(this.props).build(),
                    style: babelHelpers['extends']({}, style, (_babelHelpers$extends = {
                        flexBasis: basis,
                        flexGrow: grow,
                        flexShrink: shrink
                    }, _babelHelpers$extends['min' + limitPropName] = min, _babelHelpers$extends['max' + limitPropName] = max, _babelHelpers$extends)) },
                children
            );
        };

        return Pane;
    }(_react.Component);

    exports['default'] = Pane;


    Pane.STYLE_CLASSNAME = cx.getPartClassName();

    Pane.propTypes = {
        basis: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
        grow: _react.PropTypes.number.isRequired,
        shrink: _react.PropTypes.number.isRequired
    };

    Pane.defaultProps = {
        basis: 'auto',
        grow: 1,
        shrink: 1
    };
});
//# sourceMappingURL=Pane.js.map
