/**
 * @file SplitPane example
 * @author ludafa <ludafa@outlook.com>
 */

import React from 'react';
import SplitPane, {Pane} from '../src/SplitPane.js';
import ReactDOM from 'react-dom';

import './index.styl';

ReactDOM.render(
    <SplitPane
        style={{height: '100%'}}
        onResizeStart={() => console.log('resize-start')}
        onResize={e => console.log('resize', e)}
        onResizeEnd={e => {
            console.log('restart-end', e)
        }}>
        <Pane basis={240} grow={0} min={240} max={360}>
            width: min 240 - max 360
        </Pane>
        <Pane basis="480">bbb</Pane>
        <Pane basis="240" grow={0} min={240} max={500} style={{
            display: 'flex',
            flexDirection: 'column'
        }}>
            <SplitPane
                direction="vertical"
                style={{
                    display: 'flex',
                    flex: '1 0 100%'
                }}>
                <Pane>
                    width: min 240 - max 500
                </Pane>
                <Pane max={600} min={300}>
                    width: min 240 - max 500
                    height: min 300 - max 600
                </Pane>
            </SplitPane>
        </Pane>
    </SplitPane>,
    document.getElementById('app')
);
