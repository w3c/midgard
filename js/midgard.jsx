
import React from "react";

import { Router, Route, Link } from "react-router";
import BrowserHistory from "react-router/lib/BrowserHistory";

import Application from "../components/application.jsx";
import Row from "../components/row.jsx";
import Col from "../components/col.jsx";
import Spinner from "../components/spinner.jsx";
import FlashList from "../components/flash-list.jsx";

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
        if (!this.state.loggedIn) UserActions.login();
    }
    componentWillUnmount () {
        LoginStore.removeChangeListener(this._onChange.bind(this));
    }
    _onChange () {
        this.setState(getState());
    }

    render () {
        let st = this.state
        ,   nav
        ,   body
        ;
        // when logged in show an actual menu and content
        if (st.loggedIn === true) {
            // nav = <Col className="nav">
            //         <NavBox title="Repositories">
            //             <NavItem><Link to={`${pp}repos`}>List Repositories</Link></NavItem>
            //             <NavItem><Link to={`${pp}repo/new`}>New Repository</Link></NavItem>
            //             <NavItem><Link to={`${pp}repo/import`}>Import Repository</Link></NavItem>
            //         </NavBox>
            //         <NavBox title="Pull Requests">
            //             <NavItem><Link to={`${pp}pr/open`}>Currently Open</Link></NavItem>
            //             <NavItem><Link to={`${pp}pr/last-week`}>Active Last Week</Link></NavItem>
            //         </NavBox>
            //         {admin}
            //         <NavBox title="User">
            //             <NavItem><LogoutButton/></NavItem>
            //         </NavBox>
            //     </Col>;
            // body = <Col>{ this.props.children || <Welcome/> }</Col>;
        }
        // when logged out off to log in
        else if (st.loggedIn === false) {
            // nav = <Col className="nav"><NavBox title="Login"/></Col>;
            // body = <Col><LoginWelcome/></Col>;
        }
        // while we don't know if we're logged in or out, spinner
        else {
            body = <Spinner prefix={pp}/>;
        }
        return <Application title="W3C Dashboard">
                  <FlashList store={MessageStore} actions={MessageActions}/>
                  {nav}
                  {body}
                </Application>
        ;
    }
}

React.render(
    <Router history={new BrowserHistory}>
        <Route path={pp} component={W3CDashboard}>
        </Route>
    </Router>
,   document.body
);

// <Route path="repo/:mode" component={RepoManager}/>
// <Route path="repos" component={RepoList}/>
// <Route path="pr/id/:owner/:shortName/:num" component={PRViewer}/>
// <Route path="pr/open" component={PROpen}/>
// <Route path="pr/last-week" component={PRLastWeek}/>
// <Route path="admin/add-user" component={PickUser}/>
// <Route path="admin/users" component={AdminUsers}/>
// <Route path="admin/user/:username" component={EditUser}/>
// <Route path="admin/user/:username/add" component={AddUser}/>
// <Route path="admin/groups" component={AdminGroups}/>
