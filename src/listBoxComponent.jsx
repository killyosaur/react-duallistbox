var React = require('react');
var ReactDOM = require('react-dom');

var ListBox = React.createClass({
    displayName: 'ListBox',
    onClickAll: function() {
        
    },
    onClick: function() {
        
    },
    buttons: function(){
        var btnNodes = [];
        switch(this.props.direction.toLowerCase()) {
            case 'right':
                if (this.props.moveAll) {
                    btnNodes.push(
                        <ButtonAllComponent
                            click={this.onClickAll}
                            direction={this.props.direction} />
                    );
                }
                btnNodes.push(
                    <ButtonComponent
                        moveAll={this.props.moveAll}
                        click={this.onClick}
                        direction={this.props.direction} />
                );
                break;
            case 'left':
                btnNodes.push(
                    <ButtonComponent
                        moveAll={this.props.moveAll}
                        click={this.onClick}
                        direction={this.props.direction} />
                );
                if (this.props.moveAll) {
                    btnNodes.push(
                        <ButtonAllComponent
                            click={this.onClickAll}
                            direction={this.props.direction} />
                    );
                }
                break;
        }

        return btnNodes;
    },
    render: function () {
        return (
            <div className="col-md-6">
                <h4>{this.props.title}<small> - showing </small></h4>
                <input style="margin-bottom: 5px;" className="filter form-control"
                       type="text" placeholder="Filter" />
                {this.buttons()}
                <select 
                    style={width: '100%', height: this.props.height}
                    
            </div>
        );
    }
})