var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');
var ButtonComponent = require('../src/button.jsx');

describe('ButtonComponent', () => {
    var button;

    afterEach(function(done) {
        if (button && button.isMounted()) {
            ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(button).parentNode);
        }
        setTimeout(done);
    });

    it('should render a full width button', () => {
        button = ReactTestUtils.renderIntoDocument(
            <ButtonComponent classes={['glyphicon-chevron-right']} width={12} />
        );
        var buttonObj = ReactTestUtils.findRenderedDOMComponentWithTag(button, "button");
        expect(button).toBeDefined();
        expect(buttonObj.getAttribute('class')).toBe('btn btn-default col-sm-12');
    });

    it('should render a full width button with 2 icons', () => {
        button = ReactTestUtils.renderIntoDocument(
            <ButtonComponent classes={['glyphicon-chevron-right', 'glyphicon-list']} width={12} />
        );
        var icons = ReactTestUtils.scryRenderedDOMComponentsWithTag(button, "i");
        expect(button).toBeDefined();
        expect(icons.length).toBe(2);
        expect(icons[0].getAttribute('class')).toBe('glyphicon glyphicon-chevron-right');
        expect(icons[1].getAttribute('class')).toBe('glyphicon glyphicon-list');
    });

    it('should render a button that is half the container width', () => {
        button = ReactTestUtils.renderIntoDocument(
            <ButtonComponent classes={['glyphicon-chevron-right']} width={6} />
        );
        var buttonObj = ReactTestUtils.findRenderedDOMComponentWithTag(button, "button");
        expect(button).toBeDefined();
        expect(buttonObj.getAttribute('class')).toBe('btn btn-default col-sm-6');
    });

    it('should render a button and click it', () => {
        var onClick = jasmine.createSpy('onClick');
        button = ReactTestUtils.renderIntoDocument(
            <ButtonComponent classes={['glyphicon-chevron-right']} width={6} click={onClick} />
        );
        var buttonObj = ReactTestUtils.findRenderedDOMComponentWithTag(button, "button");

        ReactTestUtils.Simulate.click(buttonObj);
        expect(onClick).toHaveBeenCalled();
    });

    it('should render a button and disable it', () => {
        var onClick = jasmine.createSpy('onClick');
        button = ReactTestUtils.renderIntoDocument(
            <ButtonComponent classes={['glyphicon-chevron-right']} width={6} click={onClick} disable={true} />
        );
        var buttonObj = ReactTestUtils.findRenderedDOMComponentWithTag(button, "button");

        ReactTestUtils.Simulate.click(buttonObj);
        expect(onClick).not.toHaveBeenCalled();
    });

    it('should render a button and click it, firing default function', () => {
        button = ReactTestUtils.renderIntoDocument(
            <ButtonComponent classes={['glyphicon-chevron-right']} width={6} />
        );
        var buttonObj = ReactTestUtils.findRenderedDOMComponentWithTag(button, "button");

        ReactTestUtils.Simulate.click(buttonObj);
        expect(button).toBeDefined();
    });
});