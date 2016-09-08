/**
 * @file Pane
 * @author leon <ludafa@outlook.com>
 */

import React, {Component, PropTypes} from 'react';

import {create} from 'melon-core/classname/cxBuilder';

import {capitalize} from './util.js';

const cx = create('Pane');

export default class Pane extends Component {

    render() {

        const {
            children,
            max,
            min,
            basis,
            grow,
            shrink,
            direction,
            style
        } = this.props;

        const limitPropName = capitalize(direction === 'horizontal' ? 'width' : 'height');

        return (
            <div
                className={cx(this.props).build()}
                style={{
                    ...style,
                    flexBasis: basis,
                    flexGrow: grow,
                    flexShrink: shrink,
                    [`min${limitPropName}`]: min,
                    [`max${limitPropName}`]: max
                }}>
                {children}
            </div>
        );
    }

}

Pane.STYLE_CLASSNAME = cx.getPartClassName();

Pane.propTypes = {
    basis: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
    grow: PropTypes.number.isRequired,
    shrink: PropTypes.number.isRequired
};

Pane.defaultProps = {
    basis: 'auto',
    grow: 1,
    shrink: 1
};
