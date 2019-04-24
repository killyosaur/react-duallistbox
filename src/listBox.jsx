import React from 'react';
import PropTypes from 'prop-types';
import {ButtonComponent} from './button';
import {FilterBox} from './filterBox';

class ListBox extends React.Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        source: PropTypes.arrayOf(PropTypes.object).isRequired,
        moveAllBtn: PropTypes.bool.isRequired,
        onMove: PropTypes.func.isRequired,
        textLength: PropTypes.number,
        text: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        direction: PropTypes.string.isRequired
    }

    static defaultProps = {
        selected: [],
        filter: '',
        filteredData: [],
        onClickDisabled: true,
        onClickAllDisabled: true
    }

    state = {
        filteredData: this.props.source || [],
        onClickAllDisabled: this.props.disable || this.props.source.length === 0 || false,
        selected: [],
        onClickDisabled: false
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.source !== nextProps.source) {
            return {
                filteredData: prevState.filteredData,
                onClickAllDisabled: prevState.onClickAllDisabled,
                selected: [],
                onClickDisabled: true
            };
        }

        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.source !== this.state.source) {
            let filteredData = this.filterData(this.state.filter, nextProps.source);
            let onClickAllDisabled = this.props.disable || filteredData.length === 0;

            this.setState({filteredData, onClickAllDisabled})
        }
    }

    buttons = () => {
        let btnNodes = [];
        let btn = function(thisArg, classes, func, key) {
            return (
                <ButtonComponent
                    key={key}
                    click={thisArg[func]}
                    width={thisArg.props.moveAllBtn ? 6 : 12}
                    disable={thisArg.state[func + 'Disabled']} 
                    classes={classes}/>
            );
        }

        let chevron = `glyphicon-chevron-${this.props.direction.toLowerCase()}`;

        switch(this.props.direction.toLowerCase()) {
            case 'right':
                if (this.props.moveAllBtn === true) {
                    btnNodes.push(btn(this, ['glyphicon-list', chevron], 'onClickAll', 1));
                }
                btnNodes.push(btn(this, [chevron], 'onClick', 2));
                break;
            case 'left':
                btnNodes.push(btn(this, [chevron], 'onClick', 3));
                if (this.props.moveAllBtn === true) {
                    btnNodes.push(btn(this, [chevron, 'glyphicon-list'], 'onClickAll', 4));
                }
                break;
        }

        return btnNodes;
    }

    onClickAll = () => {
        this.deselectItems();
        this.props.onMove(this.state.filteredData);
    }

    onClick = () => {
        this.deselectItems();
        this.props.onMove(this.state.selected);
    }

    deselectItems = () => {
        for(var i = 0; i < this.state.selected.length; i++) {
            this.refs.select.options[this.state.selected[i].optionId].selected = false;
        }
    }

    handleFilterChange = (event) => {
        let filter = '';
        if (this.filterBox !== null) {
            filter = this.filterBox.refs.filter.input || event.target.value;
        } else {
            filter = event.target.value;
        }

        this.deselectItems();
        let result = this.filterData(filter);

        this.setState({
            filter: filter,
            filteredData: result,
            selected: [],
            onClickDisabled: true,
            onClickAllDisabled: this.props.disable || result.length === 0
        });
    }

    handleSelectChange = (event) => {
        let selectedValues = [], disable = this.props.disable;
        let select = this.refs.select || event.target;

        for (let i = 0, l = select.options.length; i < l; i++) {
            if (select.options[i].selected) {
                const itemValue = select.options[i].value;

                const item = this.props.source.filter(v => v[this.props.value] == itemValue);
                if (item.length > 0) {
                    item[0].optionId = i;
                    selectedValues.push(item[0]);
                }
            }
        }

        if (!disable && selectedValues.length === 0) {
            disable = true;
        }

        this.setState({
            selected: selectedValues,
            onClickDisabled: disable
        });
    }

    filterData = (filter, source) => {
        let finalSource = source || this.props.source;
        if (filter === '' || filter === undefined) {
            return finalSource;
        }

        let result = finalSource.filter(v => 
            v[this.props.text].toLowerCase().indexOf(filter.toLowerCase()) > -1);
        return result;
    }

    render() {
        let items = this.state.filteredData.map(
            (item, index) => {
                const text = item[this.props.text];
                return (
                    <option key={index} value={item[this.props.value]}>
                        {
                             this.props.textLength > 0 && text.length > this.props.textLength ?
                                text.substring(0, this.props.textLength - 3) + '...' :
                                text
                        }
                    </option>
                );
            }, this);

        return (
            <div className="col-sm-6">
                <h4>{this.props.title}<small> - showing {this.state.filteredData.length}</small></h4>
                <FilterBox handleFilterChange={this.handleFilterChange} ref={(ref) => this.filterBox = ref} />
                {this.buttons()}
                <select
                    ref='select'
                    style={{width: '100%', height: (this.props.height || '200px')}}
                    multiple="multiple"
                    onChange={this.handleSelectChange}>
                    {items}
                </select>
            </div>
        );
    }
}

export {ListBox};