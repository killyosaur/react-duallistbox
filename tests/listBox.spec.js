var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');
var ButtonComponent = require('../src/button.jsx');
var FilterBox = require('../src/filterBox.jsx');
var ListBox = require('../src/listBox.jsx');
var JSC = require('jscheck');

describe('ListBox:', () => {
    var listBox, items, itemLength, onMove, itemIds;
    
    beforeEach(() => {
        itemLength = 1000;
        items = JSC.array(itemLength, JSC.object({
            name: JSC.one_of(pickOne()),
            aValue: JSC.integer(),
            stringValue: JSC.string(),
            anArray: JSC.array(10, JSC.character())
        }))();

        itemIds = addId(items);

        onMove = jasmine.createSpy('onMove');
    });

    afterEach(function(done) {
        if (listBox && listBox.isMounted()) {
            ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(listBox).parentNode);
        }
        setTimeout(done);
    });

    it('textLength should limit to 10 characters', () => {
        listBox = ReactTestUtils.renderIntoDocument(
            <ListBox 
                direction="right"
                title= "A Title"
                moveAllBtn= { true }
                onMove= { onMove }
                text= "name"
                source= { items }
                value= "id"
                textLength={10} />
        );

        expect(listBox).toBeDefined();
        var selectBox = ReactTestUtils.findRenderedDOMComponentWithTag(listBox, 'select');

        for (var i = 0; i < selectBox.options.length; i++) {
            expect(selectBox.options[i].text.length <= 10).toBeTruthy();
        }
    });

    it('title should be "A Title - showing [itemLength]"', () => {
        listBox = ReactTestUtils.renderIntoDocument(
            <ListBox 
                direction="right"
                title= "A Title"
                moveAllBtn= { true }
                onMove= { onMove }
                text= "name"
                source= { items }
                value= "id"
                textLength={10} />
        );

        expect(listBox).toBeDefined();
        var header = ReactTestUtils.findRenderedDOMComponentWithTag(listBox, 'h4');

        expect(header.innerText).toEqual('A Title - showing ' + itemLength)
    });

    it('disable should disable both buttons', () => {
        listBox = ReactTestUtils.renderIntoDocument(
            <ListBox 
                direction="right"
                title= "A Title"
                moveAllBtn= { true }
                onMove= { onMove }
                text= "name"
                source= { items }
                value= "id"
                disable={true}
                textLength={10} />
        );

        expect(listBox).toBeDefined();
        var buttons = ReactTestUtils.scryRenderedComponentsWithType(listBox, ButtonComponent);
        
        var btnAll = ReactTestUtils.findRenderedDOMComponentWithTag(buttons[0], 'button');
        var btn = ReactTestUtils.findRenderedDOMComponentWithTag(buttons[1], 'button');

        expect(btnAll.getAttribute('disabled')).toBe('');
        expect(btn.getAttribute('disabled')).toBe('');
    });

    it('should not update source as source has not changed', () => {
        var component = document.createElement('div');
        listBox = ReactDOM.render(
            <ListBox 
                direction="right"
                title= "A Title"
                moveAllBtn= { true }
                onMove= { onMove }
                text= "name"
                source= { items }
                value= "id"
                disable={true}
                textLength={10} />, component
        );

        expect(listBox).toBeDefined();
        var selectBox = ReactTestUtils.findRenderedDOMComponentWithTag(listBox, 'select');

        expect(selectBox.options.length).toBe(itemLength);

        listBox = ReactDOM.render(
            <ListBox 
                direction="right"
                title= "A Title"
                moveAllBtn= { false }
                onMove= { onMove }
                text= "name"
                source= { items }
                value= "id"
                disable={true}
                textLength={10} />, component
        );
        var selectBox = ReactTestUtils.findRenderedDOMComponentWithTag(listBox, 'select');

        expect(selectBox.options.length).toBe(itemLength);
    });

    describe('filterData', () => {
        it('should filter data by given string', () => {
            items = [
                { id: 1, name: 'Bang'},
                { id: 2, name: 'Bastion'},
                { id: 3, name: 'Bangers'},
                { id: 4, name: 'Bells'},
                { id: 5, name: 'Barter'},
                { id: 6, name: 'Bang!'},
                { id: 7, name: 'Bland'},
                { id: 8, name: 'barn'},
                { id: 9, name: 'Bang'}
            ]

            listBox = ReactTestUtils.renderIntoDocument(
                <ListBox 
                    direction="right"
                    title= "A Title"
                    moveAllBtn= { true }
                    onMove= { onMove }
                    text= "name"
                    source= { items }
                    value= "id" />
            );

            var expected = [
                { id: 1, name: 'Bang'},
                { id: 3, name: 'Bangers'},
                { id: 6, name: 'Bang!'},
                { id: 9, name: 'Bang'}
            ];
            
            var results = listBox.filterData('Bang');
            
            expect(results).toEqual(expected);
        });

        it('should filter data by given string, case insensitive', () => {
            items = [
                { id: 1, name: 'Bang'},
                { id: 2, name: 'Bastion'},
                { id: 3, name: 'BanGers'},
                { id: 4, name: 'Bells'},
                { id: 5, name: 'Barter'},
                { id: 6, name: 'BANG!'},
                { id: 7, name: 'Bland'},
                { id: 8, name: 'barn'},
                { id: 9, name: 'bang'}
            ]
            
            listBox = ReactTestUtils.renderIntoDocument(
                <ListBox 
                    direction="right"
                    title= "A Title"
                    moveAllBtn= { true }
                    onMove= { onMove }
                    text= "name"
                    source= { items }
                    value= "id" />
            );

            var expected = [
                { id: 1, name: 'Bang'},
                { id: 3, name: 'BanGers'},
                { id: 6, name: 'BANG!'},
                { id: 9, name: 'bang'}
            ];
            
            var results = listBox.filterData('BaNg');
            
            expect(results).toEqual(expected);
        });

        it('should return all data', () => {
            items = [
                { id: 1, name: 'Bang'},
                { id: 2, name: 'Bastion'},
                { id: 3, name: 'BanGers'},
                { id: 4, name: 'Bells'},
                { id: 5, name: 'Barter'},
                { id: 6, name: 'BANG!'},
                { id: 7, name: 'Bland'},
                { id: 8, name: 'barn'},
                { id: 9, name: 'bang'}
            ]
            
            listBox = ReactTestUtils.renderIntoDocument(
                <ListBox 
                    direction="right"
                    title= "A Title"
                    moveAllBtn= { true }
                    onMove= { onMove }
                    text= "name"
                    source= { items }
                    value= "id" />
            );

            var results = listBox.filterData('');
            
            expect(results).toEqual(items);
        });
    });

    describe('FilterBox', () => {
        beforeEach(() => {
            listBox = ReactTestUtils.renderIntoDocument(
                <ListBox 
                    direction="right"
                    title= "A Title"
                    moveAllBtn= { true }
                    onMove= { onMove }
                    text= "name"
                    source= { items }
                    value= "id" />
            );
        });

        it('should filter the data by the provided value', () => {
            expect(listBox).toBeDefined();
            var filterBox = ReactTestUtils.findRenderedComponentWithType(listBox, FilterBox);
            var selectBox = ReactTestUtils.findRenderedDOMComponentWithTag(listBox, 'select');

            var expected = listBox.filterData('Bang');
            var node = filterBox.refs.filter;
            node.input = 'Bang';
            ReactTestUtils.Simulate.change(node);

            expect(selectBox.options.length).toBe(expected.length);
            expect(items.length).toBe(itemLength);
        });
    });

    describe('move data:', () => {
        var container;
        beforeEach(() => {
            onMove = jasmine.createSpy('onMove').and.callFake(function(results) {
                items = removeSelectedItems(items, results, 'id');
                listBox = ReactDOM.render(
                    <ListBox 
                        direction="right"
                        title= "A Title"
                        moveAllBtn= { true }
                        onMove= { onMove }
                        text= "name"
                        source= { items }
                        value= "id" />, container
                );
            });

            container = document.createElement('div');
            listBox = ReactDOM.render(
                <ListBox 
                    direction="right"
                    title= "A Title"
                    moveAllBtn= { true }
                    onMove= { onMove }
                    text= "name"
                    source= { items }
                    value= "id" />, container
            );
        });

        describe('onClickAll', () => {
            it('should fire the onMove function with all data', () => {
                expect(items.length).toBe(itemLength);
                var currentItems = [].concat(items);
                var buttons = ReactTestUtils.scryRenderedComponentsWithType(listBox, ButtonComponent);
                var buttonToClick = ReactTestUtils.findRenderedDOMComponentWithTag(buttons[0], 'button');
                var selectBox = ReactTestUtils.findRenderedDOMComponentWithTag(listBox, 'select');

                expect(selectBox.options.length).toBe(itemLength);
                ReactTestUtils.Simulate.click(buttonToClick);

                expect(onMove).toHaveBeenCalledWith(currentItems);
                expect(selectBox.options.length).toBe(0);
                expect(items.length).toBe(0);
            });

            it('should fire the onMove function with filtered data', () => {
                expect(items.length).toBe(itemLength);
                var buttons = ReactTestUtils.scryRenderedComponentsWithType(listBox, ButtonComponent);
                var buttonToClick = ReactTestUtils.findRenderedDOMComponentWithTag(buttons[0], 'button');
                var filterBox = ReactTestUtils.findRenderedComponentWithType(listBox, FilterBox);
                var selectBox = ReactTestUtils.findRenderedDOMComponentWithTag(listBox, 'select');

                var expected = listBox.filterData('Bang');
                var node = filterBox.refs.filter;
                node.input = 'Bang';
                ReactTestUtils.Simulate.change(node);
                expect(buttonToClick.getAttribute('disabled')).toBeNull();

                expect(selectBox.options.length).toBe(expected.length);
                ReactTestUtils.Simulate.click(buttonToClick);

                expect(onMove).toHaveBeenCalledWith(expected);
                expect(selectBox.options.length).toBe(0);
                expect(items.length).toBe(itemLength - expected.length);
                expect(buttonToClick.getAttribute('disabled')).toBe('');
            });

            it('should not fire the onMove function as filter removes all data', () => {
                expect(items.length).toBe(itemLength);
                var buttons = ReactTestUtils.scryRenderedComponentsWithType(listBox, ButtonComponent);
                var buttonToClick = ReactTestUtils.findRenderedDOMComponentWithTag(buttons[0], 'button');
                var filterBox = ReactTestUtils.findRenderedComponentWithType(listBox, FilterBox);
                var selectBox = ReactTestUtils.findRenderedDOMComponentWithTag(listBox, 'select');

                expect(buttonToClick.getAttribute('disabled')).toBeNull();
                var expected = listBox.filterData('test');
                var node = filterBox.refs.filter;
                node.input = 'test';
                ReactTestUtils.Simulate.change(node);
                expect(buttonToClick.getAttribute('disabled')).toBe('');

                expect(selectBox.options.length).toBe(expected.length);
                ReactTestUtils.Simulate.click(buttonToClick);

                expect(onMove).not.toHaveBeenCalled();
                expect(selectBox.options.length).toBe(0);
                expect(items.length).toBe(itemLength);
            });
        });

        describe('onClick', () => {
            it('should not fire the onMove function as no items selected', () => {
                expect(items.length).toBe(itemLength);
                var buttons = ReactTestUtils.scryRenderedComponentsWithType(listBox, ButtonComponent);
                var buttonToClick = ReactTestUtils.findRenderedDOMComponentWithTag(buttons[1], 'button');
                var selectBox = ReactTestUtils.findRenderedDOMComponentWithTag(listBox, 'select');

                expect(buttonToClick.getAttribute('disabled')).toBe('');
                expect(selectBox.options.length).toBe(itemLength);
                ReactTestUtils.Simulate.click(buttonToClick);

                expect(onMove).not.toHaveBeenCalled();
                expect(selectBox.options.length).toBe(itemLength);
                expect(items.length).toBe(itemLength);
            });

            it('should not fire the onMove function as buttons are disabled', () => {
                onMove = jasmine.createSpy('onMove').and.callFake(function(results) {
                    items = removeSelectedItems(items, results, 'id');
                    listBox = ReactDOM.render(
                        <ListBox 
                            direction="right"
                            title= "A Title"
                            moveAllBtn= { true }
                            onMove= { onMove }
                            text= "name"
                            disable={true}
                            source= { items }
                            value= "id" />, container
                    );
                });

                container = document.createElement('div');
                listBox = ReactDOM.render(
                    <ListBox 
                        direction="right"
                        title= "A Title"
                        moveAllBtn= { true }
                        onMove= { onMove }
                        text= "name"
                        disable={true}
                        source= { items }
                        value= "id" />, container
                );
                expect(items.length).toBe(itemLength);
                var buttons = ReactTestUtils.scryRenderedComponentsWithType(listBox, ButtonComponent);
                var buttonToClick = ReactTestUtils.findRenderedDOMComponentWithTag(buttons[1], 'button');
                var selectBox = ReactTestUtils.findRenderedDOMComponentWithTag(listBox, 'select');

                expect(buttonToClick.getAttribute('disabled')).toBe('');
                expect(selectBox.options.length).toBe(itemLength);

                var indices = JSC.array(25, JSC.integer(0, itemLength - 1))();
                var expected = [];
                for (var i = 0; i < indices.length; i++) {
                    if (expected.indexOf(items[indices[i]]) === -1) {
                        expected.push(items[indices[i]]);
                        selectBox.options[indices[i]].selected = true;
                    }
                }
                ReactTestUtils.Simulate.change(selectBox);
                ReactTestUtils.Simulate.click(buttonToClick);

                expect(onMove).not.toHaveBeenCalled();
                expect(selectBox.options.length).toBe(itemLength);
                expect(items.length).toBe(itemLength);
            });

            it('should fire the onMove function with selected data', () => {
                expect(items.length).toBe(itemLength);
                var buttons = ReactTestUtils.scryRenderedComponentsWithType(listBox, ButtonComponent);
                var buttonToClick = ReactTestUtils.findRenderedDOMComponentWithTag(buttons[1], 'button');
                var selectBox = ReactTestUtils.findRenderedDOMComponentWithTag(listBox, 'select');

                expect(buttonToClick.getAttribute('disabled')).toBe('');
                expect(selectBox.options.length).toBe(itemLength);

                var indices = JSC.array(25, JSC.integer(0, itemLength - 1))();
                var expected = [];
                for (var i = 0; i < indices.length; i++) {
                    if (expected.indexOf(items[indices[i]]) === -1) {
                        expected.push(items[indices[i]]);
                        selectBox.options[indices[i]].selected = true;
                    }
                }
                ReactTestUtils.Simulate.change(selectBox);

                ReactTestUtils.Simulate.click(buttonToClick);

                expect(onMove).toHaveBeenCalledWith(expected.sort((a, b) => a.id === b.id ? 0 : a.id > b.id ? 1 : -1 ));
                expect(selectBox.options.length).toBe(itemLength - expected.length);
                expect(items.length).toBe(itemLength - expected.length);
            });

            it('should clear all selected data and selected options', () => {
                expect(items.length).toBe(itemLength);
                var buttons = ReactTestUtils.scryRenderedComponentsWithType(listBox, ButtonComponent);
                var buttonToClick = ReactTestUtils.findRenderedDOMComponentWithTag(buttons[1], 'button');
                var selectBox = ReactTestUtils.findRenderedDOMComponentWithTag(listBox, 'select');

                expect(buttonToClick.getAttribute('disabled')).toBe('');
                expect(selectBox.options.length).toBe(itemLength);

                var indices = JSC.array(25, JSC.integer(0, itemLength - 1))();
                var expected = [];
                for (var i = 0; i < indices.length; i++) {
                    if (expected.indexOf(items[indices[i]]) === -1) {
                        expected.push(items[indices[i]]);
                        selectBox.options[indices[i]].selected = true;
                    }
                }
                ReactTestUtils.Simulate.change(selectBox);

                ReactTestUtils.Simulate.click(buttonToClick);

                expect(selectBox.options.length).toBe(itemLength - expected.length);
                for (var j = 0; j < selectBox.options.length; j++) {
                    expect(selectBox.options[j].selected).toBeFalsy();
                }

                expect(listBox.state.selected.length).toBe(0);
                expect(items.length).toBe(itemLength - expected.length);
            });

            it('should disable the select move button when all data deselected', () => {
                expect(items.length).toBe(itemLength);
                var buttons = ReactTestUtils.scryRenderedComponentsWithType(listBox, ButtonComponent);
                var buttonToClick = ReactTestUtils.findRenderedDOMComponentWithTag(buttons[1], 'button');
                var selectBox = ReactTestUtils.findRenderedDOMComponentWithTag(listBox, 'select');

                expect(buttonToClick.getAttribute('disabled')).toBe('');
                expect(selectBox.options.length).toBe(itemLength);

                var indices = JSC.array(25, JSC.integer(0, itemLength - 1))();
                var i;
                for (i = 0; i < indices.length; i++) {
                    selectBox.options[indices[i]].selected = true;
                }
                ReactTestUtils.Simulate.change(selectBox);
                expect(buttonToClick.getAttribute('disabled')).toBeNull();

                for (i = 0; i < indices.length; i++) {
                    selectBox.options[indices[i]].selected = false;
                }
                ReactTestUtils.Simulate.change(selectBox);
                expect(buttonToClick.getAttribute('disabled')).toBe('');
            });

            it('should fire the onMove function with filtered and selected data', () => {
                expect(items.length).toBe(itemLength);
                var buttons = ReactTestUtils.scryRenderedComponentsWithType(listBox, ButtonComponent);
                var buttonToClick = ReactTestUtils.findRenderedDOMComponentWithTag(buttons[1], 'button');
                var filterBox = ReactTestUtils.findRenderedComponentWithType(listBox, FilterBox);
                var selectBox = ReactTestUtils.findRenderedDOMComponentWithTag(listBox, 'select');

                var expectedFiltered = listBox.filterData('Bang');
                var indices = JSC.array(5, JSC.integer(0, expectedFiltered.length - 1))();
                var node = filterBox.refs.filter;
                node.input = 'Bang';
                ReactTestUtils.Simulate.change(node);
                expect(buttonToClick.getAttribute('disabled')).toBe('');

                expect(selectBox.options.length).toBe(expectedFiltered.length);

                var expected = [];
                for (var i = 0; i < indices.length; i++) {
                    if (expected.indexOf(expectedFiltered[indices[i]]) === -1) {
                        expected.push(expectedFiltered[indices[i]]);
                        selectBox.options[indices[i]].selected = true;
                    }
                }
                ReactTestUtils.Simulate.change(selectBox);
                expect(buttonToClick.getAttribute('disabled')).toBeNull();

                ReactTestUtils.Simulate.click(buttonToClick);

                expect(onMove).toHaveBeenCalledWith(expected.sort((a, b) => a.id === b.id ? 0 : a.id > b.id ? 1 : -1 ));
                expect(selectBox.options.length).toBe(expectedFiltered.length - expected.length);
                expect(items.length).toBe(itemLength - expected.length);
                expect(buttonToClick.getAttribute('disabled')).toBe('');
            });
        });
    });

    describe('right,', () => {
        describe('2 buttons,', () => {
            beforeEach(() => {
                listBox = ReactTestUtils.renderIntoDocument(
                    <ListBox 
                        direction="right"
                        title= "A Title"
                        moveAllBtn= { true }
                        onMove= { onMove }
                        text= "name"
                        source= { items }
                        value= "id" />
                );
            });

            it('should render a right directed listbox', () => {
                expect(listBox).toBeDefined();
                var buttons = ReactTestUtils.scryRenderedComponentsWithType(listBox, ButtonComponent);
                var filterBox = ReactTestUtils.findRenderedComponentWithType(listBox, FilterBox);
                var selectBox = ReactTestUtils.findRenderedDOMComponentWithTag(listBox, 'select');
                var iconsAll = ReactTestUtils.scryRenderedDOMComponentsWithTag(buttons[0], 'i');
                var icons = ReactTestUtils.scryRenderedDOMComponentsWithTag(buttons[1], 'i');

                expect(buttons.length).toBe(2);
                expect(iconsAll.length).toBe(2);
                expect(iconsAll[0].getAttribute('class')).toBe('glyphicon glyphicon-list');
                expect(iconsAll[1].getAttribute('class')).toBe('glyphicon glyphicon-chevron-right');
                expect(icons.length).toBe(1);
                expect(icons[0].getAttribute('class')).toBe('glyphicon glyphicon-chevron-right');
                expect(filterBox).toBeDefined();
                expect(selectBox).toBeDefined();
                expect(selectBox.options.length).toBe(itemLength);
            });
        });

        describe('1 button,', () => {
            beforeEach(() => {
                listBox = ReactTestUtils.renderIntoDocument(
                    <ListBox 
                        direction="right"
                        title= "A Title"
                        moveAllBtn= { false }
                        onMove= { onMove }
                        text= "name"
                        source= { items }
                        value= "id" />
                );
            });

            it('should render a right directed listbox', () => {
                expect(listBox).toBeDefined();
                var buttons = ReactTestUtils.scryRenderedComponentsWithType(listBox, ButtonComponent);
                var filterBox = ReactTestUtils.findRenderedComponentWithType(listBox, FilterBox);
                var selectBox = ReactTestUtils.findRenderedDOMComponentWithTag(listBox, 'select');
                var icons = ReactTestUtils.scryRenderedDOMComponentsWithTag(buttons[0], 'i');

                expect(buttons.length).toBe(1);
                expect(icons.length).toBe(1);
                expect(icons[0].getAttribute('class')).toBe('glyphicon glyphicon-chevron-right');
                expect(filterBox).toBeDefined();
                expect(selectBox).toBeDefined();
                expect(selectBox.options.length).toBe(itemLength);
            });
        });
    });

    describe('left,', () => {
        describe('2 buttons,', () => {
            beforeEach(() => {
                listBox = ReactTestUtils.renderIntoDocument(
                    <ListBox 
                        direction="left"
                        title= "A Title"
                        moveAllBtn= { true }
                        onMove= { onMove }
                        text= "name"
                        source= { items }
                        value= "id" />
                );
            });

            it('should render a left directed listbox', () => {
                expect(listBox).toBeDefined();
                var buttons = ReactTestUtils.scryRenderedComponentsWithType(listBox, ButtonComponent);
                var filterBox = ReactTestUtils.findRenderedComponentWithType(listBox, FilterBox);
                var selectBox = ReactTestUtils.findRenderedDOMComponentWithTag(listBox, 'select');
                var iconsAll = ReactTestUtils.scryRenderedDOMComponentsWithTag(buttons[1], 'i');
                var icons = ReactTestUtils.scryRenderedDOMComponentsWithTag(buttons[0], 'i');

                expect(buttons.length).toBe(2);
                expect(iconsAll.length).toBe(2);
                expect(iconsAll[0].getAttribute('class')).toBe('glyphicon glyphicon-chevron-left');
                expect(iconsAll[1].getAttribute('class')).toBe('glyphicon glyphicon-list');
                expect(icons.length).toBe(1);
                expect(icons[0].getAttribute('class')).toBe('glyphicon glyphicon-chevron-left');
                expect(filterBox).toBeDefined();
                expect(selectBox).toBeDefined();
                expect(selectBox.options.length).toBe(itemLength);
            });
        });

        describe('1 button,', () => {
            beforeEach(() => {
                listBox = ReactTestUtils.renderIntoDocument(
                    <ListBox 
                        direction="left"
                        title= "A Title"
                        moveAllBtn= { false }
                        onMove= { onMove }
                        text= "name"
                        source= { items }
                        value= "id" />
                );
            });

            it('should render a left directed listbox', () => {
                expect(listBox).toBeDefined();
                var buttons = ReactTestUtils.scryRenderedComponentsWithType(listBox, ButtonComponent);
                var filterBox = ReactTestUtils.findRenderedComponentWithType(listBox, FilterBox);
                var selectBox = ReactTestUtils.findRenderedDOMComponentWithTag(listBox, 'select');
                var icons = ReactTestUtils.scryRenderedDOMComponentsWithTag(buttons[0], 'i');

                expect(buttons.length).toBe(1);
                expect(icons.length).toBe(1);
                expect(icons[0].getAttribute('class')).toBe('glyphicon glyphicon-chevron-left');
                expect(filterBox).toBeDefined();
                expect(selectBox).toBeDefined();
                expect(selectBox.options.length).toBe(itemLength);
            });
        });
    });
});