var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');
var ButtonComponent = require('../src/button.jsx');
var FilterBox = require('../src/filterBox.jsx');
var ListBox = require('../src/listBox.jsx');
var JSC = require('jscheck');
var DualListBox = require('../src/dualListBox.jsx');

describe('DualListBox:', () => {
    var sourceLength, destinationLength,
        sourceData, destinationData, itemIds,
        renderer;

    beforeEach(() => {
        sourceLength = 3000;
        destinationLength = 0;
        sourceData = JSC.array(sourceLength, JSC.object({
            name: JSC.one_of(pickOne()),
            aValue: JSC.integer(),
            stringValue: JSC.string(),
            anArray: JSC.array(5, JSC.character())
        }))();

        itemIds = addId(sourceData);

        destinationData = [];

        renderer = ReactTestUtils.createRenderer();
    });

    describe('should render', () => {
        it('2 list boxes using defaults', () => {
            renderer.render(<DualListBox source={sourceData} destination={destinationData} />);
            var result = renderer.getRenderOutput();

            expect(result.type).toEqual('div');
            expect(result.props.className).toEqual('form-group row');
            expect(result.props.children.length).toBe(2);
            expect(result.props.children)
                .toEqual([
                    <ListBox
                        ref="right"
                        title="Available Items"
                        source={sourceData.sort((a, b) => a.name.localeCompare(b.name))}
                        moveAllBtn={true}
                        onMove={result.props.children[0].props.onMove}
                        textLength={45}
                        text="name"
                        value="id"
                        disable={undefined}
                        height="300px"
                        direction="right" />,
                    <ListBox
                        ref="left"
                        title="Selected Items"
                        source={destinationData}
                        moveAllBtn={true}
                        onMove={result.props.children[1].props.onMove}
                        textLength={45}
                        text="name"
                        value="id"
                        disable={undefined}
                        height="300px"
                        direction="left" />
                ]);
        });

        it('2 list boxes sorting with duplicate data', () => {
            sourceData = [
                {
                    id: 1,
                    name: "A Name"
                },
                {
                    id: 13,
                    name: "Another Name"
                },
                {
                    id: 15,
                    name: "That Guy"
                },
                {
                    id: 2,
                    name: "This Guy"
                },
                {
                    id: 1,
                    name: "The Other Guy"
                },
                {
                    id: 3,
                    name: "The Guy Over There"
                },
                {
                    id: 14,
                    name: "The Guy Over Here"
                },
                {
                    id: 9,
                    name: "Test"
                },
                {
                    id: 6,
                    name: "Of the"
                },
                {
                    id: 9,
                    name: "Emergency"
                },
                {
                    id: 10,
                    name: "Broadcast"
                },
                {
                    id: 8,
                    name: "System"
                },
                {
                    id: 1,
                    name: "A Name"
                }
            ]
            renderer.render(<DualListBox source={sourceData} destination={destinationData} sortBy="id" />);
            var result = renderer.getRenderOutput();

            expect(result.type).toEqual('div');
            expect(result.props.className).toEqual('form-group row');
            expect(result.props.children.length).toBe(2);
            expect(result.props.children)
                .toEqual([
                    <ListBox
                        ref="right"
                        title="Available Items"
                        source={sourceData.sort((a, b) => a.id === b.id ? 0 : a.id > b.id ? 1 : -1)}
                        moveAllBtn={true}
                        onMove={result.props.children[0].props.onMove}
                        textLength={45}
                        text="name"
                        value="id"
                        disable={undefined}
                        height="300px"
                        direction="right" />,
                    <ListBox
                        ref="left"
                        title="Selected Items"
                        source={destinationData}
                        moveAllBtn={true}
                        onMove={result.props.children[1].props.onMove}
                        textLength={45}
                        text="name"
                        value="id"
                        disable={undefined}
                        height="300px"
                        direction="left" />
                ]);
        });

        it('2 list boxes with custom textLength', () => {
            renderer.render(
                <DualListBox source={sourceData} destination={destinationData} textLength={15} />
            );
            var result = renderer.getRenderOutput();

            expect(result.type).toEqual('div');
            expect(result.props.className).toEqual('form-group row');
            expect(result.props.children)
                .toEqual([
                    <ListBox
                        ref="right"
                        title="Available Items"
                        source={sourceData.sort((a, b) => a.name.localeCompare(b.name))}
                        moveAllBtn={true}
                        onMove={result.props.children[0].props.onMove}
                        textLength={15}
                        text="name"
                        value="id"
                        disable={undefined}
                        height="300px"
                        direction="right" />,
                    <ListBox
                        ref="left"
                        title="Selected Items"
                        source={destinationData}
                        moveAllBtn={true}
                        onMove={result.props.children[1].props.onMove}
                        textLength={15}
                        text="name"
                        value="id"
                        disable={undefined}
                        height="300px"
                        direction="left" />
                ]);
        });

        it('2 list boxes with custom height', () => {
            renderer.render(
                <DualListBox source={sourceData} destination={destinationData} height="150vh" />
            );
            var result = renderer.getRenderOutput();

            expect(result.type).toEqual('div');
            expect(result.props.className).toEqual('form-group row');
            expect(result.props.children)
                .toEqual([
                    <ListBox
                        ref="right"
                        title="Available Items"
                        source={sourceData.sort((a, b) => a.name.localeCompare(b.name))}
                        moveAllBtn={true}
                        onMove={result.props.children[0].props.onMove}
                        textLength={45}
                        text="name"
                        value="id"
                        disable={undefined}
                        height="150vh"
                        direction="right" />,
                    <ListBox
                        ref="left"
                        title="Selected Items"
                        source={destinationData}
                        moveAllBtn={true}
                        onMove={result.props.children[1].props.onMove}
                        textLength={45}
                        text="name"
                        value="id"
                        disable={undefined}
                        height="150vh"
                        direction="left" />
                ]);
        });

        it('2 list boxes with custom titles', () => {
            renderer.render(
                <DualListBox source={sourceData} destination={destinationData} sourceTitle="Data to Pick from" destinationTitle="Data you picked" />
            );
            var result = renderer.getRenderOutput();

            expect(result.type).toEqual('div');
            expect(result.props.className).toEqual('form-group row');
            expect(result.props.children)
                .toEqual([
                    <ListBox
                        ref="right"
                        title="Data to Pick from"
                        source={sourceData.sort((a, b) => a.name.localeCompare(b.name))}
                        moveAllBtn={true}
                        onMove={result.props.children[0].props.onMove}
                        textLength={45}
                        text="name"
                        value="id"
                        disable={undefined}
                        height="300px"
                        direction="right" />,
                    <ListBox
                        ref="left"
                        title="Data you picked"
                        source={destinationData}
                        moveAllBtn={true}
                        onMove={result.props.children[1].props.onMove}
                        textLength={45}
                        text="name"
                        value="id"
                        disable={undefined}
                        height="300px"
                        direction="left" />
                ]);
        });

        it('2 list boxes sorted by id', () => {
            renderer.render(
                <DualListBox source={sourceData} destination={destinationData} sortBy="id" />
            );
            var result = renderer.getRenderOutput();

            expect(result.type).toEqual('div');
            expect(result.props.className).toEqual('form-group row');
            expect(result.props.children)
                .toEqual([
                    <ListBox
                        ref="right"
                        title="Available Items"
                        source={sourceData}
                        moveAllBtn={true}
                        onMove={result.props.children[0].props.onMove}
                        textLength={45}
                        text="name"
                        value="id"
                        disable={undefined}
                        height="300px"
                        direction="right" />,
                    <ListBox
                        ref="left"
                        title="Selected Items"
                        source={destinationData}
                        moveAllBtn={true}
                        onMove={result.props.children[1].props.onMove}
                        textLength={45}
                        text="name"
                        value="id"
                        disable={undefined}
                        height="300px"
                        direction="left" />
                ]);
        });

        it('2 list boxes with data in destination', () => {
            destinationLength = 500;
            var value, i;
            var indices = JSC.array(destinationLength, JSC.integer(0, sourceLength - 1))();

            for(i = 0; i < destinationLength; i++) {
                value = sourceData[indices[i]];
                if (destinationData.indexOf(value) === -1) {
                    destinationData.push(value);
                }
            }

            renderer.render(
                <DualListBox source={sourceData} destination={destinationData} sortBy="id" />
            );
            var result = renderer.getRenderOutput();
            var expectedSource = removeSelectedItems(sourceData, destinationData, 'id');

            expect(result.type).toEqual('div');
            expect(result.props.className).toEqual('form-group row');
            expect(result.props.children)
                .toEqual([
                    <ListBox
                        ref="right"
                        title="Available Items"
                        source={expectedSource}
                        moveAllBtn={true}
                        onMove={result.props.children[0].props.onMove}
                        textLength={45}
                        text="name"
                        value="id"
                        disable={undefined}
                        height="300px"
                        direction="right" />,
                    <ListBox
                        ref="left"
                        title="Selected Items"
                        source={destinationData}
                        moveAllBtn={true}
                        onMove={result.props.children[1].props.onMove}
                        textLength={45}
                        text="name"
                        value="id"
                        disable={undefined}
                        height="300px"
                        direction="left" />
                ]);
        });

        it('2 list boxes, updating source', () => {
            renderer.render(
                <DualListBox source={sourceData} destination={destinationData} sortBy="id" />
            );
            var result = renderer.getRenderOutput();

            expect(result.type).toEqual('div');
            expect(result.props.className).toEqual('form-group row');
            expect(result.props.children)
                .toEqual([
                    <ListBox
                        ref="right"
                        title="Available Items"
                        source={sourceData}
                        moveAllBtn={true}
                        onMove={result.props.children[0].props.onMove}
                        textLength={45}
                        text="name"
                        value="id"
                        disable={undefined}
                        height="300px"
                        direction="right" />,
                    <ListBox
                        ref="left"
                        title="Selected Items"
                        source={destinationData}
                        moveAllBtn={true}
                        onMove={result.props.children[1].props.onMove}
                        textLength={45}
                        text="name"
                        value="id"
                        disable={undefined}
                        height="300px"
                        direction="left" />
                ]);

            sourceLength = 500;
            sourceData = JSC.array(sourceLength, JSC.object({
                name: JSC.one_of(pickOne()),
                aValue: JSC.integer(),
                stringValue: JSC.string(),
                anArray: JSC.array(5, JSC.character())
            }))();

            itemIds = addId(sourceData);

            renderer.render(
                <DualListBox source={sourceData} destination={destinationData} sortBy="id" />
            );
            var result = renderer.getRenderOutput();

            expect(result.type).toEqual('div');
            expect(result.props.className).toEqual('form-group row');
            expect(result.props.children)
                .toEqual([
                    <ListBox
                        ref="right"
                        title="Available Items"
                        source={sourceData}
                        moveAllBtn={true}
                        onMove={result.props.children[0].props.onMove}
                        textLength={45}
                        text="name"
                        value="id"
                        disable={undefined}
                        height="300px"
                        direction="right" />,
                    <ListBox
                        ref="left"
                        title="Selected Items"
                        source={destinationData}
                        moveAllBtn={true}
                        onMove={result.props.children[1].props.onMove}
                        textLength={45}
                        text="name"
                        value="id"
                        disable={undefined}
                        height="300px"
                        direction="left" />
                ]);
        });
    });
});