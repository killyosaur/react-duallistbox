var React = require('react');
var PropTypes = React.PropTypes;
var ListBox = require('./listBox.jsx');

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
            filteredSource: [],
            destinationData: [],
            filteredDestination: []
        };
    },
    handleSourceFilterChange: function(event) {
        var result = this.filteredData(event.target.value);
    },
    handleDestinationFilterChange: function(event) {
        var result = this.filteredData(event.target.value);
    },
    getDefaultProps: function() {
        return {
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
        };
    },
    componentWillMount: function() {
        var sourceData = removeData(this.props.source, this.props.destination, options);

        this.setState({
            sourceData: sourceData,
            destinationData: this.props.destination
        });
    },
    removeData: function(destinationData, dataToRemove) {
        var dataToReturn = [];
        for (var x = 0; x < destinationData.length; x++) {
            var index = this.getIndex(dataToRemove, destinationData[x]);
            if (index === -1) {
                dataToReturn.push(destinationData[x]);
            }
        }

        return dataToReturn;
    },
    getIndex: function(data, item) {
        var ind = 0, length = data.length;
        if (!data || data.length === 0) return -1;
        
        if (item.hasOwnProperty(this.props.options.value)) {
            for (; ind < length; ind++) {
                if (data[ind][this.props.options.value] === item[this.props.options.value]) {
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
    },
    compare: function(a, b) {
        if (a[this.props.options.sortBy] > b[this.props.options.sortBy]) {
            return 1;
        }
        if (a[this.props.options.sortBy] < b[this.props.options.sortBy]) {
            return -1;
        }
        return 0;
    },
    moveLeft: function(itemsToMove) {
        var destination = this.removeData(this.state.destinationData, itemsToMove);
        this.setState({
            sourceData: this.state.sourceData.concat(itemsToMove).sort(this.compare),
            destinationData: destination
        });

        if(this.props.onChange) {
            this.props.onChange(destination);
        }
    },
    moveRight: function(itemsToMove) {
        var source = this.removeData(this.state.sourceData, itemsToMove);
        var destination = this.state.destinationData.concat(itemsToMove).sort(this.compare);
        this.setState({
            sourceData: source,
            destinationData: destination
        });

        if(this.props.onChange) {
            this.props.onChange(destination);
        }
    },
    render: function() {
        return (
            <div className="form-group row">
                <ListBox 
                    title={this.props.options.sourceTitle}
                    source={this.state.sourceData}
                    moveAll={this.props.options.moveAllBtn}
                    onMove={this.moveRight}
                    textLength={this.props.options.textLength}
                    onChange={this.itemsMoved}
                    text={this.props.options.text}
                    value={this.props.options.value}
                    disable={this.props.disable}
                    height={this.props.options.height}
                    direction="right" />
                <ListBox
                    title={this.props.options.destinationTitle}
                    source={this.state.destinationData}
                    moveAll={this.props.options.moveAllBtn}
                    onMove={this.moveLeft}
                    textLength={this.props.options.textLength}
                    onChange={this.itemsMoved}
                    text={this.props.options.text}
                    value={this.props.options.value}
                    disable={this.props.disable}
                    height={this.props.options.height}
                    direction="left" />
            </div>
        );
    }
});

module.exports = DualListBox;