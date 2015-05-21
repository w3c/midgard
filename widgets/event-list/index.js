
var list = require("./list.hbs")
// ,   $ = require("jquery")
,   WidgetView = require("../../js/widget-view")
,   EventsSource = require("../../js/events-source")
;

var EventList = WidgetView.extend({
    initialise: function (data) {
        this.parentView = data.parentView; // XXX what is this for?
        this.collection = new EventsSource(data.filter);
        // XXX listen to changes on the filter to load stuff
        //  reset, add, remove — what else?
        this.collection.fetch();
    }
,   render: function () {
        this.$el.html(list({ events: this.collection.models }));
    }
});

module.exports = EventList;
