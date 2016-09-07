/**
 * @file SplitPane example
 * @author ludafa <ludafa@outlook.com>
 */

import React from 'react';
import SplitPane, {Pane} from '../src/SplitPane.js';
import ReactDOM from 'react-dom';

import './index.styl';

ReactDOM.render(
    <SplitPane style={{height: '100%'}}>
        <Pane basis={240} grow={0} minWidth={240} maxWidth={300}>
            <div
                style={{
                    display: 'flex'
                }}>
                width: min 240 - max 300
            </div>
        </Pane>
        <Pane basis="480">bbb</Pane>
        <Pane basis="240" grow={0} minWidth={240} maxWidth={300}>
            <SplitPane
                direction="vertical"
                style={{
                    display: 'flex',
                    flex: 1,
                    height: '100%'
                }}>
                <Pane>
                    width: min 240 - max 300
                </Pane>
                <Pane>
                    width: min 240 - max 300
                </Pane>
            </SplitPane>
        </Pane>
    </SplitPane>,
    document.getElementById('app')
);
