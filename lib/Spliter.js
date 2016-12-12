(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', 'react', 'melon-core/classname/cxBuilder', './babelHelpers'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('react'), require('melon-core/classname/cxBuilder'), require('./babelHelpers'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.react, global.cxBuilder, global.babelHelpers);
        global.Spliter = mod.exports;
    }
})(this, function (exports, _react, _cxBuilder, babelHelpers) {
    'use strict';

    exports.__esModule = true;

    var _react2 = babelHelpers.interopRequireDefault(_react);

    /**
     * @file Spliter
     * @author leon <ludafa@outlook.com>
     */

    var cx = (0, _cxBuilder.create)('Spliter');

    /**
     * 分隔组件
     *
     * @extends React.Component
     */

    var Spliter = function (_Component) {
        babelHelpers.inherits(Spliter, _Component);

        /**
         * 构建函数
         *
         * @public
         * @param {...*} args 参数
         */
        function Spliter() {
            babelHelpers.classCallCheck(this, Spliter);

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            var _this = babelHelpers.possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args)));

            _this.onMouseDown = _this.onMouseDown.bind(_this);
            _this.onMouseMove = _this.onMouseMove.bind(_this);
            _this.onMouseUp = _this.onMouseUp.bind(_this);

            /**
             * 状态
             * @type {Object}
             */
            _this.state = {};

            /**
             * 在拖拽开始时的屏幕横坐标
             * @type {number}
             */
            _this.x = null;

            /**
             * 在拖拽开始时的屏幕纵坐标
             * @type {number}
             */
            _this.y = null;
            return _this;
        }

        /**
         * 当 spliter 的鼠标弹按下时的处理
         *
         * @protected
         * @param {Object} e 事件
         */


        Spliter.prototype.onMouseDown = function onMouseDown(e) {

            if (e.button !== 0) {
                return;
            }

            window.addEventListener('mousemove', this.onMouseMove);
            window.addEventListener('mouseup', this.onMouseUp);

            var clientX = e.clientX,
                clientY = e.clientY;


            this.x = clientX;
            this.y = clientY;

            this.setState({ resizing: true });

            this.props.onResizeStart();
        };

        Spliter.prototype.onMouseMove = function onMouseMove(e) {
            var clientX = e.clientX,
                clientY = e.clientY;
            var _props = this.props,
                onResize = _props.onResize,
                direction = _props.direction;


            onResize({
                delta: direction === 'horizontal' ? clientX - this.x : clientY - this.y
            });
        };

        Spliter.prototype.onMouseUp = function onMouseUp(e) {

            this.onMouseMove(e);

            this.x = this.y = 0;

            window.removeEventListener('mousemove', this.onMouseMove);
            window.removeEventListener('mouseup', this.onMouseUp);

            this.setState({
                resizing: false
            }, this.props.onResizeEnd);
        };

        Spliter.prototype.render = function render() {
            var _props2 = this.props,
                direction = _props2.direction,
                children = _props2.children,
                rest = babelHelpers.objectWithoutProperties(_props2, ['direction', 'children']);


            var className = cx(this.props).addStates({ resizing: this.state.resizing }).addVariants(direction).build();

            return _react2['default'].createElement(
                'div',
                babelHelpers['extends']({}, rest, {
                    className: className,
                    onMouseDown: this.onMouseDown }),
                children
            );
        };

        return Spliter;
    }(_react.Component);

    exports['default'] = Spliter;


    Spliter.propTypes = {
        onResize: _react.PropTypes.func.isRequired,
        onResizeStart: _react.PropTypes.func.isRequired,
        onResizeEnd: _react.PropTypes.func.isRequired
    };
});
//# sourceMappingURL=Spliter.js.map
