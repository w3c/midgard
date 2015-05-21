
var Backbone = require("backbone")
,   endpoints = require("./endpoints")
,   $ = require("jquery")
;

// A model representing the current user (efffectively used as a singleton)
//
// Methods:
//  login(username, password): logs the user in
//  logout(): logs the user out
//  sync(): tries to log the user in based on a revived session on reading (#fetch())
//
// Events:
//  session-loaded: there exists a session on the server and the user is loaded without login
//  no-session: failure to load the session
//  login: the user was logged in successfully
//  logout: the user was logged out successfully
//  login-fail: attempted login, didn't work

module.exports = Backbone.Model.extend({
    defaults:   {
        username:   null
    ,   acl:        "public"
    }
,   sync:       function (method, model) {
        if (method === "read") {
            $.ajax(endpoints.user, {
                method: "GET"
            ,   xhrFields: {
                    withCredentials: true
                }
            ,   success:    function (data) {
                    console.log("sync", data);
                    if (data.type === "user") {
                        model.set(data.payload);
                        return this.trigger("session-loaded");
                    }
                    else this.trigger("no-session");
                }.bind(this)
            ,   error:      function () {
                    console.error("error getting user");
                    this.trigger("no-session");
                }.bind(this)
            });
        }
    }
,   login:      function (username, password) {
        var user = this;
        $.ajax(endpoints.user, {
            data:           JSON.stringify({ username: username, password: password })
        ,   contentType:    "application/json"
        ,   processData:    false
        ,   method:         "POST"
        ,   xhrFields: {
                withCredentials: true
            }
        ,   success:    function (data) {
                console.log("login", data);
                if (data.type === "user") {
                    user.set(data.payload);
                    this.trigger("login");
                }
                else this.trigger("login-fail");
            }.bind(this)
        ,   error:      function () {
                console.error("login fail");
                this.trigger("login-fail");
            }.bind(this)
        });
    }
,   logout:     function () {
        var user = this;
        $.ajax(endpoints.user, {
            method: "DELETE"
        ,   xhrFields: {
                withCredentials: true
            }
        ,   success:    function () {
                user.clear();
                this.trigger("logout");
            }.bind(this)
        ,   error:      function () {
                this.trigger("error", "Failed to logout for unknown reasons.");
            }.bind(this)
        });
    }
,   isLoggedIn: function () {
        return !!this.get("username");
    }
});
