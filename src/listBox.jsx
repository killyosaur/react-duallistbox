var React = require('react');
var PropTypes = React.PropTypes;
var ButtonComponent = require('button');
var ButtonAllComponent = require('buttonAll');

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
        let selectedValues = [];
        for (let i = 0; l = event.target.options.length; i < l; i++){
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
                <ButtonComponent
                    moveAll={this.props.moveAll}
                    click={this.onClick}
                    directiosn={this.props.direction}
                    disable={this.disabled(this.state.selected.length)} />
            );
        }

        var btnAll = function() {
            return (
                <ButtonAllComponent
                    click={this.onClickAll}
                    direction={this.props.direction}
                    disable={this.disable(this.state.moveAllItems.length)} />
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
                    <option value={item[this.props.value]}>
                        {
                             this.props.textLength > 0 && text.length > this.props.textLength ?
                                text.substring(0, this.props.textLength - 3) + '...' :
                                text
                        }
                    </option>
                );
            }
        );

        return (
            <div className="col-md-6">
                <h4>{this.props.title}<small> - showing </small></h4>
                <input style="margin-bottom: 5px;" className="filter form-control"
                       type="text" placeholder="Filter" onChange={this.handleFilterChange} />
                {this.buttons()}
                <select
                    style={width: '100%', height: this.props.height || '200px'}
                    multiple="multiple"
                    onChange={this.handleSelectChange}>
                    {items}
                </select>
            </div>
        );
    }
})