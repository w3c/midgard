
var _ = require("underscore")
,   Backbone = require("backbone")
,   $ = require("jquery")
,   WidgetView = require("./widget-view")
,   NavView = require("./navigation-view")
;

// This is the primary object responsible for managing the application
// It builds subviews, listens to what they do.
// Subviews never communicate up, they trigger events on themselves and have no idea of how they're
// embedded. They act as insulated components. They expose methods and can be rendered, that's it.

// XXX
//  need to handle the navigation bar

var LayoutView = Backbone.View.extend({
    initialize: function (opt) {
        this.user = opt.user;
        this.$row = this.$el.find("div.row");
        
        // navigation
        this.nav = new NavView({ el: this.el.querySelector("nav") });
        this.nav.on("logout", function () { this.user.logout(); }.bind(this));

        // handle user-related changes
        this.user.on("no-session", this.renderLogin.bind(this));
        this.user.on("session-loaded", this.renderForUser.bind(this));
        this.user.on("login", this.renderForUser.bind(this));
        this.user.on("logout", this.renderLogin.bind(this));
        this.user.on("login-fail", function () {
            this.error("Login failure", "<p>Please check your login/password combination.</p>");
        }.bind(this));
    }
,   columns:    ["left", "centre", "right"]
,   widgets:    {
        left:   null
    ,   centre: null
    ,   right:  null
    }
,   unusedWidgets:  []
,   currentID:  0
,   nextID: function () {
        return ++this.currentID;
    }
,   instances:  {}
,   reset:  function () {
        _.keys(this.instances, function (k) {
            this.instances[k].remove();
            delete this.instances[k];
        }.bind(this));
    }
,   message:    function (style, title, content) {
        var $content = $("<div></div>").addClass("content").html(content)
        ,   $close = $("<button>╳</button>")
                            .addClass("close")
                            .click(function (ev) {
                                $(ev.target.parentNode).remove();
                            })
        ;
        return $("<div><h2></h2></div>")
                    .addClass("message widget box-row")
                    .addClass(style)
                    .append($close)
                    .find("h2").html(title).end()
                    .append($content)
                    .prependTo(this.$row.find("div.left").first())
        ;
    }
,   error:  function (title, content) {
        title = title || "Error";
        return this.message("error", title, content);
    }
    // special rendering for the login screen that just removes everything
,   renderLogin:    function () {
        var w = this.widgets;
        if (w.left === null && w.right === null &&
            w.centre && w.centre.length === 1 && w.centre[0].id === "login") return;
        this.widgets = {
            left:   null
        ,   centre: [
                { id: "login", title: "Login" }
            ]
        ,   right:  null
        };
        this.nav.noUser();
        this.render();
    }
    // the default set of widgets for users who haven't customised anything
,   renderDefault:  function () {
        // XXX make this actually useful
        this.widgets = {
            left:   null
        ,   centre: null
        ,   right:  null
        };
        this.render();
    }
    // render customised per user
,   renderForUser:  function () {
        this.nav.update({
            unusedWidgets:  this.unusedWidgets
        });
        if (!this.user.layout) return this.renderDefault();
        this.widgets = this.user.layout;
        this.render();
    }
    // render brutally re-renders everything
    // we need to be careful with model changes due to drag-and-drop (removals, etc.) that they
    // don't trigger a complete re-render (make them silent)
,   render: function () {
        this.reset();
        this.$row.empty();
        this.columns.forEach(function (col) {
            var $column = $("<div></div>")
                            .addClass("col-xs-4")
                            .addClass(col)
                            .appendTo(this.$row)
            ;
            if (this.widgets[col]) {
                this.widgets[col].forEach(function (widget) {
                    // we render a box in which the widget can render itself
                    var $w = $("<div></div>")
                                .addClass("widget")
                                .addClass("box-row")
                                .appendTo($column)
                    ,   wid = this.nextID()
                    ;
                    $("<h2></h2>").html(widget.title).appendTo($w);
                    var $parent = $("<div></div>").addClass("content").appendTo($w);
                    $w.attr("data-wid", wid);
                    this.instances[wid] = WidgetView.createWidget(widget.id, {
                                                data:       widget.data
                                            ,   el:         $parent[0]
                                            ,   parentView: this
                    });
                    this.installListeners(this.instances[wid]);
                    this.instances[wid].render();
                }.bind(this));
            }
        }.bind(this));
    }
    // this is where we handle all events that can come from widgets
,   installListeners:   function (widget) {
        widget.on("login-attempt", function (id, password) {
            this.user.login(id, password);
        }.bind(this));
    }
});

module.exports = LayoutView;
