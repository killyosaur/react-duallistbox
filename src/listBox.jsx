var React = require('react');
var PropTypes = React.PropTypes;
var ButtonComponent = require('./button.jsx');
var ButtonAllComponent = require('./buttonAll.jsx');

var ListBox = React.createClass({
    displayName: 'ListBox',
    propTypes: {
        title: PropTypes.string.isRequired,
        source: PropTypes.arrayOf(PropTypes.object).isRequired,
        moveAllBtn: PropTypes.bool.isRequired,
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
                <ButtonComponent
                    key={'s-' + thisArg.props.direction}
                    moveAllBtn={thisArg.props.moveAllBtn}
                    click={thisArg.onClick}
                    direction={thisArg.props.direction}
                    disable={thisArg.disabled(thisArg.state.selected.length)} />
            );
        }

        var btnAll = function(thisArg) {
            return (
                <ButtonAllComponent
                    key={'a-' + thisArg.props.direction}
                    click={thisArg.onClickAll}
                    direction={thisArg.props.direction}
                    disable={thisArg.disabled(thisArg.state.filteredData.length)} />
            );
        }

        switch(this.props.direction.toLowerCase()) {
            case 'right':
                if (this.props.moveAllBtn === true) {
                    btnNodes.push(btnAll(this));
                }
                btnNodes.push(btn(this));
                break;
            case 'left':
                btnNodes.push(btn(this));
                if (this.props.moveAllBtn === true) {
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
                    <option key={item[this.props.value]} value={item[this.props.value]}>
                        {
                             this.props.textLength > 0 && text.length > this.props.textLength ?
                                text.substring(0, this.props.textLength - 3) + '...' :
                                text
                        }
                    </option>
                );
            }, this);

        return (
            <div className="col-sm-6">
                <h4>{this.props.title}<small> - showing {sourceData.length}</small></h4>
                <input style={{marginBottom: '5px'}} className="filter form-control"
                       type="text" placeholder="Filter" onChange={this.handleFilterChange} />
                {this.buttons()}
                <select
                    style={{width: '100%', height: (this.props.height || '200px')}}
                    multiple="multiple"
                    onChange={this.handleSelectChange}>
                    {items}
                </select>
            </div>
        );
    }
});

module.exports = ListBox;