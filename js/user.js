
var Backbone = require("backbone")
,   Midgard = require("./midgard")
,   endpoints = require("./endpoints")
,   $ = require("jquery")
;

// A model representing the current user (efffectively used as a singleton)
//
// Methods:
//  login(id, password): logs the user in
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
        id:     null
    ,   acl:    "public"
    }
,   sync:       function (method, model) {
        if (method === "read") {
            $.ajax(endpoints.user, {
                method: "GET"
            ,   xhrFields: {
                    withCredentials: true
                }
            ,   success:    function (data) {
                    if (data.found) {
                        model.set(data._source);
                        this.trigger("session-loaded");
                    }
                    else this.trigger("no-session");
                }
            ,   error:      function () {
                    this.trigger("no-session");
                }
            });
        }
    }
,   login:      function (id, password) {
        var user = this;
        $.ajax(endpoints.user, {
            data:   { id: id, password: password }
        ,   method: "POST"
        ,   xhrFields: {
                withCredentials: true
            }
        ,   success:    function (data) {
                if (data.found) {
                    user.set(data._source);
                    this.trigger("login");
                }
                else Midgard.trigger("login-fail");
            }
        ,   error:      function () {
                Midgard.trigger("login-fail");
            }
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
                Midgard.trigger("logout");
            }
        ,   error:      function () {
                Midgard.trigger("error", "Failed to logout for unknown reasons.");
            }
        });
    }
,   isLoggedIn: function () {
        return !!this.get("id");
    }
});
