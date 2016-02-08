var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');
var ButtonComponent = require('../src/button.jsx');
var FilterBox = require('../src/filterBox.jsx');
var ListBox = require('../src/listBox.jsx');
var JSC = require('jscheck');
var DualListBox = require('../src/dualListBox.jsx');

describe('E2E DualListBox:', () => {
    var sourceLength, destinationLength,
        sourceData, destinationData, itemIds,
        onChange, dualListBox;

    beforeEach(() => {
        sourceLength = 3000;

        sourceData = JSC.array(sourceLength, JSC.object({
            name: JSC.one_of(pickOne()),
            aValue: JSC.integer(),
            stringValue: JSC.string(),
            anArray: JSC.array(5, JSC.character())
        }))();

        itemIds = addId(sourceData);

        onChange = jasmine.createSpy('onChange');
    });

    describe('filter data', () => {
        beforeEach(() => {
            destinationLength = 0;
            destinationData = [];
            dualListBox = ReactTestUtils.renderIntoDocument(<DualListBox source={ sourceData } destination= { destinationData } onChange= { onChange } sortBy= "id" />);
        });

        it('should filter data', () => {
            var filterBox = ReactTestUtils.findRenderedComponentWithType(dualListBox.refs.source, FilterBox);

            var filterResults = dualListBox.refs.source.filterData('bang', sourceData);
            var text = filterBox.refs.filter;
            text.input = 'bang';
            ReactTestUtils.Simulate.change(text);

            expect(dualListBox.refs.source.state.filteredData).toEqual(filterResults);
            expect(dualListBox.refs.source.refs.select.options.length).toEqual(filterResults.length);
        });
    });
});