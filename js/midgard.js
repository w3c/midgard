
var Backbone = require("backbone")
,   $ = require("jquery")
,   User = require("./user")
,   LayoutView = require("./layout-view")
,   WidgetView = require("./widget-view")
    // application state
,   user = new User()
,   layout
;
Backbone.$ = $;

// register widgets
WidgetView.registerWidget("login", require("../widgets/login"));

// initialisation
$(function () {
    // layout
    layout = new LayoutView({ user: user, el: document.querySelector("main") });
    // load up the user
    user.fetch();
});
