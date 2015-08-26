
import React from "react";

import Spinner from "../components/spinner.jsx";

import UserActions from "./actions/user";
import LoginStore from "./stores/login";
import MessageActions from "./actions/messages";

let utils = require("./utils");

export default class Login extends React.Component {
    constructor (props) {
        super(props);
        this.state = { loading: false };
    }
    _onLogin (ev) {
        ev.preventDefault();
        this.setState({ loading: true });
        UserActions.login(utils.val(this.refs.username), utils.val(this.refs.password));
    }
    componentDidMount () {
        LoginStore.addChangeListener(this._onChange.bind(this));
    }
    componentWillUnmount () {
        LoginStore.removeChangeListener(this._onChange.bind(this));
    }
    _onChange () {
        if (LoginStore.lastLoginFailed()) {
            MessageActions.error("Login failed.", { mode: "dom" });
            this.setState({ loading: false });
        }
    }

    render () {
        let st = this.state
        ,   spinner = st.loading ? <Spinner size="small"/> : null
        ;
        return <div className="login-box">
                <p>
                  Log into the dashboard using your regular W3C credentials.
                </p>
                <form onSubmit={this._onLogin.bind(this)} ref="login" disabled={st.loading}>
                    <div className="formline">
                        <label htmlFor="login-sername">Username:</label>
                        <input type="text" id="login-username" autocapitalize="none" autocorrect="off" ref="username"/>
                    </div>
                    <div className="formline">
                        <label htmlFor="login-password">Password:</label>
                        <input type="password" id="login-password" ref="password"/>
                    </div>
                    <div className="formline action">
                        <button>Login</button>
                        { spinner }
                    </div>
                </form>
            </div>
        ;
    }
}
