
var _ = require("underscore")
,   Backbone = require("backbone")
,   $ = require("jquery")
,   WidgetView = require("./widget-view")
;

// XXX
//  need to handle the navigation bar

var LayoutView = Backbone.View.extend({
    initialize: function (opt) {
        this.user = opt.user;

        // handle user-related changes
        this.user.on("session-loaded", this.renderForUser.bind(this));
        this.user.on("no-session", this.renderLogin.bind(this));
        this.user.on("login", this.renderForUser.bind(this));
        this.user.on("logout", this.renderLogin.bind(this));
        this.user.on("login-fail", function () {
            this.error("Login failure", "Please check your login/password combination.");
        }.bind(this));
    }
,   columns:    ["left", "centre", "right"]
,   widgets:    {
        left:   null
    ,   centre: null
    ,   right:  null
    }
,   currentID:  0
,   nextID: function () {
        return ++this.currentID;
    }
,   instances:  {}
,   reset:  function () {
        _.keys(this.instances, function (k) {
            this.instances[k].remove(); // XXX this needs to remove() the WidgetView itself, not the element
            delete this.instances[k];
        }.bind(this));
    }
,   message:    function (style, title, content) {
        var $content = $("<div></div>").addClass("content").html(content)
        ,   $close = $("<button>╳</button>")
                            .click(function (ev) {
                                $(ev.target.parentNode).remove();
                            })
        ;
        return $("<div><h3></h3></div>")
                    .addClass("message")
                    .addClass(style)
                    .append($close)
                    .find("h3").html(title).end()
                    .append($content)
                    .appendTo(this.$el)
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
        if (!this.user.layout) return this.renderDefault();
        this.widgets = this.user.layout;
        this.render();
    }
    // render brutally re-renders everything
    // we need to be careful with model changes due to drag-and-drop (removals, etc.) that they
    // don't trigger a complete re-render (make them silent)
,   render: function () {
        this.reset();
        this.$el.empty();
        this.columns.forEach(function (col) {
            var $column = $("<div></div>")
                            .addClass("col-xs-4")
                            .addClass(col)
                            .appendTo(this.$el)
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
        });
    }
});

module.exports = LayoutView;
