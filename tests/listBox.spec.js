var React = require('react');
var ReactTestUtils = require('react-addons-test-utils');
var ButtonComponent = require('../src/button.jsx');
var FilterBox = require('../src/filterBox.jsx');
var ListBox = require('../src/listBox.jsx');
var JSC = require('jscheck');

describe('ListBox', () => {
    var listBox, items, itemLength;
    
    beforeEach(() => {
        itemLength = 1000;
        items = JSC.array(itemLength, JSC.object({
            name: JSC.one_of(pickOne()),
            aValue: JSC.integer(),
            stringValue: JSC.string(),
            anArray: JSC.array(10, JSC.character())
        }))();

        addId(items);

        listBox = ReactTestUtils.renderIntoDocument(
            <ListBox 
                direction="right"
                title="A Title"
                moveAllBtn={true}
                onMove={jasmine.createSpy('onMove')}
                onChange={jasmine.createSpy('onChange')}
                text="name"
                source={items}
                value="id" />
        );
    });

    describe('onClickAll', () => {
        it('should fire the onMove function with all data', () => {
            expect(items.length).toBe(itemLength);

            
        });
    })
});