/**
 * @file SplitPane
 * @author ludafa<ludafa@outlook.com>
 */

import React, {PropTypes, Component, Children} from 'react';
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

    constructor(props, context) {

        super(props, context);

        this.onStartResize = this.onStartResize.bind(this);
        this.onEndResize = this.onEndResize.bind(this);
        this.onResize = this.onResize.bind(this);

    }

    /**
     * 当组件被挂载时的处理
     *
     * @public
     */
    componentWillMount() {
        this.children = this.getChildren(this.props);
    }

    /**
     * 当组件接受新属性时的处理
     *
     * @public
     * @param {Object} nextProps 新属性
     */
    componentWillReceiveProps(nextProps) {
        if (this.props.children !== nextProps.children) {
            this.children = this.getChildren(nextProps);
        }
    }

    /**
     * 当组件即将被销毁时的处理
     *
     * @public
     */
    componentWillUnmount() {
        this.children = null;
    }

    /**
     * 获取内容
     *
     * @param {Object} props 属性
     * @return {Array.Object}
     */
    getChildren(props) {
        return Children
            .toArray(this.props.children)
            .filter(child => child.type === Pane || child.type === Spliter)
            .reduce((children, child, index, arr) => {

                children.push(child);

                if (child.type === Pane && index < arr.length - 1 && arr[index + 1].type !== Spliter) {
                    children.push((
                        <Spliter
                            key={`spliter-${index}`}
                            onResizeStart={this.onStartResize}
                            onResize={({width, height}) => this.onResize(index, width, height)}
                            onResizeEnd={this.onEndResize} />
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
    onStartResize() {

        const main = findDOMNode(this);

        main.classList.add(SplitPane.RESIZING_CLASS_NAME);

        const nodes = Array.from(main.childNodes);

        this.nodes = this.children
            .filter(child => child.type === Pane)
            .map((child, index) => {

                const {
                    minWidth = 0,
                    maxWidth = Number.MAX_VALUE,
                    minHeight = 0,
                    maxHeight = Number.MAX_VALUE
                } = child.props;

                const node = nodes[index * 2];

                const {
                    width,
                    height
                } = node.getBoundingClientRect();

                return {
                    width,
                    height,
                    minWidth,
                    maxWidth,
                    minHeight,
                    maxHeight,
                    node
                };

            });


    }

    /**
     * 调整大小
     *
     * @private
     * @param {number} index  当前的 spliter 序号
     * @param {number} width  水平方向的拖动位移
     * @param {number} height 垂直方向的拖动位移
     */
    onResize(index, width, height) {

        const a = this.nodes[index];
        const b = this.nodes[index + 1];

        const direction = this.props.direction;

        if (direction === 'horizontal') {
            this.update('width', width, a, b);
        }

        if (direction === 'vertical') {
            this.update('height', height, a, b);
        }

    }

    /**
     * 更新 pane 的大小
     *
     * @private
     * @param {string} prop  属性名
     * @param {number} value 值
     * @param {Object} a     左框体
     * @param {Object} b     右框体
     */
    update(prop, value, a, b) {

        const total = a[prop] + b[prop];
        const maxPropName = `max${prop.charAt(0).toUpperCase()}${prop.slice(1)}`;
        const minPropName = `min${prop.charAt(0).toUpperCase()}${prop.slice(1)}`;

        const min = Math.max(a[minPropName], total - b[maxPropName]);
        const max = Math.min(a[maxPropName], total - b[minPropName]);

        const current = limitInRange(a[prop] + value, min, max);

        a.node.style[minPropName] = a.node.style[maxPropName] = current + 'px';
        b.node.style[minPropName] = b.node.style[maxPropName] = (total - current) + 'px';

    }

    /**
     * 当结束拖拽时的处理
     *
     * @private
     */
    onEndResize() {
        this.nodes = null;
        findDOMNode(this).classList.remove(SplitPane.RESIZING_CLASS_NAME);
    }


    /**
     * 渲染
     *
     * @public
     * @return {React.Element}
     */
    render() {

        let {
            direction,
            ...rest
        } = this.props;

        const className = cx(this.props)
            .addVariants(direction)
            .build();

        return (
            <div
                {...rest}
                className={className}>
                {this.children}
            </div>
        );
    }

}

SplitPane.RESIZING_CLASS_NAME = 'state-resizing';

SplitPane.displayName = 'SplitPane';

SplitPane.defaultProps = {
    direction: 'horizontal'
};

SplitPane.propTypes = {
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
