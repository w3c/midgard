
var _ = require("underscore")
,   Backbone = require("backbone")
,   $ = require("jquery")
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

Midgard.LayoutView = Backbone.View.extend({
    initialize: function() {
        this.listenTo(this.model, "change", this.render);
    }
,   columns:    ["left", "centre", "right"]
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
    // render brutally re-renders everything
    // we need to be careful with model changes due to drag-and-drop (removals, etc.) that they
    // don't trigger a complete re-render (make them silent)
,   render: function () {
        this.reset();
        this.$el.empty();
        this.columns.forEach(function (col) {
            var $column = $("<div></div>")
                            .addClass("column")
                            .addClass(col)
                            .appendTo(this.$el)
            ;
            if (this.model.has(col)) {
                this.model.get(col).forEach(function (widget) {
                    var $w = $("<div></div>")
                                .addClass("widget")
                                .appendTo($column)
                    ,   Widget = Midgard.widgets[widget.id]
                    ,   wid = this.nextID()
                    ;
                    $w.attr("data-wid", wid);
                    this.instances[wid] = new Widget({
                                                wid:        wid
                                            ,   data:       widget.data
                                            ,   $parent:    $w
                    });
                });
            }
        }.bind(this));
    }
});

