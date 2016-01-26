var ButtonAllComponent = React.createClass({
    displayName: 'ButtonAllComponent',
    render: function() {
        var btnPosition
        return (
            <button className="btn btn-default col-md-6" style="margin-bottom: 5px;"
                    type="button" onClick={this.props.click}>
                <span className="glyphicon glyphicon-list"></span>
                <span className={"glyphicon glyphicon-chevron-" + this.props.direction.toLowerCase()}></span>
            </button>
        );
    }
});