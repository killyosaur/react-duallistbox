var React = require('react');
var ReactTestUtils = require('react-addons-test-utils');
var FilterBox = require('../src/filterBox.jsx');

describe('FilterBox', () => {
    var filterBox, onChange;

    beforeEach(() => {
        onChange = jasmine.createSpy('filterChange');
        filterBox = ReactTestUtils.renderIntoDocument(
            <FilterBox handleFilterChange={ onChange } />
        );
    });
    
    it('should create a text box', () => {
        expect(filterBox).toBeDefined();
    });
    
    it('should fire onChange function', () => {
        var node = filterBox.refs.filter;
        node.input = 'test';
        ReactTestUtils.Simulate.change(node);
        expect(onChange).toHaveBeenCalled();
    });
});