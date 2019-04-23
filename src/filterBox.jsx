import React from 'react';
import PropTypes from 'prop-types';

const FilterBox = React.createClass({
   displayName: 'FilterBox',
    propTypes: {
        handleFilterChange: PropTypes.func.isRequired
    },
    render: function() {
        return (
            <input style={{marginBottom: '5px'}} className="filter form-control" ref='filter'
                   type="text" placeholder="Filter" onChange={this.props.handleFilterChange} />
        );
    }
});

export {FilterBox};