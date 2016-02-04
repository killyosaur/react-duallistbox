var React = require('react');
var ReactTestUtils = require('react-addons-test-utils');
var ButtonComponent = require('../src/button.jsx');
var FilterBox = require('../src/filterBox.jsx');
var ListBox = require('../src/listBox.jsx');
var JSC = require('jscheck');

describe('ListBox', () => {
    var listBox, items, itemLength;
    var shallowRenderer = ReactTestUtils.createRenderer();
    
    beforeEach(() => {
        itemLength = 1000;
        items = JSC.array(itemLength, JSC.object({
            name: JSC.one_of(pickOne()),
            aValue: JSC.integer(),
            stringValue: JSC.string(),
            anArray: JSC.array(10, JSC.character())
        }))();

        addId(items);
    });
    
    describe('right', () => {
        describe('2 buttons', () => {
            beforeEach(() => {
                listBox = shallowRenderer.render(
                    <ListBox 
                        direction="right"
                        title= "A Title"
                        moveAllBtn= { true }
                        onMove= { jasmine.createSpy('onMove') }
                        onChange= { jasmine.createSpy('onChange') }
                        text= "name"
                        source= { items }
                        value= "id" />
                );
            });

            it('should render a right directed listbox', () => {
                expect(listBox).toBeDefined();
                //var buttons = ReactTestUtils.scryRenderedComponentsWithType(listBox, ButtonComponent);
                //var filterBox = ReactTestUtils.findRenderedComponentWithType(listBox, FilterBox);
                var selectBox = ReactTestUtils.findRenderedDOMComponentWithTag(listBox, 'select');
                
                //expect(buttons.length).toBe(2);
                //expect(filterBox).toBeDefined();
                expect(selectBox).toBeDefined();
                expect(selectBox.options.length).toBe(itemLength);
            });

            describe('onClickAll', () => {
                it('should fire the onMove function with all data', () => {
                    expect(items.length).toBe(itemLength);
                });
            });
        });

        describe('1 button', () => {
            beforeEach(() => {
                listBox = shallowRenderer.render(
                    <ListBox 
                        direction="right"
                        title= "A Title"
                        moveAllBtn= { false }
                        onMove= { jasmine.createSpy('onMove') }
                        onChange= { jasmine.createSpy('onChange') }
                        text= "name"
                        source= { items }
                        value= "id" />
                );
            });

            it('should render a left directed listbox', () => {
                expect(listBox).toBeDefined();
            });
        });
    });
});