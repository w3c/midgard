
import React from "react";

import Spinner from "../components/spinner.jsx";

import Logout from "./logout-button.jsx";

// import UserActions from "./actions/user";
// import LoginStore from "./stores/login";
// import MessageActions from "./actions/messages";


//  /!\  magically create a global fetch
require("isomorphic-fetch");

let utils = require("./utils")
,   apiFilters = utils.endpoint("api/events")
;


export default class Toolbar extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            loading:    false
        ,   showing:    false
        ,   filters:    null
        };
    }
    _showFilters () {
        if (this.state.showing) {
            return this.setState({ showing: false, loading: false });
        }
        this.setState({ showing: true, loading: true });
        fetch(apiFilters, { credentials: "include", mode: "cors" })
            .then(utils.jsonHandler)
            .then((data) => {
                this.setState({
                    loading:    false
                ,   filters:    data
                });
            })
            .catch(utils.catchHandler);
    }

    render () {
        let st = this.state
        // ,   spinner = st.loading ? <Spinner size="small"/> : null
        ,   prefs
        ;
        if (st.showing) {
            if (st.loading) {
                prefs = <div className="prefs"><Spinner/></div>;
            }
            else {
                // XXX
                // iterate on filters
                // those that are in the user are selected, the others not
                // toggling a filter has an *immediate* effect
                //  saves the user
                //  updates the login store
                prefs = <div className="prefs">
                        ... list the filters here
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
