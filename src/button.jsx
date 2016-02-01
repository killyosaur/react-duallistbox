var React = require('react');
var PropTypes = React.PropTypes;

var ButtonComponent = React.createClass({
    displayName: 'ButtonComponent',
    propTypes: {
        direction: PropTypes.string.isRequired,
        click: PropTypes.func,
        moveAll: PropTypes.bool
    },
    getClasses: function() {
        return this.props.moveAll ? 'col-md-6' : 'col-md-12';
    },
    render: function() {
        var btnPosition = this.getClasses();
        return (
            <button className={"btn btn-default " + btnPosition} style={{marginBottom: '5px'}}
                    type="button" onClick={this.props.click}>
                <span className={"glyphicon glyphicon-chevron-" + this.props.direction.toLowerCase()}></span>
            </button>
        );
    }
});

module.exports = ButtonComponent;