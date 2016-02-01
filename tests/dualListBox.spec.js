var React = require('react');
var ReactTestUtils = require('react-addons-test-utils');
var ButtonComponent = require('../src/button.jsx');
var ButtonAllComponent = require('../src/buttonAll.jsx');
var ListBox = require('../src/listBox.jsx');
var rewire = require('rewire');
var JSC = require('jscheck');
var pickOne = require('helpers/pickOne');
var removeDups = require('helpers/removeDups');
var removeSelectedItems = require('helpers/removeSelectedItems');
var addId = require('helpers/addId');

describe('DualListBox', () => {
    var dualListBoxLib, dualListBox;
    
    beforeEach(() => {
        dualListBoxLib = rewire('../src/dualListBox.jsx');
        dualListBox = dualListBoxLib.default;
    });
    
    describe('removeData', () => {
        
    });
});