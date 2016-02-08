/*!
 * react-duallistbox - a dual list box for selecting and moving data using react
 * @version v0.1.0
 * @link https://github.com/killyosaur/react-duallistbox#readme
 * @license CC-BY-SA-4.0
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["DualListBox"] = factory(require("react"));
	else
		root["DualListBox"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(1);
	var PropTypes = React.PropTypes;
	var ListBox = __webpack_require__(2);

	var DualListBox = React.createClass({
	    displayName: 'DualListBox',
	    propTypes: {
	        text: PropTypes.string.isRequired,
	        value: PropTypes.string.isRequired,
	        sourceTitle: PropTypes.string,
	        destinationTitle: PropTypes.string,
	        timeout: PropTypes.number,
	        textLength: PropTypes.number,
	        moveAllBtn: PropTypes.bool,
	        maxAllBtn: PropTypes.number,
	        warning: PropTypes.string,
	        sortBy: PropTypes.string,
	        source: PropTypes.arrayOf(PropTypes.object).isRequired,
	        destination: PropTypes.arrayOf(PropTypes.object).isRequired,
	        onChange: PropTypes.func
	    },
	    getInitialState: function getInitialState() {
	        return {
	            sourceData: [],
	            destinationData: []
	        };
	    },
	    getDefaultProps: function getDefaultProps() {
	        return {
	            text: 'name', // Text that is assigned to the option field.
	            value: 'id', // Optional Value field, will create a standard list box by value.
	            sourceTitle: 'Available Items', // Title of the source list of the dual list box.
	            destinationTitle: 'Selected Items', // Title of the destination list of the dual list box.
	            timeout: 500, // Timeout for when a filter search is started.
	            textLength: 45, // Maximum text length that is displayed in the select.
	            moveAllBtn: true, // Whether the append all button is available.
	            maxAllBtn: 500, // Maximum size of list in which the all button works without warning. See below.
	            height: '300px',
	            sortBy: 'name',
	            warning: 'Are you sure you want to move this many items? Doing so can cause your browser to become unresponsive.'
	        };
	    },
	    componentWillMount: function componentWillMount() {
	        var sourceData = this.removeData(this.props.source, this.props.destination).sort(this.compare);

	        this.setState({
	            sourceData: sourceData,
	            destinationData: this.props.destination.sort(this.compare)
	        });
	    },
	    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	        var sourceData = this.removeData(nextProps.source, nextProps.destination).sort(this.compare);

	        this.setState({
	            sourceData: sourceData,
	            destinationData: nextProps.destination.sort(this.compare)
	        });
	    },
	    removeData: function removeData(destinationData, dataToRemove) {
	        var dataToReturn = [];
	        for (var x = 0; x < destinationData.length; x++) {
	            var index = this.getIndex(dataToRemove, destinationData[x]);
	            if (index === -1) {
	                dataToReturn.push(destinationData[x]);
	            }
	        }

	        return dataToReturn;
	    },
	    getIndex: function getIndex(data, item) {
	        var ind = 0,
	            length = data.length;
	        if (!data || data.length === 0) return -1;

	        for (; ind < length; ind++) {
	            if (data[ind][this.props.value] === item[this.props.value]) {
	                return ind;
	            }
	        }

	        return -1;
	    },
	    compare: function compare(a, b) {
	        if (typeof a[this.props.sortBy] === 'string' && typeof b[this.props.sortBy] === 'string') {
	            return a[this.props.sortBy].localeCompare(b[this.props.sortBy]);
	        }

	        return a[this.props.sortBy] === b[this.props.sortBy] ? 0 : a[this.props.sortBy] > b[this.props.sortBy] ? 1 : -1;
	    },
	    moveLeft: function moveLeft(itemsToMove) {
	        var source = this.state.sourceData.concat(itemsToMove).sort(this.compare);
	        var destination = this.removeData(this.state.destinationData, itemsToMove);
	        this.setState({
	            sourceData: source,
	            destinationData: destination
	        });

	        if (this.props.onChange) {
	            this.props.onChange(destination);
	        }
	    },
	    moveRight: function moveRight(itemsToMove) {
	        var source = this.removeData(this.state.sourceData, itemsToMove);
	        var destination = this.state.destinationData.concat(itemsToMove).sort(this.compare);
	        this.setState({
	            sourceData: source,
	            destinationData: destination
	        });

	        if (this.props.onChange) {
	            this.props.onChange(destination);
	        }
	    },
	    render: function render() {
	        return React.createElement(
	            'div',
	            { className: 'form-group row' },
	            React.createElement(ListBox, {
	                ref: 'source',
	                title: this.props.sourceTitle,
	                source: this.state.sourceData,
	                moveAllBtn: this.props.moveAllBtn,
	                onMove: this.moveRight,
	                textLength: this.props.textLength,
	                text: this.props.text,
	                value: this.props.value,
	                disable: this.props.disable,
	                height: this.props.height,
	                direction: 'right' }),
	            React.createElement(ListBox, {
	                ref: 'destination',
	                title: this.props.destinationTitle,
	                source: this.state.destinationData,
	                moveAllBtn: this.props.moveAllBtn,
	                onMove: this.moveLeft,
	                textLength: this.props.textLength,
	                text: this.props.text,
	                value: this.props.value,
	                disable: this.props.disable,
	                height: this.props.height,
	                direction: 'left' })
	        );
	    }
	});

	module.exports = DualListBox;

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(1);
	var PropTypes = React.PropTypes;
	var ButtonComponent = __webpack_require__(3);
	var FilterBox = __webpack_require__(4);

	var ListBox = React.createClass({
	    displayName: 'ListBox',
	    propTypes: {
	        title: PropTypes.string.isRequired,
	        source: PropTypes.arrayOf(PropTypes.object).isRequired,
	        moveAllBtn: PropTypes.bool.isRequired,
	        onMove: PropTypes.func.isRequired,
	        textLength: PropTypes.number,
	        text: PropTypes.string.isRequired,
	        value: PropTypes.string.isRequired,
	        direction: PropTypes.string.isRequired
	    },
	    getInitialState: function getInitialState() {
	        return {
	            selected: [],
	            filter: '',
	            filteredData: [],
	            onClickDisabled: true,
	            onClickAllDisabled: true
	        };
	    },
	    componentWillMount: function componentWillMount() {
	        this.setState({
	            filteredData: this.props.source,
	            onClickAllDisabled: this.props.disable || this.props.source.length === 0
	        });
	    },
	    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	        if (this.props.source !== nextProps.source) {
	            var filteredData = this.filterData(this.state.filter, nextProps.source);
	            this.setState({
	                filteredData: filteredData,
	                onClickAllDisabled: this.props.disable || filteredData.length === 0,
	                selected: [],
	                onClickDisabled: true
	            });
	        }
	    },
	    onClickAll: function onClickAll(event) {
	        this.deselectItems();
	        this.props.onMove(this.state.filteredData);
	    },
	    onClick: function onClick(event) {
	        this.deselectItems();
	        this.props.onMove(this.state.selected);
	    },
	    deselectItems: function deselectItems() {
	        for (var i = 0; i < this.state.selected.length; i++) {
	            this.refs.select.options[this.state.selected[i].optionId].selected = false;
	        }
	    },
	    handleFilterChange: function handleFilterChange(event) {
	        var filter = '';
	        if (this.filterBox !== null) {
	            filter = this.filterBox.refs.filter.input || event.target.value;
	        } else {
	            filter = event.target.value;
	        }

	        this.deselectItems();
	        var result = this.filterData(filter);

	        this.setState({
	            filter: filter,
	            filteredData: result,
	            selected: [],
	            onClickDisabled: true,
	            onClickAllDisabled: this.props.disable || result.length === 0
	        });
	    },
	    handleSelectChange: function handleSelectChange(event) {
	        var _this = this;

	        var selectedValues = [],
	            disable = this.props.disable;
	        var select = this.refs.select || event.target;

	        for (var i = 0, l = select.options.length; i < l; i++) {
	            if (select.options[i].selected) {
	                var itemValue = select.options[i].value;

	                var item = this.props.source.filter(function (v) {
	                    return v[_this.props.value] == itemValue;
	                });
	                if (item.length > 0) {
	                    item[0].optionId = i;
	                    selectedValues.push(item[0]);
	                }
	            }
	        }

	        if (!disable && selectedValues.length === 0) {
	            disable = true;
	        }

	        this.setState({
	            selected: selectedValues,
	            onClickDisabled: disable
	        });
	    },
	    buttons: function buttons() {
	        var btnNodes = [];
	        var btn = function btn(thisArg, classes, func, key) {
	            return React.createElement(ButtonComponent, {
	                key: key,
	                click: thisArg[func],
	                width: thisArg.props.moveAllBtn ? 6 : 12,
	                disable: thisArg.state[func + 'Disabled'],
	                classes: classes });
	        };

	        var chevron = 'glyphicon-chevron-' + this.props.direction.toLowerCase();

	        switch (this.props.direction.toLowerCase()) {
	            case 'right':
	                if (this.props.moveAllBtn === true) {
	                    btnNodes.push(btn(this, ['glyphicon-list', chevron], 'onClickAll', 1));
	                }
	                btnNodes.push(btn(this, [chevron], 'onClick', 2));
	                break;
	            case 'left':
	                btnNodes.push(btn(this, [chevron], 'onClick', 3));
	                if (this.props.moveAllBtn === true) {
	                    btnNodes.push(btn(this, [chevron, 'glyphicon-list'], 'onClickAll', 4));
	                }
	                break;
	        }

	        return btnNodes;
	    },
	    filterData: function filterData(filter, source) {
	        var _this2 = this;

	        var source = source || this.props.source;
	        if (filter === '' || filter === undefined) {
	            return source;
	        }

	        var result = source.filter(function (v) {
	            return v[_this2.props.text].toLowerCase().indexOf(filter.toLowerCase()) > -1;
	        });
	        return result;
	    },
	    render: function render() {
	        var _this3 = this;

	        var items = this.state.filteredData.map(function (item, index) {
	            var text = item[_this3.props.text];
	            return React.createElement(
	                'option',
	                { key: index, value: item[_this3.props.value] },
	                _this3.props.textLength > 0 && text.length > _this3.props.textLength ? text.substring(0, _this3.props.textLength - 3) + '...' : text
	            );
	        }, this);

	        return React.createElement(
	            'div',
	            { className: 'col-sm-6' },
	            React.createElement(
	                'h4',
	                null,
	                this.props.title,
	                React.createElement(
	                    'small',
	                    null,
	                    ' - showing ',
	                    this.state.filteredData.length
	                )
	            ),
	            React.createElement(FilterBox, { handleFilterChange: this.handleFilterChange, ref: function ref(_ref) {
	                    return _this3.filterBox = _ref;
	                } }),
	            this.buttons(),
	            React.createElement(
	                'select',
	                {
	                    ref: 'select',
	                    style: { width: '100%', height: this.props.height || '200px' },
	                    multiple: 'multiple',
	                    onChange: this.handleSelectChange },
	                items
	            )
	        );
	    }
	});

	module.exports = ListBox;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(1);
	var PropTypes = React.PropTypes;

	var ButtonComponent = React.createClass({
	    displayName: 'ButtonComponent',
	    propTypes: {
	        classes: PropTypes.arrayOf(PropTypes.string).isRequired,
	        click: PropTypes.func,
	        width: PropTypes.number.isRequired,
	        disable: PropTypes.bool
	    },
	    getDefaultProps: function getDefaultProps() {
	        return {
	            width: 12,
	            click: function click() {},
	            classes: [],
	            bool: false
	        };
	    },
	    getIcons: function getIcons() {
	        var icons = this.props.classes.map(function (c, index) {
	            return React.createElement('i', { key: index, className: "glyphicon " + c });
	        });

	        return icons;
	    },
	    render: function render() {
	        return React.createElement(
	            'button',
	            { className: "btn btn-default col-sm-" + this.props.width,
	                style: { marginBottom: '5px' },
	                type: 'button',
	                onClick: this.props.click,
	                disabled: this.props.disable },
	            this.getIcons()
	        );
	    }
	});

	module.exports = ButtonComponent;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(1);
	var PropTypes = React.PropTypes;

	var FilterBox = React.createClass({
	    displayName: 'FilterBox',
	    propTypes: {
	        handleFilterChange: PropTypes.func.isRequired
	    },
	    render: function render() {
	        return React.createElement('input', { style: { marginBottom: '5px' }, className: 'filter form-control', ref: 'filter',
	            type: 'text', placeholder: 'Filter', onChange: this.props.handleFilterChange });
	    }
	});

	module.exports = FilterBox;

/***/ }
/******/ ])
});
;