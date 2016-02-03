var React = require('react');
var ReactTestUtils = require('react-addons-test-utils');
var ButtonComponent = require('../src/button.jsx');

describe('ButtonComponent', () => {
    it('should render a full width button', () => {
        var button = ReactTestUtils.renderIntoDocument(
            <ButtonComponent classes={['glyphicon-chevron-right']} width={12} />
        );
        var buttonObj = ReactTestUtils.scryRenderedDOMComponentsWithTag(button, "button")[0];
        expect(button).toBeDefined();
        expect(buttonObj.getAttribute('class')).toBe('btn btn-default col-sm-12');
    });

    it('should render a full width button with 2 icons', () => {
        var button = ReactTestUtils.renderIntoDocument(
            <ButtonComponent classes={['glyphicon-chevron-right', 'glyphicon-list']} width={12} />
        );
        var icons = ReactTestUtils.scryRenderedDOMComponentsWithTag(button, "i");
        expect(button).toBeDefined();
        expect(icons.length).toBe(2);
        expect(icons[0].getAttribute('class')).toBe('glyphicon glyphicon-chevron-right');
        expect(icons[1].getAttribute('class')).toBe('glyphicon glyphicon-list');
    });

    it('should render a button that is half the container width', () => {
        var button = ReactTestUtils.renderIntoDocument(
            <ButtonComponent classes={['glyphicon-chevron-right']} width={6} />
        );
        var buttonObj = ReactTestUtils.scryRenderedDOMComponentsWithTag(button, "button")[0];
        expect(button).toBeDefined();
        expect(buttonObj.getAttribute('class')).toBe('btn btn-default col-sm-6');
    });

    it('should render a button and click it', () => {
        var onClick = jasmine.createSpy('onClick');
        var button = ReactTestUtils.renderIntoDocument(
            <ButtonComponent classes={['glyphicon-chevron-right']} width={6} click={onClick} />
        );
        var buttonObj = ReactTestUtils.scryRenderedDOMComponentsWithTag(button, "button")[0];

        ReactTestUtils.Simulate.click(buttonObj);
        expect(onClick).toHaveBeenCalled();
    });

    it('should render a button and disable it', () => {
        var onClick = jasmine.createSpy('onClick');
        var button = ReactTestUtils.renderIntoDocument(
            <ButtonComponent classes={['glyphicon-chevron-right']} width={6} click={onClick} disable={true} />
        );
        var buttonObj = ReactTestUtils.scryRenderedDOMComponentsWithTag(button, "button")[0];

        ReactTestUtils.Simulate.click(buttonObj);
        expect(onClick).not.toHaveBeenCalled();
    });

    it('should render a button and click it, firing default function', () => {
        var button = ReactTestUtils.renderIntoDocument(
            <ButtonComponent classes={['glyphicon-chevron-right']} width={6} />
        );
        var buttonObj = ReactTestUtils.scryRenderedDOMComponentsWithTag(button, "button")[0];

        ReactTestUtils.Simulate.click(buttonObj);
        expect(button).toBeDefined();
    });
});