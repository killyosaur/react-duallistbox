var ButtonAllComponent = React.createClass({
    displayName: 'ButtonAllComponent',
    render: function() {
        var btnPosition
        return (
            <button class="btn btn-default col-md-6" style="margin-bottom: 5px;"
                    type="button" onClick={this.props.click}>
                <span class="glyphicon glyphicon-list"></span>
                <span class={"glyphicon glyphicon-chevron-" + this.props.direction.toLowerCase()}></span>
            </button>
        );
    }
});