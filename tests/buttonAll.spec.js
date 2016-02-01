var React = require('react');
var ReactTestUtils = require('react-addons-test-utils');
var ButtonAllComponent = require('../src/buttonAll.jsx');

describe('ButtonAllComponent', () => {
    it('should render a right button',  () => {
        var button = ReactTestUtils.renderIntoDocument(
            <ButtonAllComponent direction="right" />
        );
        var buttonObj = ReactTestUtils.scryRenderedDOMComponentsWithTag(button, "button")[0];
        var icons = buttonObj.childNodes;
        expect(button).toBeDefined();
        expect(icons.length).toBe(2);
        expect(icons[0].getAttribute('class')).toBe('glyphicon glyphicon-list');
        expect(icons[1].getAttribute('class')).toBe('glyphicon glyphicon-chevron-right');
    });

    it('should render a left button',  () => {
        var button = ReactTestUtils.renderIntoDocument(
            <ButtonAllComponent direction="left" />
        );
        var buttonObj = ReactTestUtils.scryRenderedDOMComponentsWithTag(button, "button")[0];
        var icons = buttonObj.childNodes;
        expect(button).toBeDefined();
        expect(icons.length).toBe(2);
        expect(icons[1].getAttribute('class')).toBe('glyphicon glyphicon-list');
        expect(icons[0].getAttribute('class')).toBe('glyphicon glyphicon-chevron-left');
    });

    it('should render a case insensitive',  () => {
        var button = ReactTestUtils.renderIntoDocument(
            <ButtonAllComponent direction="LeFt" />
        );
        var buttonObj = ReactTestUtils.scryRenderedDOMComponentsWithTag(button, "button")[0];
        var icons = buttonObj.childNodes;
        expect(button).toBeDefined();
        expect(icons.length).toBe(2);
        expect(icons[1].getAttribute('class')).toBe('glyphicon glyphicon-list');
        expect(icons[0].getAttribute('class')).toBe('glyphicon glyphicon-chevron-left');
    });

    it('should render a none button',  () => {
        var button = ReactTestUtils.renderIntoDocument(
            <ButtonAllComponent direction="something" />
        );
        var buttonObj = ReactTestUtils.scryRenderedDOMComponentsWithTag(button, "button")[0];
        var icons = buttonObj.childNodes;
        expect(button).toBeDefined();
        expect(icons.length).toBe(0);
    });

    it('should throw error on render', () => {
        expect(() => {
            return (
                ReactTestUtils.renderIntoDocument(
                    <ButtonAllComponent />
                ));
        }).toThrow();
    });
});