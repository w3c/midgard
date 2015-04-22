
var Backbone = require("backbone")
,   $ = require("jquery")
,   User = require("./user")
,   LayoutView = require("./layout-view")
,   WidgetView = require("./widget-view")
    // application state
,   user = new User()
,   WV = new WidgetView()
,   layout
;
Backbone.$ = $;

// register widgets
WV.registerWidget("login", require("../widgets/login"));

// initialisation
$(function () {
    // load up the user
    user.fetch();
    // layout
    layout = new LayoutView({ user: user, el: document.querySelector("main") });
    layout.render();
});
