'use strict';

var _react = require('../bower_components/react/react.js');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('../bower_components/react/react-dom.js');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactDuallistbox = require('../dist/react-duallistbox.js');

var _reactDuallistbox2 = _interopRequireDefault(_reactDuallistbox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getData = JSC.array(3000, JSC.object({
    name: JSC.one_of(pickOne()),
    aValue: JSC.integer(),
    stringValue: JSC.string(),
    anArray: JSC.array(5, JSC.character())
}));

var getDestinationData = function getDestinationData(sourceData, destLength) {
    var indices = JSC.array(destLength, JSC.integer(0, sourceData.length - 1));
    var destinationData = [];

    for (var i = 0; i < destLength; i++) {
        var value = sourceData[indices[i]];
        if (destinationData.indexOf(value) === -1) {
            destinationData.push(value);
        }
    }

    return destinationData;
};

var sourceData = getData();
var destinationData = getDestinationData(sourceData, 15);

(0, _reactDom2.default)(_react2.default.createElement(_reactDuallistbox2.default, { source: sourceData, destination: destinationData }), document.getElementById('boxes1'));

var destinationData2 = [];
(0, _reactDom2.default)(_react2.default.createElement(_reactDuallistbox2.default, { source: sourceData, destination: destinationData2 }), document.getElementById('boxes2'));

(0, _reactDom2.default)(_react2.default.createElement(_reactDuallistbox2.default, { source: sourceData, destination: destinationData, disable: true }), document.getElementById('boxes3'));