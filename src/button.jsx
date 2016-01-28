var ButtonComponent = React.createClass({
    displayName: 'ButtonComponent',
    getClasses: function() {
        return this.props.moveAll ? 'col-md-6' : 'col-md-12';
    },
    render: function() {
        var btnPosition = this.getClasses();
        return (
            <button className={"btn btn-default " + btnPosition} style="margin-bottom: 5px;"
                    type="button" onClick={this.props.click}>
                <span className={"glyphicon glyphicon-chevron-" + this.props.direction.toLowerCase()}></span>
            </button>
        );
    }
});

module.export = ButtonComponent;