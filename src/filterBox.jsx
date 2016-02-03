var React = require('react');
var PropTypes = React.PropTypes;

var FilterBox = React.createClass({
   displayName: 'FilterBox',
    propTypes: {
        handleFilterChange: PropTypes.func.isRequired
    },
    render: function() {
        return (
            <input style={{marginBottom: '5px'}} className="filter form-control"
                   type="text" placeholder="Filter" onChange={this.props.handleFilterChange} />
        );
    }
});

module.exports = FilterBox;