/**
 * @file Spliter
 * @author leon <ludafa@outlook.com>
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {create} from 'melon-core/classname/cxBuilder';

const cx = create('Spliter');

/**
 * 分隔组件
 *
 * @extends React.Component
 */
export default class Spliter extends Component {

    /**
     * 构建函数
     *
     * @public
     * @param {...*} args 参数
     */
    constructor(...args) {

        super(...args);

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);

        /**
         * 状态
         * @type {Object}
         */
        this.state = {};

        /**
         * 在拖拽开始时的屏幕横坐标
         * @type {number}
         */
        this.x = null;

        /**
         * 在拖拽开始时的屏幕纵坐标
         * @type {number}
         */
        this.y = null;
    }

    /**
     * 当 spliter 的鼠标弹按下时的处理
     *
     * @protected
     * @param {Object} e 事件
     */
    onMouseDown(e) {

        if (e.button !== 0) {
            return;
        }

        window.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('mouseup', this.onMouseUp);

        const {
            clientX,
            clientY
        } = e;

        this.x = clientX;
        this.y = clientY;

        this.setState({resizing: true});

        this.props.onResizeStart();

    }

    /**
     * 当 spliter 的鼠标移动时的处理
     *
     * @protected
     * @param {Object} e 事件
     */
    onMouseMove(e) {

        const {
            clientX,
            clientY
        } = e;

        const {
            onResize,
            direction
        } = this.props;

        onResize({
            delta: direction === 'horizontal' ? clientX - this.x : clientY - this.y
        });

    }

    /**
     * 当 spliter 的鼠标弹起时的处理
     *
     * @protected
     * @param {Object} e 事件
     */
    onMouseUp(e) {

        this.onMouseMove(e);

        this.x = this.y = 0;

        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('mouseup', this.onMouseUp);

        this.setState(
            {
                resizing: false
            },
            this.props.onResizeEnd
        );

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
            children
        } = this.props;

        const className = cx(this.props)
            .addStates({resizing: this.state.resizing})
            .addVariants(direction)
            .build();

        return (
            <div
                className={className}
                onMouseDown={this.onMouseDown}>
                {children}
            </div>
        );
    }

}

Spliter.propTypes = {
    direction: PropTypes.oneOf(['horizontal', 'vertical']).isRequired,
    onResize: PropTypes.func.isRequired,
    onResizeStart: PropTypes.func.isRequired,
    onResizeEnd: PropTypes.func.isRequired
};
