var React = require('react');
var PropTypes = React.PropTypes;
var ListBox = require('listBox.jsx');

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
    getInitialState: function() {
        return {
            sourceData: [],
            destinationData: []
        };
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
        var sourceData = this.removeData(this.props.source, this.props.destination).sort(this.compare);

        this.setState({
            sourceData: sourceData,
            destinationData: this.props.destination.sort(this.compare)
        });
    },
    componentWillReceiveProps: function(nextProps) {
        var sourceData = this.removeData(nextProps.source, nextProps.destination).sort(this.compare);

        this.setState({
            sourceData: sourceData,
            destinationData: nextProps.destination.sort(this.compare)
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

        for (; ind < length; ind++) {
            if (data[ind][this.props.value] === item[this.props.value]) {
                return ind;
            }
        }

        return -1;
    },
    compare: function(a, b) {
        if(typeof a[this.props.sortBy] === 'string' && 
            typeof b[this.props.sortBy] === 'string')
        {
            return a[this.props.sortBy].localeCompare(b[this.props.sortBy])
        }

        return a[this.props.sortBy] === b[this.props.sortBy] ? 0 : 
            a[this.props.sortBy] > b[this.props.sortBy] ? 1 : -1;
    },
    moveLeft: function(itemsToMove) {
        var source = this.state.sourceData.concat(itemsToMove).sort(this.compare);
        var destination = this.removeData(this.state.destinationData, itemsToMove);

        if(this.props.onChange) {
            this.props.onChange(destination, this.state.destinationData);
        }

        this.setState({
            sourceData: source,
            destinationData: destination
        });
    },
    moveRight: function(itemsToMove) {
        var source = this.removeData(this.state.sourceData, itemsToMove);
        var destination = this.state.destinationData.concat(itemsToMove).sort(this.compare);

        if(this.props.onChange) {
            this.props.onChange(destination, this.state.destinationData);
        }

        this.setState({
            sourceData: source,
            destinationData: destination
        });
    },
    render: function() {
        return (
            <div className="form-group row">
                <ListBox 
                    ref="source"
                    title={this.props.sourceTitle}
                    source={this.state.sourceData}
                    moveAllBtn={this.props.moveAllBtn}
                    onMove={this.moveRight}
                    textLength={this.props.textLength}
                    text={this.props.text}
                    value={this.props.value}
                    disable={this.props.disable}
                    height={this.props.height}
                    direction="right" />
                <ListBox
                    ref="destination"
                    title={this.props.destinationTitle}
                    source={this.state.destinationData}
                    moveAllBtn={this.props.moveAllBtn}
                    onMove={this.moveLeft}
                    textLength={this.props.textLength}
                    text={this.props.text}
                    value={this.props.value}
                    disable={this.props.disable}
                    height={this.props.height}
                    direction="left" />
            </div>
        );
    }
});

module.exports = DualListBox;