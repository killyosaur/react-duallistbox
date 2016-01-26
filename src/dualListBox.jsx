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
    moveLeft: function() {
        
    },
    moveAllLeft: function() {
        
    },
    moveRight: function() {
        
    },
    moveAllRight: function() {
        
    },
    itemsMoved: function() {
        
    },
    render: function(
        return (
            <div className="form-group row">
                <ListBox 
                    title={this.state.options.sourceTitle}
                    source={this.state.sourceData}
                    moveAll={this.state.options.moveAllBtn}
                    onMove={this.moveRight}
                    onMoveAll={this.moveAllRight}
                    textLength={this.state.options.textLength}
                    onChange={this.itemsMoved}
                    text={this.state.options.text}
                    value={this.state.options.value}
                    direction="right" />
                <ListBox
                    title={this.state.options.destinationTitle}
                    source={this.state.destinationData}
                    moveAll={this.state.options.moveAllBtn}
                    onMove={this.moveLeft}
                    onMoveAll={this.moveAllLeft}
                    textLength={this.state.options.textLength}
                    onChange={this.itemsMoved}
                    text={this.state.options.text}
                    value={this.state.options.value}
                    direction="left" />
            </div>
        );
    )
});