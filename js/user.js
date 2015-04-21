
var Backbone = require("backbone")
,   Midgard = require("./midgard")
,   endpoints = require("./endpoints")
,   $ = require("jquery")
;
Backbone.$ = $;

module.exports = Backbone.Model.extend({
    defaults:   {
        id:     null
    ,   acl:    "public"
    }
,   sync:       function (method, model, options) {
        if (method === "read") {
            $.getJSON(endpoints.user, function (data) {
                if (data.found) {
                    model.set(data._source);
                    options.success();
                }
                else options.error(data.error);
            });
        }
        else if (method === "update") {
            // XXX save
        }
    }
,   login:      function (id, password) {
        var user = this;
        $.ajax(endpoints.user, {
            data:   { id: id, password: password }
        ,   method: "POST"
        ,   success:    function (data) {
                if (data.found) {
                    user.set(data._source);
                    Midgard.trigger("user-loaded");
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
