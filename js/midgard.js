/* globals _, Backbone */

var Midgard = {
    user:       null
,   layout:     null
,   widgets:    {}
};
_.extend(Midgard, Backbone.Events);

// loading
$(function () {
    // load up user
    Midgard.user = new Midgard.User();
    Midgard.user.fetch({
        success:    function () { Midgard.trigger("user-loaded"); }
    ,   error:      function () { Midgard.trigger("no-user"); }
    });
    // layout
    Midgard.layout = new Midgard.Layout();
    Midgard.rootView = new Midgard.LayoutView({
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

