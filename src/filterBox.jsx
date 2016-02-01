import React, {PropTypes, Component} from 'react';

class FilterBox extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <input style={{marginBottom: '5px'}} className="filter form-control"
                    type="text" placeholder="Filter" onChange={this.props.handleFilterChange} />
        );
    }
};

FilterBox.propTypes = {
    handleFilterChange: PropTypes.func.isRequired
};

export default FilterBox;