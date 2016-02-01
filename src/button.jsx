var React = require('react');
var PropTypes = React.PropTypes;

var ButtonComponent = React.createClass({
    displayName: 'ButtonComponent',
    propTypes: {
        classes: PropTypes.arrayOf(PropTypes.string).isRequired,
        click: PropTypes.func,
        width: PropTypes.number
    },
    getDefaultProps: function() {
        return {
            width: 12,
            click: function() {},
            classes: []
        }
    },
    getIcons: function() {
        var icons = this.props.classes.map((c, index) => {
            return (
                <i key={index} className={"glyphicon " + c}></i>
            );
        });
        
        return icons;
    },
    render: function() {
        return (
            <button className={"btn btn-default col-sm-" + this.props.width} style={{marginBottom: '5px'}}
                    type="button" onClick={this.props.click}>
                {this.getIcons()}
            </button>
        );
    }
});

module.exports = ButtonComponent;