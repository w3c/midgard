
import React from "react";

import FilterStore from "./stores/filter";
import ConfigurationStore from "./stores/configuration";

import FilterSelector from "./filter-selector.jsx";

export default class FilterList extends React.Component {
    constructor (props) {
        super(props);
        this.selectedID = null;
        this.state = {
            userFilters:    FilterStore.getFilters()
        ,   allFilters: ConfigurationStore.getFilters()
        };
    }
    componentDidMount () {
        FilterStore.addChangeListener(this._onChange.bind(this));
        ConfigurationStore.addChangeListener(this._onChange.bind(this));
    }
    componentWillUnmount () {
        FilterStore.removeChangeListener(this._onChange.bind(this));
        ConfigurationStore.removeChangeListener(this._onChange.bind(this));
    }
    _onChange () {
        this.setState({ userFilters: FilterStore.getFilters(), allFilters: ConfigurationStore.getFilters() });
    }
    _onSelect (id) {
        if (this.selectedID) this.refs("fs-" + this.selectedID).unselect();
        this.selectedID = id;
        this.refs("fs-" + id).select();
    }

    render () {
        let st = this.state;
        if (st.userFilters.length === 0) {
            return <p>
                    You have no configured event lists to follow; add some using the “Configure”
                    button above.
                    </p>
            ;
        }
        return <ul>
                {
                    Object.keys(st.userFilters)
                        .map((id) => {
                            return <FilterSelector key={id} id={id} selected={id === st.selectedID}
                                                    ref={"fs-" + id} {...st.allFilters[id]}
                                                    onClick={this._onSelect.bind(this)}/>;
                        })
                }
            </ul>
        ;
    }
}
