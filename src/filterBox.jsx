import React from 'react';
import PropTypes from 'prop-types';

class FilterBox extends React.Component {
    static propTypes = {
        handleFilterChange: PropTypes.func.isRequired
    };
    
    render() {
        return (
            <input style={{marginBottom: '5px'}} className="filter form-control" ref='filter'
                type="text" placeholder="Filter" onChange={this.props.handleFilterChange} />
        );
    }
}

export {FilterBox};