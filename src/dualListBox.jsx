import React from 'react';
import PropTypes from 'prop-types';
import {ListBox} from './listBox';

const compare = (sortBy) => {
    return (a, b) => {
        if(typeof a[sortBy] === 'string' && 
            typeof b[sortBy] === 'string')
        {
            return a[sortBy].localeCompare(b[sortBy])
        }

        return a[sortBy] === b[sortBy] ? 0 : 
            a[sortBy] > b[sortBy] ? 1 : -1;
    };
};

const valueEquals = (v1, v2) => {
    if (Array.isArray(v1) && Array.isArray(v2)) {
        return arrayEquals(v1, v2);
    }

    if(typeof v1 === "object" && typeof v2 === "object") {
        return objEquals(v1, v2);
    }

    return v1 === v2;
};

const arrayEquals = (arr1, arr2) => {
    if(arr1.length !== arr2.length) {
        return false;
    }

    for(let i = 0; i < arr1.length; i++) {
        const v1 = arr1[i];
        const v2 = arr2[i];

        if(!valueEquals(v1, v2)) {
            return false;
        }
    }

    return true;
};

const objEquals = (obj1, obj2) => {
    var props1 = Object.keys(obj1);
    var props2 = Object.keys(obj2);

    if (!arrayEquals(props1, props2)) {
        return false;
    }

    for(let i = 0; i < props1.length; i++) {
        const v1 = obj1[props1[i]];
        const v2 = obj2[props2[i]];

        if(!valueEquals(v1, v2)) {
            return false;
        }
    }

    return true;
}

class DualListBox extends React.Component {
    static propTypes = {
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
    }

    static defaultProps = {
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

    state = {
        sourceData: [],
        destinationData: []
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        let destinationData = nextProps.destination.sort(compare(nextProps.sortBy));
        if(!arrayEquals(prevState.destinationData, destinationData)) {
            return { destinationData };
        }

        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        let sourceData = this.removeData(prevProps.source, prevProps.destination).sort(compare(this.props.sortBy));

        if(!arrayEquals(prevState.sourceData, sourceData)) {
            this.setState({
                sourceData: sourceData
            });
        }
    }

    removeData = (destinationData, dataToRemove) => {
        var dataToReturn = [];
        for (var x = 0; x < destinationData.length; x++) {
            var index = this.getIndex(dataToRemove, destinationData[x]);
            if (index === -1) {
                dataToReturn.push(destinationData[x]);
            }
        }

        return dataToReturn;
    }

    getIndex = (data, item) => {
        var ind = 0, length = data.length;
        if (!data || data.length === 0) return -1;

        for (; ind < length; ind++) {
            if (data[ind][this.props.value] === item[this.props.value]) {
                return ind;
            }
        }

        return -1;
    }
    
    moveLeft = (itemsToMove) => {
        var source = this.state.sourceData.concat(itemsToMove).sort(compare(this.props.sortBy));
        var destination = this.removeData(this.state.destinationData, itemsToMove);
        this.setState({
            sourceData: source,
            destinationData: destination
        });

        if(this.props.onChange) {
            this.props.onChange(destination);
        }
    }

    moveRight = (itemsToMove) => {
        var source = this.removeData(this.state.sourceData, itemsToMove);
        var destination = this.state.destinationData.concat(itemsToMove).sort(compare(this.props.sortBy));
        this.setState({
            sourceData: source,
            destinationData: destination
        });

        if(this.props.onChange) {
            this.props.onChange(destination);
        }
    }

    render() {
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
}

export {DualListBox};