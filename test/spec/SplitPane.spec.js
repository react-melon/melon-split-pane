/**
 * @file SplitPane 测试用例
 * @author ludafa <ludafa@outlook.com>
 */

import React, {Component} from 'react';
import {findDOMNode, unmountComponentAtNode} from 'react-dom';
import SplitPane, {Pane, Spliter} from '../../src/SplitPane.js';
import TestUtils from 'react-dom/test-utils';

describe('SplitPane', function () {

    it('inject `Spliter` between panes', function () {

        const root = TestUtils.renderIntoDocument(
            <SplitPane direction="vertical">
                <Pane>aa</Pane>
                <Pane max={100}>bbb</Pane>
            </SplitPane>
        );

        const splitPane = TestUtils.findRenderedComponentWithType(root, SplitPane);

        expect(splitPane.state.children.length).toBe(3);

        splitPane.state.children.forEach(function (child, index) {
            if (index % 2 === 0) {
                expect(child.type === Pane).toBe(true);
            }
            else {
                expect(child.type === Spliter).toBe(true);
            }
        });

    });

    it('should work', function () {

        const resizeStartSpy = jasmine.createSpy('start-resize');
        const resizeSpy = jasmine.createSpy('resize');
        const resizeEndSpy = jasmine.createSpy('end-resize');

        class App extends Component {

            constructor(...args) {
                super(...args);
                this.state = {
                    children: ['a', 'b']
                };
            }

            render() {

                const children = this.state.children;

                return (
                    <SplitPane
                        direction="vertical"
                        onResizeStart={resizeStartSpy}
                        onResize={resizeSpy}
                        onResizeEnd={resizeEndSpy}>
                        <Pane>{children[0]}</Pane>
                        <Pane max={100}>{children[1]}</Pane>
                        <Pane max={100}>aaa</Pane>
                    </SplitPane>
                );

            }
        }

        const root = TestUtils.renderIntoDocument(<App />);

        const app = TestUtils.findRenderedComponentWithType(root, App);
        const splitPane = TestUtils.findRenderedComponentWithType(root, SplitPane);

        const spliters = TestUtils.scryRenderedComponentsWithType(root, Spliter);

        expect(spliters.length).toBe(2);

        const spliter = spliters[0];

        const spliterElement = findDOMNode(spliter);

        const {
            top,
            left
        } = spliterElement.getBoundingClientRect();

        const splitPaneChildren1 = splitPane.state.children;

        app.setState({
            children: ['1', '2']
        });

        expect(splitPane.state.children).not.toBe(splitPaneChildren1);

        TestUtils.Simulate.mouseDown(spliterElement, {button: 0, clientX: left, clientY: top});

        expect(splitPane.state.resizing).toBe(true);
        expect(splitPane.panes.length).toBe(3);
        expect(resizeStartSpy).toHaveBeenCalled();

        const splitPaneChildren2 = splitPane.state.children;

        app.setState({
            children: ['1', '2']
        });

        expect(splitPane.state.children).toBe(splitPaneChildren2);

        window.dispatchEvent(new MouseEvent('mousemove', {
            clientX: left + 10,
            clientY: top + 10
        }));

        expect(resizeSpy).toHaveBeenCalled();
        expect(splitPane.state.resizing).toBe(true);

        window.dispatchEvent(new MouseEvent('mouseup', {
            clientX: left + 15,
            clientY: top + 15
        }));

        expect(resizeEndSpy).toHaveBeenCalled();
        expect(splitPane.state.resizing).toBe(false);

        unmountComponentAtNode(findDOMNode(splitPane).parentNode);

        expect(splitPane.panes === null).toBe(true);


    });





});
