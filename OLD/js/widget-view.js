
var Backbone = require("backbone");

// this is the subclass for all widgets, and the class with which they register themselves
var WidgetView = Backbone.View.extend({});
WidgetView.widgets = {};
WidgetView.registerWidget = function (id, ctor) {
    WidgetView.widgets[id] = ctor;
};
WidgetView.createWidget = function (id, data) {
    return new WidgetView.widgets[id](data);
};

module.exports = WidgetView;
