var React = require('react');
var PropTypes = React.PropTypes;
var ButtonComponent = require('button.jsx');
var FilterBox = require('filterBox.jsx');

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
    getInitialState: function(){
        return {
            selected: [],
            filter: '',
            filteredData: [],
            onClickDisabled: true,
            onClickAllDisabled: true
        };
    },
    componentWillMount: function() {
        this.setState({
            filteredData: this.props.source,
            onClickAllDisabled: this.props.source.length === 0
        });
    },
    onClickAll: function(event) {
        this.props.onMove(this.state.filteredData);
        this.setState({
            selected: [],
            filteredData: [],
            onClickDisabled: true,
            onClickAllDisabled: true
        });
    },
    onClick: function(event) {
        this.props.onMove(this.state.selected);
        this.setState({
            selected: [],
            onClickDisabled: true
        });
    },
    handleFilterChange: function(event) {
        var filter = '';
        if (this.filterBox !== null) {
            filter = this.filterBox.refs.filter.input || event.target.value;
        } else {
            filter = event.target.value;
        }

        var result = this.filterData(filter);
        this.setState({
            filter: filter,
            filteredData: result,
            selected: [],
            onClickDisabled: true,
            onClickAllDisabled: result.length === 0
        });
    },
    handleSelectChange: function(event) {
        var selectedValues = [], disable = this.props.disable;
        var select = this.refs.select || event.target;
        for (var i = 0, l = select.options.length; i < l; i++) {
            if (select.options[i].selected) {
                var itemId = parseInt(select.options[i].value);
                var item = this.props.source.filter(v => v[this.props.value] === itemId);
                if (item.length > 0) {
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
    buttons: function() {
        var btnNodes = [];
        var btn = function(thisArg, classes, func, key) {
            return (
                <ButtonComponent
                    key={key}
                    click={thisArg[func]}
                    width={thisArg.props.moveAllBtn ? 6 : 12}
                    disable={thisArg.state[func + 'Disabled']} 
                    classes={classes}/>
            );
        }

        let chevron = `glyphicon-chevron-${this.props.direction.toLowerCase()}`;

        switch(this.props.direction.toLowerCase()) {
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
    filterData: function(filter) {
        if (filter === '' || filter === undefined) {
            return this.props.source;
        }

        var result = this.props.source.filter(function(v) { return v[this.props.text].toLowerCase().indexOf(filter.toLowerCase()) > -1; }, this);
        return result;
    },
    render: function () {
        var items = this.state.filteredData.map(
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
                <h4>{this.props.title}<small> - showing {this.state.filteredData.length}</small></h4>
                <FilterBox handleFilterChange={this.handleFilterChange} ref={(ref) => this.filterBox = ref} />
                {this.buttons()}
                <select
                    ref='select'
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