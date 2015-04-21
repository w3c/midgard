
var Backbone = require("backbone")
,   Midgard = require("./midgard")
,   endpoints = require("./endpoints")
,   $ = require("jquery")
;

module.exports = Backbone.Model.extend({
    defaults:   {
        id:     null
    ,   acl:    "public"
    }
,   sync:       function (method, model, options) {
        if (method === "read") {
            $.ajax(endpoints.user, {
                method: "GET"
            ,   xhrFields: {
                    withCredentials: true
                }
            ,   success:    function (data) {
                    if (data.found) {
                        model.set(data._source);
                        options.success();
                    }
                    else options.error(data.error);
                }
            ,   error:      function (err) {
                    options.error(err);
                }
            });
        }
        else if (method === "update") {
            // XXX save
        }
    }
,   login:      function (id, password) {
        console.log("Logging in " + id);
        var user = this;
        $.ajax(endpoints.user, {
            data:   { id: id, password: password }
        ,   method: "POST"
        ,   xhrFields: {
                withCredentials: true
            }
        ,   success:    function (data) {
                console.log("success", data);
                if (data.found) {
                    user.set(data._source);
                    Midgard.trigger("user-loaded");
                }
                else Midgard.trigger("login-fail");
            }
        ,   error:      function () {
                console.log("error");
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
,   isLogged:   function () {
        return this.get("id") != null;
    }
});
