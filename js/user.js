/* globals Backbone, Midgard */

Midgard.User = Backbone.Model.extend({
    defaults:   {
        username:   null
    ,   acl:        "public"
    }
,   sync:       function (method, model, options) {
        if (method === "read") {
            $.getJSON("/api/user", function (data) {
                if (data.ok) {
                    model.set(data._source);
                    options.success();
                }
                else options.error(data.error);
            });
        }
        else if (method === "update") {
            // XXX save
        }
        else if (method === "delete") {
            // XXX logout
        }
    }
,   isLogged:   function () {
        return this.get("username") != null;
    }
});
