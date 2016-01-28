/******/ (function(modules) { // webpackBootstrap
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

	var PropTypes = React.ReactPropTypes;
	var ListBox = __webpack_require__(1);

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

	module.exports = React.createClass({
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

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {var PropTypes = React.PropTypes;
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
	            moveAllItems: []
	        };
	    },
	    onClickAll: function(event) {
	        this.props.onMove(this.state.moveAllItems);
	        this.setState({
	            selected: [],
	            moveAllItems: []
	        });
	    },
	    onClick: function(event) {
	        this.props.onMove(this.state.selected);
	        this.setState({
	            selected: []
	        });
	    },
	    handleFilterChange: function(event) {
	        this.setState({
	            filter: event.target.value
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
	    buttons: function(){
	        var btnNodes = [];
	        var btn = function() {
	            return (
	                React.createElement(ButtonComponent, {
	                    moveAll: this.props.moveAll, 
	                    click: this.onClick, 
	                    directiosn: this.props.direction, 
	                    disable: this.disabled(this.state.selected.length)})
	            );
	        }

	        var btnAll = function() {
	            return (
	                React.createElement(ButtonAllComponent, {
	                    click: this.onClickAll, 
	                    direction: this.props.direction, 
	                    disable: this.disable(this.state.moveAllItems.length)})
	            );
	        }

	        switch(this.props.direction.toLowerCase()) {
	            case 'right':
	                if (this.props.moveAll) {
	                    btnNodes.push(btnAll());
	                }
	                btnNodes.push(btn());
	                break;
	            case 'left':
	                btnNodes.push(btn());
	                if (this.props.moveAll) {
	                    btnNodes.push(btnAll());
	                }
	                break;
	        }

	        return btnNodes;
	    },
	    filteredData: function() {
	        if(filter === '') {
	            return this.props.source;
	        }
	        var filter = this.state.filter;
	        var result = this.props.source.filter(function(v) { return v.indexOf(filter) > -1; });
	        this.setState({
	           moveAllItems: result 
	        });
	        return result;
	    },
	    render: function () {
	        var items = this.filteredData().map(
	            function(item) {
	                var text = item[this.props.text];
	                return (
	                    React.createElement("option", {value: item[this.props.value]}, 
	                        
	                             this.props.textLength > 0 && text.length > this.props.textLength ?
	                                text.substring(0, this.props.textLength - 3) + '...' :
	                                text
	                        
	                    )
	                );
	            }
	        );

	        return (
	            React.createElement("div", {className: "col-md-6"}, 
	                React.createElement("h4", null, this.props.title, React.createElement("small", null, " - showing ")), 
	                React.createElement("input", {style: "margin-bottom: 5px;", className: "filter form-control", 
	                       type: "text", placeholder: "Filter", onChange: this.handleFilterChange}), 
	                this.buttons(), 
	                React.createElement("select", {
	                    style: "width: '100%'; height: " + (this.props.height || '200px'), 
	                    multiple: "multiple", 
	                    onChange: this.handleSelectChange}, 
	                    items
	                )
	            )
	        );
	    }
	});

	module.export = ListBox;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {var ButtonComponent = React.createClass({
	    displayName: 'ButtonComponent',
	    getClasses: function() {
	        return this.props.moveAll ? 'col-md-6' : 'col-md-12';
	    },
	    render: function() {
	        var btnPosition = this.getClasses();
	        return (
	            React.createElement("button", {className: "btn btn-default " + btnPosition, style: "margin-bottom: 5px;", 
	                    type: "button", onClick: this.props.click}, 
	                React.createElement("span", {className: "glyphicon glyphicon-chevron-" + this.props.direction.toLowerCase()})
	            )
	        );
	    }
	});

	module.export = ButtonComponent;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {var ButtonAllComponent = React.createClass({
	    displayName: 'ButtonAllComponent',
	    render: function() {
	        return (
	            React.createElement("button", {className: "btn btn-default col-md-6", style: "margin-bottom: 5px;", 
	                    type: "button", onClick: this.props.click}, 
	                React.createElement("span", {className: "glyphicon glyphicon-list"}), 
	                React.createElement("span", {className: "glyphicon glyphicon-chevron-" + this.props.direction.toLowerCase()})
	            )
	        );
	    }
	});

	module.export = ButtonAllComponent;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ }
/******/ ]);