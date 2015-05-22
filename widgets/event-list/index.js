
var list = require("./list.hbs")
,   $ = require("jquery")
,   WidgetView = require("../../js/widget-view")
,   EventsSource = require("../../js/events-source")
,   EventView = require("./event-view")
;

var EventList = WidgetView.extend({
    initialize: function (data) {
        // load collection
        this.collection = new EventsSource({ filterName: data.data.filterName });
        this.collection.fetch();
        
        // XXX can we strip that sourcemap already?
        
        this.collection.on("add", function (model) {
            var $li = $("<li></li>").appendTo(this.$ul)
            ,   evv = new EventView({ model: model, el: $li.get(0) })
            ;
            evv.render();
        }.bind(this));
    }
,   render: function () {
        this.$el.html(list({}));
        this.$ul = this.$el.find("ul").first();
    }
});

module.exports = EventList;
