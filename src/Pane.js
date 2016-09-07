/**
 * @file Pane
 * @author leon <ludafa@outlook.com>
 */

import React, {Component, PropTypes} from 'react';

import {create} from 'melon-core/classname/cxBuilder';

const cx = create('Pane');

export default class Pane extends Component {

    render() {

        const {
            children,
            maxWidth,
            minWidth,
            basis,
            grow,
            shrink
        } = this.props;

        return (
            <div
                className={cx(this.props).build()}
                style={{
                    flexBasis: basis,
                    flexGrow: grow,
                    flexShrink: shrink,
                    maxWidth,
                    minWidth
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
