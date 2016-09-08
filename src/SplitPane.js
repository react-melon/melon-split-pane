/**
 * @file SplitPane
 * @author ludafa<ludafa@outlook.com>
 */

import React, {PropTypes, Component, Children, cloneElement} from 'react';
import {findDOMNode} from 'react-dom';

import {create} from 'melon-core/classname/cxBuilder';
import Pane from './Pane.js';
import Spliter from './Spliter.js';
import {limitInRange} from './util.js';

const cx = create('SplitPane');

/**
 * melon 拆分窗格
 */
class SplitPane extends Component {

    /**
     * 构建函数
     *
     * @public
     * @param {*} props 属性
     */
    constructor(props) {

        super(props);

        this.onResizeStart = this.onResizeStart.bind(this);
        this.onResizeEnd = this.onResizeEnd.bind(this);
        this.onResize = this.onResize.bind(this);

        /**
         * 状态
         *
         * @private
         * @type {Object}
         */
        this.state = {
            resizing: false,
            children: this.getChildren(props)
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
        this.panes = null;

    }

    /**
     * 当组件接受新属性时的处理
     *
     * @public
     * @param {Object} nextProps 新属性
     */
    componentWillReceiveProps(nextProps) {

        // we do not repaint children while resizing
        if (this.props.children !== nextProps.children && !this.state.resizing) {
            this.setState({
                children: this.getChildren(nextProps)
            });
        }

    }

    /**
     * 是否需要更新
     *
     * 我们在 resize 的过程中不会进行 react 的更新
     *
     * @param {*} nextProps 下一个属性
     * @param {*} nextState 下一个状态
     * @return {boolean}
     */
    shouldComponentUpdate(nextProps, nextState) {
        return !(this.state.resizing === nextState.resizing && nextState.resizing);
    }

    /**
     * 当组件即将被销毁时的处理
     *
     * @public
     */
    componentWillUnmount() {
        this.panes = null;
    }

    /**
     * 获取内容
     *
     * @param {Object} props 属性
     * @return {Array.Object}
     */
    getChildren(props) {

        const direction = props.direction;

        return Children
            .toArray(props.children)
            .filter(child => child.type === Pane)
            .reduce((children, child, index, arr) => {

                children.push(cloneElement(child, {direction}));

                if (index < arr.length - 1) {
                    children.push((
                        <Spliter
                            key={`spliter-${index}`}
                            direction={direction}
                            onResizeStart={this.onResizeStart}
                            onResize={({delta}) => this.onResize(index, delta)}
                            onResizeEnd={this.onResizeEnd} />
                    ));
                }

                return children;

            }, []);
    }


    /**
     * 开始拖拽调整大小
     *
     * @private
     */
    onResizeStart() {

        const main = findDOMNode(this);

        this.setState({
            resizing: true
        });

        const panes = Array.from(main.childNodes);

        this.panes = this.state.children
            .filter(child => child.type === Pane)
            .map((child, index) => {

                const {
                    min = 0,
                    max = Number.MAX_VALUE
                } = child.props;

                const node = panes[index * 2];

                const {
                    width,
                    height
                } = node.getBoundingClientRect();

                return {
                    width,
                    height,
                    max,
                    min,
                    node
                };

            });

        const onResizeStart = this.props.onResizeStart;

        if (onResizeStart) {
            onResizeStart();
        }

    }

    /**
     * 调整大小
     *
     * @private
     * @param {number} index  当前的 spliter 序号
     * @param {number} delta  拖动位移
     */
    onResize(index, delta) {

        const {
            direction,
            onResize
        } = this.props;

        const propName = direction === 'horizontal' ? 'width' : 'height';

        let panes = this.panes;

        const a = panes[index];
        const b = panes[index + 1];
        const aSize = a[propName];
        const bSize = b[propName];
        const total = aSize + bSize;
        const min = Math.max(a.min, total - b.max);
        const max = Math.min(a.max, total - b.min);
        const aNextSize = limitInRange(aSize + delta, min, max);
        const bNextSize = total - aNextSize;

        const nextSizes = panes.map((pane, i) => {

            if (pane === a) {
                return aNextSize;
            }

            if (pane === b) {
                return bNextSize;
            }

            return pane[propName];

        });

        const nextGrow = this.getGrow(nextSizes);

        const isChanged = nextGrow.some((grow, index) => panes[index].grow !== grow);

        if (!isChanged) {
            return;
        }

        panes = this.panes = panes.map((pane, i) => {

            const {
                node,
                ...rest
            } = pane;

            const basis = 0;
            const shrink = 0;
            const grow = nextGrow[i];

            node.style.flexBasis = basis;
            node.style.flexShrink = shrink;
            node.style.flexGrow = grow;

            return {
                ...rest,
                node,
                basis,
                shrink,
                grow
            };

        });

        if (onResize) {
            onResize(panes.map(pane => {
                return {
                    grow: pane.grow,
                    basis: 0,
                    shrink: 0
                };
            }));
        }

    }

    /**
     * get grow factor for columns
     *
     * @param {Array.number} columnLengths array of comlumn length
     * @return {Array.number}
     */
    getGrow(columnLengths) {

        const sum = columnLengths.reduce((sum, length) => sum + length, 0);

        const factors = columnLengths.map(length => length / sum);

        const min = Math.min(...factors);

        return factors.map(factor => factor / min);

    }

    /**
     * 当结束拖拽时的处理
     *
     * @private
     */
    onResizeEnd() {

        const onResizeEnd = this.props.onResizeEnd;

        let panes = this.panes;

        const rects = panes.map(pane => {

            const {
                basis,
                grow,
                shrink
            } = pane;

            return {
                grow,
                shrink,
                basis
            };

        });

        let children = this.state.children;
        let nextChildren = [];

        for (let i = 0, j = 0, len = children.length; i < len; i++) {

            let child = children[i];

            if (child.type === Pane) {
                child = cloneElement(child, rects[j++]);
            }

            nextChildren.push(child);

        }

        this.setState({
            resizing: false,
            children: nextChildren
        });

        if (onResizeEnd) {
            onResizeEnd({rects});
        }

        this.panes = null;

    }

    /**
     * 渲染
     *
     * @public
     * @return {React.Element}
     */
    render() {

        const {
            direction,
            ...rest
        } = this.props;

        const {
            resizing,
            children
        } = this.state;

        const className = cx(this.props)
            .addVariants(direction)
            .addStates({
                resizing
            })
            .build();

        return (
            <div {...rest} className={className}>
                {children}
            </div>
        );
    }

}

SplitPane.displayName = 'SplitPane';

SplitPane.defaultProps = {
    direction: 'horizontal'
};

SplitPane.propTypes = {
    onResizeRestart: PropTypes.func,
    onResize: PropTypes.func,
    onResizeEnd: PropTypes.func,
    direction: PropTypes.oneOf(['horizontal', 'vertical']).isRequired
};

/* eslint-disable fecs-export-on-declare */
export {
    SplitPane as default,
    Pane,
    Spliter,
    SplitPane
};
/* eslint-enable fecs-export-on-declare */
