import React from '../../bower_components/react/react.js'
import ReactDOM from '../../bower_components/react/react-dom.js'
import DualListBox from '../../dist/react-duallistbox.js'
import JSC from 'jscheck'

let getData = () => {
    let valuesToReturn = JSC.array(3000, JSC.object({
        name: JSC.one_of(pickOne()),
        aValue: JSC.integer(),
        stringValue: JSC.string(),
        anArray: JSC.array(5, JSC.character())
    }))();

    addId(valuesToReturn, 'id');

    return valuesToReturn;
};

let getDestinationData = (sourceData, destLength) => {
    let indices = JSC.array(destLength, JSC.integer(0, sourceData.length - 1))();
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

function onChange(values) {
    let ids = [];
    for (let i = 0; i < values.length; i++) {
        ids.push(values[i].id);
    }
    alert('In destination: ' + ids.join(', '))
}

ReactDOM.render(<DualListBox source={ sourceData } destination= { destinationData } onChange={onChange} />,
    document.getElementById('boxes1'));

var destinationData2 = [];
ReactDOM.render(<DualListBox source={ sourceData } destination= { destinationData2 } />,
    document.getElementById('boxes2'));

ReactDOM.render(<DualListBox source={ sourceData } destination= { destinationData } disable={true} />,
    document.getElementById('boxes3'));
