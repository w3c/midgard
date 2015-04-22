
var Backbone = require("backbone");

// this is the subclass for all widgets, and the class with which they register themselves
var WidgetView = Backbone.View.extend({
    constructor: function (id, data) {
        return new this.widgets[id](data);
    }
,   widgets:    {}
,   registerWidget: function (id, ctor) {
        this.widgets[id] = ctor;
    }
});

module.exports = WidgetView;
