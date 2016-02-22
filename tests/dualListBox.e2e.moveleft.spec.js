var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');
var ButtonComponent = require('../src/button.jsx');
var FilterBox = require('../src/filterBox.jsx');
var ListBox = require('../src/listBox.jsx');
var JSC = require('jscheck');
var DualListBox = require('../src/dualListBox.jsx');

describe('E2E DualListBox: move left', () => {
    var sourceLength, destinationLength,
        sourceData, destinationData, itemIds,
        onChange, dualListBox;

    var sort = (a, b) => a.id === b.id ? 0 : a.id < b.id ? -1 : 1;

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

        destinationLength = 500;
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

    describe('onChange', () => {
        it('should call onChange after moving data', () => {
            dualListBox = ReactTestUtils.renderIntoDocument(<DualListBox source={ sourceData } destination= { destinationData } onChange= { onChange } sortBy= "id" />);
            var buttons = ReactTestUtils.scryRenderedComponentsWithType(dualListBox.refs.destination, ButtonComponent);
            var buttonToClick = ReactTestUtils.findRenderedDOMComponentWithTag(buttons[1], 'button');

            var source = dualListBox.refs.source.refs.select;
            var destination = dualListBox.refs.destination.refs.select;

            expect(source.options.length).toBe(sourceLength - destinationLength);
            expect(destination.options.length).toBe(destinationLength);

            ReactTestUtils.Simulate.click(buttonToClick);

            expect(source.options.length).toBe(sourceLength);
            expect(destination.options.length).toBe(0);
            expect(dualListBox.state.sourceData.length).toBe(sourceLength);
            expect(onChange).toHaveBeenCalledWith([], destinationData);
            expect(dualListBox.state.destinationData.length).toBe(0);
        });

        it('should not call onChange after moving data', () => {
            dualListBox = ReactTestUtils.renderIntoDocument(<DualListBox source={ sourceData } destination= { destinationData } sortBy= "id" />);
            var buttons = ReactTestUtils.scryRenderedComponentsWithType(dualListBox.refs.destination, ButtonComponent);
            var buttonToClick = ReactTestUtils.findRenderedDOMComponentWithTag(buttons[1], 'button');

            var source = dualListBox.refs.source.refs.select;
            var destination = dualListBox.refs.destination.refs.select;

            expect(source.options.length).toBe(sourceLength - destinationLength);
            expect(destination.options.length).toBe(destinationLength);

            ReactTestUtils.Simulate.click(buttonToClick);

            expect(source.options.length).toBe(sourceLength);
            expect(destination.options.length).toBe(0);
            expect(dualListBox.state.sourceData.length).toBe(sourceLength);
            expect(onChange).not.toHaveBeenCalled();
            expect(dualListBox.state.destinationData.length).toBe(0);
        });
    });

    it('should move all data', () => {
        var buttons = ReactTestUtils.scryRenderedComponentsWithType(dualListBox.refs.destination, ButtonComponent);
        var buttonToClick = ReactTestUtils.findRenderedDOMComponentWithTag(buttons[1], 'button');

        var source = dualListBox.refs.source.refs.select;
        var destination = dualListBox.refs.destination.refs.select;

        expect(source.options.length).toBe(sourceLength - destinationLength);
        expect(destination.options.length).toBe(destinationLength);
        expect(dualListBox.state.destinationData).toEqual(destinationData);

        ReactTestUtils.Simulate.click(buttonToClick);

        expect(source.options.length).toBe(sourceLength);
        expect(destination.options.length).toBe(0);
        expect(dualListBox.state.sourceData.length).toBe(sourceLength);
        expect(dualListBox.state.destinationData.length).toBe(0);
        expect(dualListBox.state.destinationData).toEqual([]);
    });

    it('should move selected data', () => {
        var buttons = ReactTestUtils.scryRenderedComponentsWithType(dualListBox.refs.destination, ButtonComponent);
        var buttonToClick = ReactTestUtils.findRenderedDOMComponentWithTag(buttons[0], 'button');

        var source = dualListBox.refs.source.refs.select;
        var destination = dualListBox.refs.destination.refs.select;

        expect(buttonToClick.getAttribute('disabled')).toBe('');
        expect(source.options.length).toBe(sourceLength - destinationLength);
        expect(destination.options.length).toBe(destinationLength);
        expect(dualListBox.state.destinationData).toEqual(destinationData);

        var indices = JSC.array(25, JSC.integer(0, destinationLength - 1))();
        var selected = [];
        for (var i = 0; i < indices.length; i++) {
            if (selected.indexOf(destinationData[indices[i]]) === -1) {
                selected.push(destinationData[indices[i]]);
                destination.options[indices[i]].selected = true;
            }
        }
        ReactTestUtils.Simulate.change(destination);
        expect(buttonToClick.getAttribute('disabled')).toBeNull();

        ReactTestUtils.Simulate.click(buttonToClick);
        
        var expected = removeSelectedItems(destinationData, selected, 'id');
        var expectedSource = removeSelectedItems(sourceData, expected, 'id');
        
        expect(source.options.length).toBe(expectedSource.length);
        expect(destination.options.length).toBe(expected.length);
        expect(dualListBox.state.sourceData.length).toBe(expectedSource.length);
        expect(dualListBox.state.sourceData).toEqual(expectedSource);
        expect(dualListBox.state.destinationData.length).toBe(expected.length);
        expect(dualListBox.state.destinationData).toEqual(expected.sort(sort));
        expect(buttonToClick.getAttribute('disabled')).toBe('');
    });

    it('should filter data and move all', () => {
        var buttons = ReactTestUtils.scryRenderedComponentsWithType(dualListBox.refs.destination, ButtonComponent);
        var filterBox = ReactTestUtils.findRenderedComponentWithType(dualListBox.refs.destination, FilterBox);
        var buttonToClick = ReactTestUtils.findRenderedDOMComponentWithTag(buttons[1], 'button');

        var source = dualListBox.refs.source.refs.select;
        var destination = dualListBox.refs.destination.refs.select;

        var filterResults = dualListBox.refs.destination.filterData('bang', destinationData);
        var text = filterBox.refs.filter;
        text.input = 'bang';
        ReactTestUtils.Simulate.change(text);

        expect(dualListBox.refs.destination.state.filteredData).toEqual(filterResults);
        expect(destination.options.length).toEqual(filterResults.length);
        expect(buttonToClick.getAttribute('disabled')).toBeNull();
        expect(dualListBox.state.destinationData).toEqual(destinationData);

        ReactTestUtils.Simulate.click(buttonToClick);

        var expected = removeSelectedItems(destinationData, filterResults, 'id');
        var expectedSource = removeSelectedItems(sourceData, expected, 'id');

        expect(source.options.length).toBe(expectedSource.length);
        expect(destination.options.length).toBe(0);
        expect(dualListBox.state.sourceData.length).toBe(expectedSource.length);
        expect(dualListBox.state.sourceData).toEqual(expectedSource);
        expect(dualListBox.state.destinationData.length).toBe(expected.length);
        expect(dualListBox.state.destinationData).toEqual(expected.sort(sort));
        expect(dualListBox.refs.destination.state.filteredData).toEqual([]);
    });

    it('should filter data and move selected', () => {
        var buttons = ReactTestUtils.scryRenderedComponentsWithType(dualListBox.refs.destination, ButtonComponent);
        var filterBox = ReactTestUtils.findRenderedComponentWithType(dualListBox.refs.destination, FilterBox);
        var buttonToClick = ReactTestUtils.findRenderedDOMComponentWithTag(buttons[0], 'button');

        var source = dualListBox.refs.source.refs.select;
        var destination = dualListBox.refs.destination.refs.select;

        var filterResults = dualListBox.refs.destination.filterData('Amelia', destinationData);
        var text = filterBox.refs.filter;
        text.input = 'Amelia';
        ReactTestUtils.Simulate.change(text);

        expect(dualListBox.refs.destination.state.filteredData).toEqual(filterResults);
        expect(destination.options.length).toEqual(filterResults.length);
        expect(buttonToClick.getAttribute('disabled')).toBe('');

        var selectedLength = 0;
        var selected = [];
        var indices = JSC.array(5, JSC.integer(0, filterResults.length - 1))();
        for (var i = 0; i < indices.length; i++) {
            if (selected.indexOf(filterResults[indices[i]]) === -1) {
                selectedLength++;
                selected.push(filterResults[indices[i]]);
                destination.options[indices[i]].selected = true;
            }
        }
        ReactTestUtils.Simulate.change(destination);

        expect(buttonToClick.getAttribute('disabled')).toBeNull();

        ReactTestUtils.Simulate.click(buttonToClick);

        var expectedDestination = removeSelectedItems(destinationData, selected, 'id');
        var expectedFiltered = removeSelectedItems(filterResults, selected, 'id');
        var expectedSource = removeSelectedItems(sourceData, expectedDestination, 'id');

        expect(destination.options.length).toBe(filterResults.length - selectedLength);
        expect(source.options.length).toBe(expectedSource.length);
        expect(dualListBox.state.sourceData.length).toBe(expectedSource.length);
        expect(dualListBox.state.sourceData).toEqual(expectedSource);
        expect(dualListBox.state.destinationData.length).toBe(expectedDestination.length);
        expect(dualListBox.refs.destination.state.filteredData).toEqual(expectedFiltered.sort(sort));
        expect(buttonToClick.getAttribute('disabled')).toBe('');
    });
});