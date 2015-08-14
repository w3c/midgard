
import React from "react";

import Spinner from "../components/spinner.jsx";

import FilterToggle from "./filter-toggle.jsx";
import Logout from "./logout-button.jsx";

import FilterStore from "./stores/filter";
import ConfigurationStore from "./stores/configuration";

export default class Toolbar extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            showing:        false
        ,   userFilters:    FilterStore.getFilters()
        ,   allFilters:     ConfigurationStore.getFilters()
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
    _toggleFilters () {
        this.setState({ showing: !this.state.showing });
    }

    render () {
        let st = this.state
        ,   prefs
        ;
        if (st.showing) {
            if (st.loading) {
                prefs = <div className="prefs"><Spinner/></div>;
            }
            else {
                prefs = <div className="prefs">
                        <h2>Pick the filters you wish to subscribe to</h2>
                        {
                            Object.keys(st.allFilters)
                                .map((id) => {
                                    return <FilterToggle key={id} id={id} selected={!!st.userFilters[id]} {...st.allFilters[id]}/>;
                                })
                        }
                    </div>
                ;
            }
        }
        return <div className="toolbar">
                <button onClick={this._toggleFilters.bind(this)}>Configure</button>
                <Logout/>
                {prefs}
            </div>
        ;
    }
}
