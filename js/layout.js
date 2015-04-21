
var Backbone = require("backbone")
,   Midgard = require("./midgard")
;

Midgard.Layout = Backbone.Model.extend({
    defaults:   {
        left:   null
    ,   centre: null
    ,   right:  null
    }
,   sync:       function (method/*, model, options*/) {
        if (method === "read") {
            // get it from the user right there, using default if there isn't one
        }
        else if (method === "update") {
            // XXX save to user
        }
    }
,   defaultToLogin: function () {
        this.set({
            left:   null
        ,   centre: [{
                id:     "login"
            ,   data:   {}
            }]
        ,   right:  null
        });
    }
});
