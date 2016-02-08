import React from '../bower_components/react/react.js'
import ReactDOM from '../bower_components/react/react-dom.js'
import DualListBox from '../dist/react-duallistbox.js'

let getData = JSC.array(3000, JSC.object({
    name: JSC.one_of(pickOne()),
    aValue: JSC.integer(),
    stringValue: JSC.string(),
    anArray: JSC.array(5, JSC.character())
}));

let getDestinationData = (sourceData, destLength) => {
    let indices = JSC.array(destLength, JSC.integer(0, sourceData.length - 1));
    let destinationData = [];

    for(var i = 0; i < destLength; i++) {
        var value = sourceData[indices[i]];
        if (destinationData.indexOf(value) === -1) {
            destinationData.push(value);
        }
    }

    return destinationData;
};

var sourceData = getData();
var destinationData = getDestinationData(sourceData, 15);

ReactDOM(<DualListBox source={ sourceData } destination= { destinationData } />,
    document.getElementById('boxes1'));

var destinationData2 = [];
ReactDOM(<DualListBox source={ sourceData } destination= { destinationData2 } />,
    document.getElementById('boxes2'));

ReactDOM(<DualListBox source={ sourceData } destination= { destinationData } disable={true} />,
    document.getElementById('boxes3'));
