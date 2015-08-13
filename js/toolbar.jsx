
import React from "react";

import Spinner from "../components/spinner.jsx";

import FilterToggle from "./filter-toggle.jsx";
import Logout from "./logout-button.jsx";

import FilterStore from "./stores/filter";

//  /!\  magically create a global fetch
require("isomorphic-fetch");

let utils = require("./utils")
,   apiFilters = utils.endpoint("api/events")
;

export default class Toolbar extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            loading:        false
        ,   showing:        false
        ,   userFilters:    FilterStore.getFilters()
        ,   allFilters:     null
        };
    }
    componentDidMount () {
        FilterStore.addChangeListener(this._onChange.bind(this));
    }
    componentWillUnmount () {
        FilterStore.removeChangeListener(this._onChange.bind(this));
    }
    _onChange () {
        this.setState({ userFilters: FilterStore.getFilters() });
    }
    _showFilters () {
        if (this.state.showing) return this.setState({ showing: false, loading: false });
        this.setState({ showing: true, loading: true });
        fetch(apiFilters, { credentials: "include", mode: "cors" })
            .then(utils.jsonHandler)
            .then((data) => {
                this.setState({
                    loading:    false
                ,   allFilters: data
                });
            })
            .catch(utils.catchHandler);
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
                <button onClick={this._showFilters.bind(this)}>Configure</button>
                <Logout/>
                {prefs}
            </div>
        ;
    }
}
