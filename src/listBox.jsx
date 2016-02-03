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
    componentWillMount: function() {
        this.setState({
            filteredData: this.props.source
        });
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
        var btn = function(thisArg, classes, func, key) {
            return (
                <ButtonComponent
                    key={key}
                    click={thisArg[func]}
                    width={thisArg.props.moveAllBtn ? 6 : 12}
                    disable={thisArg.disabled(thisArg.state.selected.length)} 
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
    filteredData: function(filter) {
        if (filter === '' || filter === undefined) {
            return this.props.source;
        }

        var result = this.props.source.filter(function(v) { return v[this.props.text].indexOf(filter) > -1; }, this);
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
                <FilterBox handleFilterChange={this.handleFilterChange} />
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