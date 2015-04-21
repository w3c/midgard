
var _ = require("underscore")
,   Backbone = require("backbone")
,   $ = require("jquery")
,   User = require("./user")
,   Layout = require("./layout")
,   LayoutView = require("./layout-view")
;

var Midgard = {
    user:       null
,   layout:     null
,   widgets:    {
        login:  require("../widgets/login")
    }
};
_.extend(Midgard, Backbone.Events);

// loading
$(function () {
    // load up user
    Midgard.user = new User();
    Midgard.user.fetch({
        success:    function () { Midgard.trigger("user-loaded"); }
    ,   error:      function () { Midgard.trigger("no-user"); }
    });
    // layout
    Midgard.layout = new Layout();
    Midgard.rootView = new LayoutView({
        model:  Midgard.layout
    ,   el:     document.querySelector("main")
    });
});

// there is no user, show default layout
Midgard.on("no-user", function () {
    Midgard.layout.defaultToLogin();
});

// layout
// on("user-loaded") -> get layout preferences and paint them
// on("login-failed") -> show login with error

module.exports = Midgard;
