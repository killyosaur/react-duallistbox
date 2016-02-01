var React = require('react');
var ReactTestUtils = require('react-addons-test-utils');
var ButtonComponent = require('../src/button.jsx');

describe('ButtonComponent', () => {
    it('should render a full width button', () => {
        var button = ReactTestUtils.renderIntoDocument(
            <ButtonComponent direction="right" />
        );
        var buttonObj = ReactTestUtils.scryRenderedDOMComponentsWithTag(button, "button")[0];
        expect(button).toBeDefined();
        expect(buttonObj.getAttribute('class')).toBe('btn btn-default col-md-12');
    });

    it('should render a button that is half the container width', () => {
        var button = ReactTestUtils.renderIntoDocument(
            <ButtonComponent direction="right" moveAll= {true} />
        );
        var buttonObj = ReactTestUtils.scryRenderedDOMComponentsWithTag(button, "button")[0];
        expect(button).toBeDefined();
        expect(buttonObj.getAttribute('class')).toBe('btn btn-default col-md-6');
    });

    it('should throw error on render', () => {
        expect(() => {
            return (
                ReactTestUtils.renderIntoDocument(
                    <ButtonComponent />
                ));
        }).toThrow();
    });
});