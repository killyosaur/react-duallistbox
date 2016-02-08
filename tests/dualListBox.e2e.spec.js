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
            var filterBox = ReactTestUtils.findRenderedComponentWithType(dualListBox.refs.right, FilterBox);

            var filterResults = dualListBox.refs.right.filterData('bang', sourceData);
            var text = filterBox.refs.filter;
            text.input = 'bang';
            ReactTestUtils.Simulate.change(text);

            expect(dualListBox.refs.right.state.filteredData).toEqual(filterResults);
            expect(dualListBox.refs.right.refs.select.options.length).toEqual(filterResults.length);
        });
    });

    describe('move right, no data in destination,', () => {
        beforeEach(() => {
            destinationLength = 0;
            destinationData = [];
            dualListBox = ReactTestUtils.renderIntoDocument(<DualListBox source={ sourceData } destination= { destinationData } onChange= { onChange } sortBy= "id" />);
        });

        it('should move all data', () => {
            var buttons = ReactTestUtils.scryRenderedComponentsWithType(dualListBox.refs.right, ButtonComponent);
            var buttonToClick = ReactTestUtils.findRenderedDOMComponentWithTag(buttons[0], 'button');

            var right = dualListBox.refs.right.refs.select;
            var left = dualListBox.refs.left.refs.select;

            expect(right.options.length).toBe(sourceLength);
            expect(left.options.length).toBe(0);

            ReactTestUtils.Simulate.click(buttonToClick);

            expect(right.options.length).toBe(0);
            expect(left.options.length).toBe(sourceLength);
            expect(dualListBox.state.sourceData.length).toBe(0);
            expect(dualListBox.state.destinationData.length).toBe(sourceLength);
        });

        it('should move selected data', () => {
            var buttons = ReactTestUtils.scryRenderedComponentsWithType(dualListBox.refs.right, ButtonComponent);
            var buttonToClick = ReactTestUtils.findRenderedDOMComponentWithTag(buttons[1], 'button');

            var right = dualListBox.refs.right.refs.select;
            var left = dualListBox.refs.left.refs.select;

            expect(buttonToClick.getAttribute('disabled')).toBe('');
            expect(right.options.length).toBe(sourceLength);
            expect(left.options.length).toBe(0);

            var indices = JSC.array(25, JSC.integer(0, sourceLength - 1))();
            var expected = [];
            for (var i = 0; i < indices.length; i++) {
                if (expected.indexOf(sourceData[indices[i]]) === -1) {
                    expected.push(sourceData[indices[i]]);
                    right.options[indices[i]].selected = true;
                }
            }
            ReactTestUtils.Simulate.change(right);
            expect(buttonToClick.getAttribute('disabled')).toBeNull();

            ReactTestUtils.Simulate.click(buttonToClick);
            
            expect(right.options.length).toBe(sourceLength - expected.length);
            expect(left.options.length).toBe(expected.length);
            expect(dualListBox.state.sourceData.length).toBe(sourceLength - expected.length);
            expect(dualListBox.state.destinationData.length).toBe(expected.length);
            expect(dualListBox.state.destinationData).toEqual(expected.sort((a, b) => a.id === b.id ? 0 : a.id < b.id ? -1 : 1));
            expect(buttonToClick.getAttribute('disabled')).toBe('');
        });

        it('should filter data and move all', () => {
            var buttons = ReactTestUtils.scryRenderedComponentsWithType(dualListBox.refs.right, ButtonComponent);
            var filterBox = ReactTestUtils.findRenderedComponentWithType(dualListBox.refs.right, FilterBox);
            var buttonToClick = ReactTestUtils.findRenderedDOMComponentWithTag(buttons[1], 'button');

            var right = dualListBox.refs.right.refs.select;
            var left = dualListBox.refs.left.refs.select;

            var filterResults = dualListBox.refs.right.filterData('bang', sourceData);
            var text = filterBox.refs.filter;
            text.input = 'bang';
            ReactTestUtils.Simulate.change(text);

            expect(dualListBox.refs.right.state.filteredData).toEqual(filterResults);
            expect(right.options.length).toEqual(filterResults.length);
            expect(buttonToClick.getAttribute('disabled')).toBeNull();

            ReactTestUtils.Simulate.click(buttonToClick);

            expect(right.options.length).toBe(0);
            expect(left.options.length).toBe(filterResults.length);
            expect(dualListBox.state.sourceData.length).toBe(sourceLength - filterResults.length);
            expect(dualListBox.state.destinationData.length).toBe(filterResults.length);
            expect(dualListBox.refs.left.state.filteredData).toEqual(filterResults);
        });

        xit('should filter data and move selected', () => {
            var buttons = ReactTestUtils.scryRenderedComponentsWithType(dualListBox.refs.right, ButtonComponent);
            var filterBox = ReactTestUtils.findRenderedComponentWithType(dualListBox.refs.right, FilterBox);
            var buttonToClick = ReactTestUtils.findRenderedDOMComponentWithTag(buttons[0], 'button');

            var right = dualListBox.refs.right.refs.select;
            var left = dualListBox.refs.left.refs.select;

            var filterResults = dualListBox.refs.right.filterData('bang', sourceData);
            var text = filterBox.refs.filter;
            text.input = 'bang';
            ReactTestUtils.Simulate.change(text);

            expect(dualListBox.refs.right.state.filteredData).toEqual(filterResults);
            expect(right.options.length).toEqual(filterResults.length);

            var indices = JSC.array(5, JSC.integer(0, filterResults.length - 1))();
            var expected = [];
            for (var i = 0; i < indices.length; i++) {
                if (expected.indexOf(filterResults[indices[i]]) === -1) {
                    expected.push(filterResults[indices[i]]);
                    right.options[indices[i]].selected = true;
                }
            }
            ReactTestUtils.Simulate.change(right);

            ReactTestUtils.Simulate.click(buttonToClick);

            expect(right.options.length).toBe(filterResults.length - expected.length);
            expect(left.options.length).toBe(expected.length);
            expect(dualListBox.state.sourceData.length).toBe(sourceLength - expected.length);
            expect(dualListBox.state.destinationData.length).toBe(expected.length);
            expect(dualListBox.refs.left.state.filteredData).toEqual(expected);
        });
    });
});