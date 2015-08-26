
import DashboardDispatch from "../dispatcher";
import EventEmitter from "events";
import assign from "object-assign";

//  /!\  magically create a global fetch
require("isomorphic-fetch");

let utils = require("../utils")
,   _user = null
,   _loggedIn = null
,   _lastLoginFailed = false
,   apiUser = utils.endpoint("api/user")
,   LoginStore = module.exports = assign({}, EventEmitter.prototype, {
        emitChange: function () { this.emit("change"); }
    ,   addChangeListener: function (cb) { this.on("change", cb); }
    ,   removeChangeListener: function (cb) { this.removeListener("change", cb); }

    ,   getUser: function () {
            return _user;
        }
    ,   isLoggedIn: function () {
            return _loggedIn;
        }
    ,   lastLoginFailed: function () {
            return _lastLoginFailed;
        }
    })
;

LoginStore.dispatchToken = DashboardDispatch.register((action) => {
    switch (action.type) {
        case "login":
            fetch(  apiUser
                , {
                    credentials:    "include"
                ,   mode:           "cors"
                ,   method:         "post"
                ,   headers:        { "Content-Type": "application/json" }
                ,   body:   JSON.stringify({
                                username:   action.username
                            ,   password:   action.password
                            })
                })
                .then(utils.jsonHandler)
                .then((data) => {
                    if (data.username) {
                        _loggedIn = true;
                        _user = data;
                        _lastLoginFailed = false;
                    }
                    else {
                        _loggedIn = false;
                        _user = null;
                        _lastLoginFailed = true;
                    }
                    LoginStore.emitChange();
                })
                .catch(utils.catchHandler);
            break;
        case "load-user":
            fetch(apiUser, { credentials: "include", mode: "cors" })
                .then(utils.jsonHandler)
                .then((data) => {
                    if (data.username) {
                        _loggedIn = true;
                        _user = data;
                    }
                    else {
                        _loggedIn = false;
                        _user = null;
                    }
                    LoginStore.emitChange();
                })
                .catch(utils.catchHandler);
            break;
        case "logout":
            fetch(  apiUser
                , {
                    credentials:    "include"
                ,   mode:           "cors"
                ,   method:         "delete"
                })
                .then(utils.jsonHandler)
                .then(() => {
                    _loggedIn = false;
                    _user = null;
                    _lastLoginFailed = false;
                    LoginStore.emitChange();
                })
                .catch(utils.catchHandler);
            break;
    }
});
