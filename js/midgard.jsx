
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

import UserActions from "./actions/user";
import LoginStore from "./stores/login";

import MessageActions from "./actions/messages";
import MessageStore from "./stores/message";

let utils = require("./utils")
,   pp = utils.pathPrefix()
;

function getState () {
    return { loggedIn: LoginStore.isLoggedIn() };
}

class W3CDashboard extends React.Component {
    constructor (props) {
        super(props);
        this.state = getState();
    }
    componentDidMount () {
        LoginStore.addChangeListener(this._onChange.bind(this));
        UserActions.loadUser();
    }
    componentWillUnmount () {
        LoginStore.removeChangeListener(this._onChange.bind(this));
    }
    _onChange () {
        this.setState(getState());
    }

    render () {
        let st = this.state
        ,   toolbar
        ,   body
        ;
        // when logged in show an actual menu and content
        if (st.loggedIn === true) {
            // XXX
            //  nav has the configuration and the logout button
            //  body has a row, with a col for MailboxList and a col for ShowMailbox
            toolbar = <Toolbar/>;
            body = <Row>
                    <Col className="mbx-list"></Col>
                    <Col className="mbx-show"></Col>
                </Row>
            ;
        }
        // when logged out off to log in
        else if (st.loggedIn === false) {
            body = <Login/>;
        }
        // while we don't know if we're logged in or out, spinner
        else {
            body = <Spinner prefix={pp}/>;
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
