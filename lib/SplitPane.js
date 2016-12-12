(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', 'react', 'react-dom', 'melon-core/classname/cxBuilder', './Pane.js', './Spliter.js', './util.js', './babelHelpers'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('react'), require('react-dom'), require('melon-core/classname/cxBuilder'), require('./Pane.js'), require('./Spliter.js'), require('./util.js'), require('./babelHelpers'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.react, global.reactDom, global.cxBuilder, global.Pane, global.Spliter, global.util, global.babelHelpers);
        global.SplitPane = mod.exports;
    }
})(this, function (exports, _react, _reactDom, _cxBuilder, _Pane, _Spliter, _util, babelHelpers) {
    'use strict';

    exports.__esModule = true;
    exports.SplitPane = exports.Spliter = exports.Pane = exports.default = undefined;

    var _react2 = babelHelpers.interopRequireDefault(_react);

    var _Pane2 = babelHelpers.interopRequireDefault(_Pane);

    var _Spliter2 = babelHelpers.interopRequireDefault(_Spliter);

    /**
     * @file SplitPane
     * @author ludafa<ludafa@outlook.com>
     */

    var cx = (0, _cxBuilder.create)('SplitPane');

    /**
     * melon 拆分窗格
     */

    var SplitPane = function (_Component) {
        babelHelpers.inherits(SplitPane, _Component);

        /**
         * 构建函数
         *
         * @public
         * @param {*} props 属性
         */
        function SplitPane(props) {
            babelHelpers.classCallCheck(this, SplitPane);

            var _this = babelHelpers.possibleConstructorReturn(this, _Component.call(this, props));

            _this.onResizeStart = _this.onResizeStart.bind(_this);
            _this.onResizeEnd = _this.onResizeEnd.bind(_this);
            _this.onResize = _this.onResize.bind(_this);

            /**
             * 状态
             *
             * @private
             * @type {Object}
             */
            _this.state = {
                resizing: false,
                children: _this.getChildren(props)
            };

            /**
             * 窗口容器
             *
             * 用于存放在拖拽过程中的数据
             * 不放在 state 中的原因是这样可以提高性能
             *
             * @private
             * @type {Array.Object}
             */
            _this.panes = null;

            return _this;
        }

        /**
         * 当组件接受新属性时的处理
         *
         * @public
         * @param {Object} nextProps 新属性
         */


        SplitPane.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {

            // we do not repaint children while resizing
            if (this.props.children !== nextProps.children && !this.state.resizing) {
                this.setState({
                    children: this.getChildren(nextProps)
                });
            }
        };

        SplitPane.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
            return !(this.state.resizing === nextState.resizing && nextState.resizing);
        };

        SplitPane.prototype.componentWillUnmount = function componentWillUnmount() {
            this.panes = null;
        };

        SplitPane.prototype.getChildren = function getChildren(props) {
            var _this2 = this;

            var direction = props.direction;

            return _react.Children.toArray(props.children).filter(function (child) {
                return child.type === _Pane2['default'];
            }).reduce(function (children, child, index, arr) {

                children.push((0, _react.cloneElement)(child, { direction: direction }));

                if (index < arr.length - 1) {
                    children.push(_react2['default'].createElement(_Spliter2['default'], {
                        key: 'spliter-' + index,
                        direction: direction,
                        onResizeStart: _this2.onResizeStart,
                        onResize: function onResize(_ref) {
                            var delta = _ref.delta;
                            return _this2.onResize(index, delta);
                        },
                        onResizeEnd: _this2.onResizeEnd }));
                }

                return children;
            }, []);
        };

        SplitPane.prototype.onResizeStart = function onResizeStart() {

            var main = (0, _reactDom.findDOMNode)(this);

            this.setState({
                resizing: true
            });

            var panes = [].slice.call(main.childNodes);

            this.panes = this.state.children.filter(function (child) {
                return child.type === _Pane2['default'];
            }).map(function (child, index) {
                var _child$props = child.props,
                    _child$props$min = _child$props.min,
                    min = _child$props$min === undefined ? 0 : _child$props$min,
                    _child$props$max = _child$props.max,
                    max = _child$props$max === undefined ? Number.MAX_VALUE : _child$props$max;


                var node = panes[index * 2];

                var _node$getBoundingClie = node.getBoundingClientRect(),
                    width = _node$getBoundingClie.width,
                    height = _node$getBoundingClie.height;

                return {
                    width: width,
                    height: height,
                    max: max,
                    min: min,
                    node: node
                };
            });

            var onResizeStart = this.props.onResizeStart;

            if (onResizeStart) {
                onResizeStart();
            }
        };

        SplitPane.prototype.onResize = function onResize(index, delta) {
            var _props = this.props,
                direction = _props.direction,
                onResize = _props.onResize;


            var propName = direction === 'horizontal' ? 'width' : 'height';

            var panes = this.panes;

            var a = panes[index];
            var b = panes[index + 1];
            var aSize = a[propName];
            var bSize = b[propName];
            var total = aSize + bSize;
            var min = Math.max(a.min, total - b.max);
            var max = Math.min(a.max, total - b.min);
            var aNextSize = (0, _util.limitInRange)(aSize + delta, min, max);
            var bNextSize = total - aNextSize;

            var nextSizes = panes.map(function (pane, i) {

                if (pane === a) {
                    return aNextSize;
                }

                if (pane === b) {
                    return bNextSize;
                }

                return pane[propName];
            });

            var nextGrow = this.getGrow(nextSizes);

            var isChanged = nextGrow.some(function (grow, index) {
                return panes[index].grow !== grow;
            });

            if (!isChanged) {
                return;
            }

            panes = this.panes = panes.map(function (pane, i) {
                var node = pane.node,
                    rest = babelHelpers.objectWithoutProperties(pane, ['node']);


                var basis = 0;
                var shrink = 0;
                var grow = nextGrow[i];

                node.style.flexBasis = basis;
                node.style.flexShrink = shrink;
                node.style.flexGrow = grow;

                return babelHelpers['extends']({}, rest, {
                    node: node,
                    basis: basis,
                    shrink: shrink,
                    grow: grow
                });
            });

            if (onResize) {
                onResize(panes.map(function (pane) {
                    return {
                        grow: pane.grow,
                        basis: 0,
                        shrink: 0
                    };
                }));
            }
        };

        SplitPane.prototype.getGrow = function getGrow(columnLengths) {

            var sum = columnLengths.reduce(function (sum, length) {
                return sum + length;
            }, 0);

            var factors = columnLengths.map(function (length) {
                return length / sum;
            });

            var min = Math.min.apply(Math, factors);

            return factors.map(function (factor) {
                return factor / min;
            });
        };

        SplitPane.prototype.onResizeEnd = function onResizeEnd() {

            var onResizeEnd = this.props.onResizeEnd;

            var panes = this.panes;

            var rects = panes.map(function (pane) {
                var basis = pane.basis,
                    grow = pane.grow,
                    shrink = pane.shrink;


                return {
                    grow: grow,
                    shrink: shrink,
                    basis: basis
                };
            });

            var children = this.state.children;
            var nextChildren = [];

            for (var i = 0, j = 0, len = children.length; i < len; i++) {

                var child = children[i];

                if (child.type === _Pane2['default']) {
                    child = (0, _react.cloneElement)(child, rects[j++]);
                }

                nextChildren.push(child);
            }

            this.setState({
                resizing: false,
                children: nextChildren
            });

            if (onResizeEnd) {
                onResizeEnd({ rects: rects });
            }

            this.panes = null;
        };

        SplitPane.prototype.render = function render() {
            var _props2 = this.props,
                direction = _props2.direction,
                rest = babelHelpers.objectWithoutProperties(_props2, ['direction']);
            var _state = this.state,
                resizing = _state.resizing,
                children = _state.children;


            var className = cx(this.props).addVariants(direction).addStates({
                resizing: resizing
            }).build();

            return _react2['default'].createElement(
                'div',
                babelHelpers['extends']({}, rest, { className: className }),
                children
            );
        };

        return SplitPane;
    }(_react.Component);

    SplitPane.displayName = 'SplitPane';

    SplitPane.defaultProps = {
        direction: 'horizontal'
    };

    SplitPane.propTypes = {
        onResizeRestart: _react.PropTypes.func,
        onResize: _react.PropTypes.func,
        onResizeEnd: _react.PropTypes.func,
        direction: _react.PropTypes.oneOf(['horizontal', 'vertical']).isRequired
    };

    /* eslint-disable fecs-export-on-declare */
    exports.default = SplitPane;
    exports.Pane = _Pane2['default'];
    exports.Spliter = _Spliter2['default'];
    exports.SplitPane = SplitPane;
});
//# sourceMappingURL=SplitPane.js.map
