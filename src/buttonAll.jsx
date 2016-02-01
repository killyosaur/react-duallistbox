var React = require('react');
var PropTypes = React.PropTypes;

var ButtonAllComponent = React.createClass({
    displayName: 'ButtonAllComponent',
    propTypes: {
        direction: PropTypes.string.isRequired,
        click: PropTypes.func
    },
    render: function() {
        var icons = [];
        var direction = this.props.direction.toLowerCase();
        function list() {
            return (<span key='1' className="glyphicon glyphicon-list"></span>);
        }
        
        function chevron(dir) {
            return (<span key='0' className={"glyphicon glyphicon-chevron-" + dir}></span>);
        }

        switch(direction) {
            case 'right':
                icons.push(list());
                icons.push(chevron(direction));
                break;
            case 'left':
                icons.push(chevron(direction));
                icons.push(list());
                break;
        }

        return (
            <button className="btn btn-default col-sm-6" style={{marginBottom: '5px'}}
                    type="button" onClick={this.props.click}>
                    {icons}
            </button>
        );
    }
});

module.exports = ButtonAllComponent;