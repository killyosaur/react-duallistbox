var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');
var ButtonComponent = require('../src/button.jsx');
var FilterBox = require('../src/filterBox.jsx');
var ListBox = require('../src/listBox.jsx');
var JSC = require('jscheck');
var DualListBox = require('../src/dualListBox.jsx');

describe('E2E DualListBox: move right', () => {
    var sourceLength, destinationLength,
        sourceData, destinationData, itemIds,
        onChange, dualListBox;

    var sort = (a, b) => a.id === b.id ? 0 : a.id < b.id ? -1 : 1;

    beforeEach(() => {
        sourceLength = 300;

        sourceData = JSC.array(sourceLength, JSC.object({
            name: JSC.one_of(pickOne()),
            aValue: JSC.integer(),
            stringValue: JSC.string(),
            anArray: JSC.array(5, JSC.character())
        }))();

        itemIds = addId(sourceData);

        onChange = jasmine.createSpy('onChange');
    });

    describe('onChange', () => {
        it('should call onChange after moving data', () => {
            destinationLength = 0;
            destinationData = [];
            dualListBox = ReactTestUtils.renderIntoDocument(<DualListBox source={ sourceData } destination= { destinationData } onChange= { onChange } sortBy= "id" />);
            var buttons = ReactTestUtils.scryRenderedComponentsWithType(dualListBox.refs.source, ButtonComponent);
            var buttonToClick = ReactTestUtils.findRenderedDOMComponentWithTag(buttons[0], 'button');

            var source = dualListBox.refs.source.refs.select;
            var destination = dualListBox.refs.destination.refs.select;

            expect(source.options.length).toBe(sourceLength);
            expect(destination.options.length).toBe(0);

            ReactTestUtils.Simulate.click(buttonToClick);

            expect(source.options.length).toBe(0);
            expect(destination.options.length).toBe(sourceLength);
            expect(dualListBox.state.sourceData.length).toBe(0);
            expect(onChange).toHaveBeenCalledWith(sourceData, []);
            expect(dualListBox.state.destinationData.length).toBe(sourceLength);
        });

        it('should not call onChange after moving data', () => {
            destinationLength = 0;
            destinationData = [];
            dualListBox = ReactTestUtils.renderIntoDocument(<DualListBox source={ sourceData } destination= { destinationData } sortBy= "id" />);
            var buttons = ReactTestUtils.scryRenderedComponentsWithType(dualListBox.refs.source, ButtonComponent);
            var buttonToClick = ReactTestUtils.findRenderedDOMComponentWithTag(buttons[0], 'button');

            var source = dualListBox.refs.source.refs.select;
            var destination = dualListBox.refs.destination.refs.select;

            expect(source.options.length).toBe(sourceLength);
            expect(destination.options.length).toBe(0);

            ReactTestUtils.Simulate.click(buttonToClick);

            expect(source.options.length).toBe(0);
            expect(destination.options.length).toBe(sourceLength);
            expect(dualListBox.state.sourceData.length).toBe(0);
            expect(onChange).not.toHaveBeenCalled();
            expect(dualListBox.state.destinationData.length).toBe(sourceLength);
        });

        it('should call onChange after moving data with data in destination', () => {
            destinationData = [];
            destinationLength = 10;
            var indices = JSC.array(destinationLength, JSC.integer(0, sourceData.length - 1))();

            for (var i = 0; i < destinationLength; i++) {
                var value = sourceData[indices[i]];
                if (destinationData.indexOf(value) === -1) {
                    destinationData.push(value);
                }
            }

            destinationLength = destinationData.length;
            dualListBox = ReactTestUtils.renderIntoDocument(<DualListBox source={ sourceData } destination= { destinationData } onChange= { onChange } sortBy= "id" />);
            var buttons = ReactTestUtils.scryRenderedComponentsWithType(dualListBox.refs.source, ButtonComponent);
            var buttonToClick = ReactTestUtils.findRenderedDOMComponentWithTag(buttons[1], 'button');

            var source = dualListBox.refs.source.refs.select;
            var destination = dualListBox.refs.destination.refs.select;

            expect(buttonToClick.getAttribute('disabled')).toBe('');
            expect(source.options.length).toBe(sourceLength - destinationLength);
            expect(destination.options.length).toBe(destinationLength);
            expect(dualListBox.state.destinationData).toEqual(destinationData);
            var expectedSource = removeSelectedItems(sourceData, destinationData, 'id');

            var indices = JSC.array(25, JSC.integer(0, expectedSource.length - 1))();
            var expected = [].concat(destinationData);
            for (var i = 0; i < indices.length; i++) {
                if (expected.indexOf(expectedSource[indices[i]]) === -1) {
                    expected.push(expectedSource[indices[i]]);
                    source.options[indices[i]].selected = true;
                }
            }
            ReactTestUtils.Simulate.change(source);
            expect(buttonToClick.getAttribute('disabled')).toBeNull();

            ReactTestUtils.Simulate.click(buttonToClick);
            
            expect(source.options.length).toBe(sourceLength - expected.length);
            expect(destination.options.length).toBe(expected.length);
            expect(dualListBox.state.sourceData.length).toBe(sourceLength - expected.length);
            expect(dualListBox.state.destinationData.length).toBe(expected.length);
            expect(dualListBox.state.destinationData).toEqual(expected.sort(sort));
            expect(onChange).toHaveBeenCalledWith(expected, destinationData);
            expect(buttonToClick.getAttribute('disabled')).toBe('');
        });
    });

    describe('no data in destination,', () => {
        beforeEach(() => {
            destinationLength = 0;
            destinationData = [];
            dualListBox = ReactTestUtils.renderIntoDocument(<DualListBox source={ sourceData } destination= { destinationData } onChange= { onChange } sortBy= "id" />);
        });

        it('should move all data', () => {
            var buttons = ReactTestUtils.scryRenderedComponentsWithType(dualListBox.refs.source, ButtonComponent);
            var buttonToClick = ReactTestUtils.findRenderedDOMComponentWithTag(buttons[0], 'button');

            var source = dualListBox.refs.source.refs.select;
            var destination = dualListBox.refs.destination.refs.select;

            expect(source.options.length).toBe(sourceLength);
            expect(destination.options.length).toBe(0);

            ReactTestUtils.Simulate.click(buttonToClick);

            expect(source.options.length).toBe(0);
            expect(destination.options.length).toBe(sourceLength);
            expect(dualListBox.state.sourceData.length).toBe(0);
            expect(dualListBox.state.destinationData.length).toBe(sourceLength);
        });

        it('should move selected data', () => {
            var buttons = ReactTestUtils.scryRenderedComponentsWithType(dualListBox.refs.source, ButtonComponent);
            var buttonToClick = ReactTestUtils.findRenderedDOMComponentWithTag(buttons[1], 'button');

            var source = dualListBox.refs.source.refs.select;
            var destination = dualListBox.refs.destination.refs.select;

            expect(buttonToClick.getAttribute('disabled')).toBe('');
            expect(source.options.length).toBe(sourceLength);
            expect(destination.options.length).toBe(0);

            var indices = JSC.array(25, JSC.integer(0, sourceLength - 1))();
            var expected = [];
            for (var i = 0; i < indices.length; i++) {
                if (expected.indexOf(sourceData[indices[i]]) === -1) {
                    expected.push(sourceData[indices[i]]);
                    source.options[indices[i]].selected = true;
                }
            }
            ReactTestUtils.Simulate.change(source);
            expect(buttonToClick.getAttribute('disabled')).toBeNull();

            ReactTestUtils.Simulate.click(buttonToClick);
            
            expect(source.options.length).toBe(sourceLength - expected.length);
            expect(destination.options.length).toBe(expected.length);
            expect(dualListBox.state.sourceData.length).toBe(sourceLength - expected.length);
            expect(dualListBox.state.destinationData.length).toBe(expected.length);
            expect(dualListBox.state.destinationData).toEqual(expected.sort(sort));
            expect(buttonToClick.getAttribute('disabled')).toBe('');
        });

        it('should filter data and move all', () => {
            var buttons = ReactTestUtils.scryRenderedComponentsWithType(dualListBox.refs.source, ButtonComponent);
            var filterBox = ReactTestUtils.findRenderedComponentWithType(dualListBox.refs.source, FilterBox);
            var buttonToClick = ReactTestUtils.findRenderedDOMComponentWithTag(buttons[0], 'button');

            var source = dualListBox.refs.source.refs.select;
            var destination = dualListBox.refs.destination.refs.select;

            var filterResults = dualListBox.refs.source.filterData('bang', sourceData);
            var text = filterBox.refs.filter;
            text.input = 'bang';
            ReactTestUtils.Simulate.change(text);

            expect(dualListBox.refs.source.state.filteredData).toEqual(filterResults);
            expect(source.options.length).toEqual(filterResults.length);
            expect(buttonToClick.getAttribute('disabled')).toBeNull();

            ReactTestUtils.Simulate.click(buttonToClick);

            expect(source.options.length).toBe(0);
            expect(destination.options.length).toBe(filterResults.length);
            expect(dualListBox.state.sourceData.length).toBe(sourceLength - filterResults.length);
            expect(dualListBox.state.destinationData.length).toBe(filterResults.length);
            expect(dualListBox.refs.destination.state.filteredData).toEqual(filterResults);
        });

        it('should filter data and move selected', () => {
            var buttons = ReactTestUtils.scryRenderedComponentsWithType(dualListBox.refs.source, ButtonComponent);
            var filterBox = ReactTestUtils.findRenderedComponentWithType(dualListBox.refs.source, FilterBox);
            var buttonToClick = ReactTestUtils.findRenderedDOMComponentWithTag(buttons[1], 'button');

            var source = dualListBox.refs.source.refs.select;
            var destination = dualListBox.refs.destination.refs.select;

            var filterResults = dualListBox.refs.source.filterData('bang', sourceData);
            var text = filterBox.refs.filter;
            text.input = 'bang';
            ReactTestUtils.Simulate.change(text);

            expect(dualListBox.refs.source.state.filteredData).toEqual(filterResults);
            expect(source.options.length).toEqual(filterResults.length);
            expect(buttonToClick.getAttribute('disabled')).toBe('');

            var indices = JSC.array(5, JSC.integer(0, filterResults.length - 1))();
            var expected = [];
            for (var i = 0; i < indices.length; i++) {
                if (expected.indexOf(filterResults[indices[i]]) === -1) {
                    expected.push(filterResults[indices[i]]);
                    source.options[indices[i]].selected = true;
                }
            }
            ReactTestUtils.Simulate.change(source);

            expect(buttonToClick.getAttribute('disabled')).toBeNull();

            ReactTestUtils.Simulate.click(buttonToClick);

            expect(source.options.length).toBe(filterResults.length - expected.length);
            expect(destination.options.length).toBe(expected.length);
            expect(dualListBox.state.sourceData.length).toBe(sourceLength - expected.length);
            expect(dualListBox.state.destinationData.length).toBe(expected.length);
            expect(dualListBox.refs.destination.state.filteredData).toEqual(expected.sort(sort));
            expect(buttonToClick.getAttribute('disabled')).toBe('');
        });
    });

    describe('with data in destination,', () => {
        beforeEach(() => {
            destinationLength = 100;
            destinationData = [];
            var indices = JSC.array(destinationLength, JSC.integer(0, sourceData.length - 1))();

            for(var i = 0; i < destinationLength; i++) {
                var value = sourceData[indices[i]];
                if (destinationData.indexOf(value) === -1) {
                    destinationData.push(value);
                }
            }

            destinationLength = destinationData.length;

            dualListBox = ReactTestUtils.renderIntoDocument(<DualListBox source={ sourceData } destination= { destinationData } onChange= { onChange } sortBy= "id" />);
        });

        it('should move all data', () => {
            var buttons = ReactTestUtils.scryRenderedComponentsWithType(dualListBox.refs.source, ButtonComponent);
            var buttonToClick = ReactTestUtils.findRenderedDOMComponentWithTag(buttons[0], 'button');

            var source = dualListBox.refs.source.refs.select;
            var destination = dualListBox.refs.destination.refs.select;

            expect(source.options.length).toBe(sourceLength - destinationLength);
            expect(destination.options.length).toBe(destinationLength);
            expect(dualListBox.state.destinationData).toEqual(destinationData);

            ReactTestUtils.Simulate.click(buttonToClick);

            expect(source.options.length).toBe(0);
            expect(destination.options.length).toBe(sourceLength);
            expect(dualListBox.state.sourceData.length).toBe(0);
            expect(dualListBox.state.destinationData.length).toBe(sourceLength);
            expect(dualListBox.state.destinationData).toEqual(sourceData);
        });

        it('should move selected data', () => {
            var buttons = ReactTestUtils.scryRenderedComponentsWithType(dualListBox.refs.source, ButtonComponent);
            var buttonToClick = ReactTestUtils.findRenderedDOMComponentWithTag(buttons[1], 'button');

            var source = dualListBox.refs.source.refs.select;
            var destination = dualListBox.refs.destination.refs.select;

            expect(buttonToClick.getAttribute('disabled')).toBe('');
            expect(source.options.length).toBe(sourceLength - destinationLength);
            expect(destination.options.length).toBe(destinationLength);
            expect(dualListBox.state.destinationData).toEqual(destinationData);
            var expectedSource = removeSelectedItems(sourceData, destinationData, 'id');

            var indices = JSC.array(25, JSC.integer(0, expectedSource.length - 1))();
            var expected = [].concat(destinationData);
            for (var i = 0; i < indices.length; i++) {
                if (expected.indexOf(expectedSource[indices[i]]) === -1) {
                    expected.push(expectedSource[indices[i]]);
                    source.options[indices[i]].selected = true;
                }
            }
            ReactTestUtils.Simulate.change(source);
            expect(buttonToClick.getAttribute('disabled')).toBeNull();

            ReactTestUtils.Simulate.click(buttonToClick);
            
            expect(source.options.length).toBe(sourceLength - expected.length);
            expect(destination.options.length).toBe(expected.length);
            expect(dualListBox.state.sourceData.length).toBe(sourceLength - expected.length);
            expect(dualListBox.state.destinationData.length).toBe(expected.length);
            expect(dualListBox.state.destinationData).toEqual(expected.sort(sort));
            expect(buttonToClick.getAttribute('disabled')).toBe('');
        });

        it('should filter data and move all', () => {
            var buttons = ReactTestUtils.scryRenderedComponentsWithType(dualListBox.refs.source, ButtonComponent);
            var filterBox = ReactTestUtils.findRenderedComponentWithType(dualListBox.refs.source, FilterBox);
            var buttonToClick = ReactTestUtils.findRenderedDOMComponentWithTag(buttons[0], 'button');
            var expectedSource = removeSelectedItems(sourceData, destinationData, 'id');

            var source = dualListBox.refs.source.refs.select;
            var destination = dualListBox.refs.destination.refs.select;

            var filterResults = dualListBox.refs.source.filterData('bang', expectedSource);
            var text = filterBox.refs.filter;
            text.input = 'bang';
            ReactTestUtils.Simulate.change(text);

            expect(dualListBox.refs.source.state.filteredData).toEqual(filterResults);
            expect(source.options.length).toEqual(filterResults.length);
            expect(buttonToClick.getAttribute('disabled')).toBeNull();
            expect(dualListBox.state.destinationData).toEqual(destinationData);

            ReactTestUtils.Simulate.click(buttonToClick);

            expect(source.options.length).toBe(0);
            expect(destination.options.length).toBe(filterResults.length + destinationLength);
            expect(dualListBox.state.sourceData.length).toBe(sourceLength - destinationLength - filterResults.length);
            expect(dualListBox.state.destinationData.length).toBe(filterResults.length + destinationLength);
            expect(dualListBox.refs.destination.state.filteredData).toEqual(filterResults.concat(destinationData).sort(sort));
        });

        it('should filter data and move selected', () => {
            var buttons = ReactTestUtils.scryRenderedComponentsWithType(dualListBox.refs.source, ButtonComponent);
            var filterBox = ReactTestUtils.findRenderedComponentWithType(dualListBox.refs.source, FilterBox);
            var buttonToClick = ReactTestUtils.findRenderedDOMComponentWithTag(buttons[1], 'button');
            var expectedSource = removeSelectedItems(sourceData, destinationData, 'id');

            var source = dualListBox.refs.source.refs.select;
            var destination = dualListBox.refs.destination.refs.select;

            var filterResults = dualListBox.refs.source.filterData('bang', expectedSource);
            var text = filterBox.refs.filter;
            text.input = 'bang';
            ReactTestUtils.Simulate.change(text);

            expect(dualListBox.refs.source.state.filteredData).toEqual(filterResults);
            expect(source.options.length).toEqual(filterResults.length);
            expect(buttonToClick.getAttribute('disabled')).toBe('');

            var selectedLength = 0;
            var indices = JSC.array(5, JSC.integer(0, filterResults.length - 1))();
            var expected = [].concat(destinationData);
            for (var i = 0; i < indices.length; i++) {
                if (expected.indexOf(filterResults[indices[i]]) === -1) {
                    selectedLength++;
                    expected.push(filterResults[indices[i]]);
                    source.options[indices[i]].selected = true;
                }
            }
            ReactTestUtils.Simulate.change(source);

            expect(buttonToClick.getAttribute('disabled')).toBeNull();

            ReactTestUtils.Simulate.click(buttonToClick);

            expect(source.options.length).toBe(filterResults.length - selectedLength);
            expect(destination.options.length).toBe(expected.length);
            expect(dualListBox.state.sourceData.length).toBe(sourceLength - expected.length);
            expect(dualListBox.state.destinationData.length).toBe(expected.length);
            expect(dualListBox.refs.destination.state.filteredData).toEqual(expected.sort(sort));
            expect(buttonToClick.getAttribute('disabled')).toBe('');
        });
    });
});