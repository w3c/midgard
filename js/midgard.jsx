
import React from "react";

import { Router, Route } from "react-router";
import BrowserHistory from "react-router/lib/BrowserHistory";

import Application from "../components/application.jsx";
import Row from "../components/row.jsx";
import Col from "../components/col.jsx";
import Spinner from "../components/spinner.jsx";
import FlashList from "../components/flash-list.jsx";

import Login from "./login.jsx";
import Toolbar from "./toolbar.jsx";
import FilterList from "./filter-list.jsx";

import UserActions from "./actions/user";
import LoginStore from "./stores/login";

import MessageActions from "./actions/messages";
import MessageStore from "./stores/message";

import ConfigurationActions from "./actions/configuration";
import ConfigurationStore from "./stores/configuration";

let utils = require("./utils")
,   pp = utils.pathPrefix()
;

function getState () {
    var st = {
        loggedIn: LoginStore.isLoggedIn()
    ,   allFilters: ConfigurationStore.getFilters()
    };
    if (st.loggedIn === null || st.allFilters === null) st.status = "loading";
    else if (st.loggedIn) st.status = "ok";
    else st.status = "login-required";
    return st;
}

class W3CDashboard extends React.Component {
    constructor (props) {
        super(props);
        this.state = getState();
    }
    componentDidMount () {
        LoginStore.addChangeListener(this._onChange.bind(this));
        ConfigurationStore.addChangeListener(this._onChange.bind(this));
        UserActions.loadUser();
        ConfigurationActions.loadConfiguration();
    }
    componentWillUnmount () {
        LoginStore.removeChangeListener(this._onChange.bind(this));
        ConfigurationStore.removeChangeListener(this._onChange.bind(this));
    }
    _onChange () {
        this.setState(getState());
    }

    render () {
        let st = this.state
        ,   toolbar
        ,   body
        ;
        if (st.status === "loading") {
            body = <Spinner prefix={pp}/>;
        }
        else if (st.status === "login-required") {
            body = <Login/>;
        }
        else {
            // XXX
            //  nav has the configuration and the logout button
            //  body has a row, with a col for MailboxList and a col for ShowMailbox
            toolbar = <Toolbar/>;
            body = <Row>
                    <Col className="mbx-list"><FilterList/></Col>
                    <Col className="mbx-show"></Col>
                </Row>
            ;
        }
        return <Application title="W3C Dashboard">
                  {toolbar}
                  <FlashList store={MessageStore} actions={MessageActions}/>
                  {body}
                </Application>
        ;
    }
}

React.render(
    <Router history={new BrowserHistory}>
        <Route path={pp} component={W3CDashboard}></Route>
    </Router>
,   document.body
);
