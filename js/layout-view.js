
var _ = require("underscore")
,   Backbone = require("backbone")
,   $ = require("jquery")
,   Midgard = require("./midgard")
;

var LayoutView = Backbone.View.extend({
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
                            .addClass("col-xs-4")
                            .addClass(col)
                            .appendTo(this.$el)
            ;
            if (this.model.has(col)) {
                this.model.get(col).forEach(function (widget) {
                    var $w = $("<div></div>")
                                .addClass("widget")
                                .addClass("box-row")
                                .appendTo($column)
                    ,   wid = this.nextID()
                    ;
                    $("<h2></h2>").html(widget.title).appendTo($w);
                    var $parent = $("<div></div>").addClass("content").appendTo($w);
                    $w.attr("data-wid", wid);
                    this.instances[wid] = Midgard.createWidget(widget.id, {
                                                wid:        wid
                                            ,   data:       widget.data
                                            ,   $parent:    $parent
                    });
                }.bind(this));
            }
        }.bind(this));
    }
});

module.exports = LayoutView;
