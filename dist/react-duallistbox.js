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

	var React = __webpack_require__(1);
	var PropTypes = React.PropTypes;
	var ListBox = __webpack_require__(2);

	function removeData(destinationData, dataToRemove, options) {
	    var dataToReturn = [];
	    for (var x = 0; x < destinationData.length; x++) {
	        var index = getIndex(dataToRemove, destinationData[x], options);
	        if (index === -1) {
	            dataToReturn.push(destinationData[x]);
	        }
	    }

	    return dataToReturn;
	}

	function getIndex(data, item, options) {
	    var ind = 0, length = data.length;
	    if (!data || data.length === 0) return -1;
	    
	    if (item.hasOwnProperty(options.value)) {
	        for (; ind < length; ind++) {
	            if (data[ind][options.value] === item[options.value]) {
	                return ind;
	            }
	        }
	    } else {
	        for (; ind < length; ind++) {
	            var isEqual = false;
	            for (var j in item) {
	                if (data[ind].hasOwnProperty(j) && item.hasOwnProperty(j)) {
	                    isEqual = data[ind][j] === item[j];
	                }
	            }
	            if(isEqual) {
	                return ind;
	            }
	        }
	    }
	    return -1;
	}

	function setOptions(optionState, props) {
	    for (var i in optionState) {
	        optionState[i] = props[i] ? props[i] : optionState[i];
	    }

	    return optionState;
	}

	var DualListBox = React.createClass({
	    displayName: 'DualListBox',
	    propTypes: {
	        text: PropTypes.string,
	        value: PropTypes.string,
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
	    getInitialState: function() {
	        return {
	            sourceData: [],
	            destinationData: [],
	            options: {
	                text: 'name',                       // Text that is assigned to the option field.
	                value: 'id',                        // Optional Value field, will create a standard list box by value.
	                sourceTitle: 'Available Items',     // Title of the source list of the dual list box.
	                destinationTitle: 'Selected Items', // Title of the destination list of the dual list box.
	                timeout: 500,                       // Timeout for when a filter search is started.
	                textLength: 45,                     // Maximum text length that is displayed in the select.
	                moveAllBtn: true,                   // Whether the append all button is available.
	                maxAllBtn: 500,                     // Maximum size of list in which the all button works without warning. See below.
	                height: '300px',
	                sortBy: 'name',
	                warning: 'Are you sure you want to move this many items? Doing so can cause your browser to become unresponsive.'
	            }
	        };
	    },
	    componentDidMount: function() {
	        var options = setOptions(this.state.options, this.props);

	        var sourceData = removeData(this.props.source, this.props.destination, options);

	        this.setState({
	            sourceData: sourceData,
	            destinationData: this.props.destination,
	            options: options
	        });
	    },
	    compare: function(a, b) {
	        if (a[this.state.options.sortBy] > b[this.state.options.sortBy]) {
	            return 1;
	        }
	        if (a[this.state.options.sortBy] < b[this.state.options.sortBy]) {
	            return -1;
	        }
	        return 0;
	    },
	    moveLeft: function(itemsToMove) {
	        var destination = removeData(this.state.destinationData, itemsToMove, this.state.options);
	        this.setState({
	            sourceData: this.state.sourceData.concat(itemsToMove).sort(this.compare),
	            destinationData: destination
	        });

	        if(this.props.onChange) {
	            this.props.onChange(destination);
	        }
	    },
	    moveRight: function(itemsToMove) {
	        var source = removeData(this.state.sourceData, itemsToMove, this.state.options);
	        var destination = this.state.destinationData.concat(itemsToMove).sort(this.compare);
	        this.setState({
	            sourceData: source,
	            destinationData: destination
	        });

	        if(this.props.onChange) {
	            this.props.onChange(destination);
	        }
	    },
	    itemsMoved: function() {
	        
	    },
	    render: function() {
	        return (
	            React.createElement("div", {className: "form-group row"}, 
	                React.createElement(ListBox, {
	                    title: this.state.options.sourceTitle, 
	                    source: this.state.sourceData, 
	                    moveAll: this.state.options.moveAllBtn, 
	                    onMove: this.moveRight, 
	                    textLength: this.state.options.textLength, 
	                    onChange: this.itemsMoved, 
	                    text: this.state.options.text, 
	                    value: this.state.options.value, 
	                    disable: this.props.disable, 
	                    height: this.state.options.height, 
	                    direction: "right"}), 
	                React.createElement(ListBox, {
	                    title: this.state.options.destinationTitle, 
	                    source: this.state.destinationData, 
	                    moveAll: this.state.options.moveAllBtn, 
	                    onMove: this.moveLeft, 
	                    textLength: this.state.options.textLength, 
	                    onChange: this.itemsMoved, 
	                    text: this.state.options.text, 
	                    value: this.state.options.value, 
	                    disable: this.props.disable, 
	                    height: this.state.options.height, 
	                    direction: "left"})
	            )
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

	var PropTypes = React.PropTypes;
	var ButtonComponent = __webpack_require__(3);
	var ButtonAllComponent = __webpack_require__(4);

	var ListBox = React.createClass({
	    displayName: 'ListBox',
	    propTypes: {
	        title: PropTypes.string.isRequired,
	        source: PropTypes.arrayOf(PropTypes.object).isRequired,
	        moveAll: PropTypes.bool.isRequired,
	        onMove: PropTypes.func.isRequired,
	        textLength: PropTypes.number,
	        onChange: PropTypes.func.isRequired,
	        text: PropTypes.string.isRequired,
	        value: PropTypes.string.isRequired,
	        direction: PropTypes.string.isRequired
	    },
	    getInitialState: function(){
	        return {
	            selected: [],
	            filter: '',
	            filteredData: []
	        };
	    },
	    onClickAll: function(event) {
	        this.props.onMove(this.state.filteredData);
	        this.setState({
	            selected: [],
	            filteredData: []
	        });
	    },
	    onClick: function(event) {
	        this.props.onMove(this.state.selected);
	        this.setState({
	            selected: []
	        });
	    },
	    handleFilterChange: function(event) {
	        var result = this.filteredData(event.target.value);
	        this.setState({
	            filter: event.target.value,
	            filteredData: result
	        });
	    },
	    handleSelectChange: function(event) {
	        var selectedValues = [];
	        for (var i = 0, l = event.target.options.length; i < l; i++) {
	            if (event.target.options[i].selected) {
	                selectedValues.push(event.target.options[i]);
	            }
	        }
	        this.setState({
	            selected: selectedValues
	        });
	    },
	    disabled: function(sourceLength) {
	        return this.props.disable || sourceLength === 0;
	    },
	    buttons: function() {
	        var btnNodes = [];
	        var btn = function(thisArg) {
	            return (
	                React.createElement(ButtonComponent, {
	                    key: 's-' + thisArg.props.direction, 
	                    moveAll: thisArg.props.moveAll, 
	                    click: thisArg.onClick, 
	                    direction: thisArg.props.direction, 
	                    disable: thisArg.disabled(thisArg.state.selected.length)})
	            );
	        }

	        var btnAll = function(thisArg) {
	            return (
	                React.createElement(ButtonAllComponent, {
	                    key: 'a-' + thisArg.props.direction, 
	                    click: thisArg.onClickAll, 
	                    direction: thisArg.props.direction, 
	                    disable: thisArg.disabled(thisArg.state.filteredData.length)})
	            );
	        }

	        switch(this.props.direction.toLowerCase()) {
	            case 'right':
	                if (this.props.moveAll === true) {
	                    btnNodes.push(btnAll(this));
	                }
	                btnNodes.push(btn(this));
	                break;
	            case 'left':
	                btnNodes.push(btn(this));
	                if (this.props.moveAll === true) {
	                    btnNodes.push(btnAll(this));
	                }
	                break;
	        }

	        return btnNodes;
	    },
	    filteredData: function(filter) {
	        if (filter === '' || filter === undefined) {
	            return this.props.source;
	        }

	        var result = this.props.source.filter(function(v) { return v[this.props.text].indexOf(filter) > -1; }, this);
	        return result;
	    },
	    render: function () {
	        var sourceData = this.state.filteredData.length > 0 ? this.state.filteredData : this.props.source; 

	        var items = sourceData.map(
	            function(item) {
	                var text = item[this.props.text];
	                return (
	                    React.createElement("option", {key: item[this.props.value], value: item[this.props.value]}, 
	                        
	                             this.props.textLength > 0 && text.length > this.props.textLength ?
	                                text.substring(0, this.props.textLength - 3) + '...' :
	                                text
	                        
	                    )
	                );
	            }, this);

	        return (
	            React.createElement("div", {className: "col-md-6"}, 
	                React.createElement("h4", null, this.props.title, React.createElement("small", null, " - showing ", sourceData.length)), 
	                React.createElement("input", {style: {marginBottom: '5px'}, className: "filter form-control", 
	                       type: "text", placeholder: "Filter", onChange: this.handleFilterChange}), 
	                this.buttons(), 
	                React.createElement("select", {
	                    style: {width: '100%', height: (this.props.height || '200px')}, 
	                    multiple: "multiple", 
	                    onChange: this.handleSelectChange}, 
	                    items
	                )
	            )
	        );
	    }
	});

	module.exports = ListBox;

/***/ },
/* 3 */
/***/ function(module, exports) {

	var ButtonComponent = React.createClass({
	    displayName: 'ButtonComponent',
	    getClasses: function() {
	        return this.props.moveAll ? 'col-md-6' : 'col-md-12';
	    },
	    render: function() {
	        var btnPosition = this.getClasses();
	        return (
	            React.createElement("button", {className: "btn btn-default " + btnPosition, style: {marginBottom: '5px'}, 
	                    type: "button", onClick: this.props.click}, 
	                React.createElement("span", {className: "glyphicon glyphicon-chevron-" + this.props.direction.toLowerCase()})
	            )
	        );
	    }
	});

	module.exports = ButtonComponent;

/***/ },
/* 4 */
/***/ function(module, exports) {

	var ButtonAllComponent = React.createClass({
	    displayName: 'ButtonAllComponent',
	    render: function() {
	        var icons = [];
	        var direction = this.props.direction.toLowerCase();
	        function list() {
	            return (React.createElement("span", {key: "1", className: "glyphicon glyphicon-list"}));
	        }
	        
	        function chevron(dir) {
	            return (React.createElement("span", {key: "0", className: "glyphicon glyphicon-chevron-" + dir}));
	        }

	        switch(direction) {
	            case 'right':
	                icons.push(list());
	                icons.push(chevron(direction));
	                break;
	            case 'left':
	                icons.push(chevron(direction));
	                icons.push(list());
	                break;
	        }

	        return (
	            React.createElement("button", {className: "btn btn-default col-md-6", style: {marginBottom: '5px'}, 
	                    type: "button", onClick: this.props.click}, 
	                    icons
	            )
	        );
	    }
	});

	module.exports = ButtonAllComponent;

/***/ }
/******/ ])
});
;