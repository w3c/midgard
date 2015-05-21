
var list = require("./list.hbs")
// ,   $ = require("jquery")
,   WidgetView = require("../../js/widget-view")
,   EventsSource = require("../../js/events-source")
;

var EventList = WidgetView.extend({
    initialize: function (data) {
        console.log("event-list", data);
        this.collection = new EventsSource({ filterName: data.data.filterName });
        // XXX listen to changes on the filter to load stuff
        //  reset, add, remove — what else?
        this.collection.fetch();
        
        // XXX
        // for every add on the colleciton, add a <li>, set it as the .el for the Event model's View
        // and render that model (using its view)
        // for every remove, remove the view (or should it remove itself?)
        
        this.collection.on("add", function (data) {
            console.log("added", data);
            // XXX how is the collection rendered, directly or through delegation?
            // I would prefer to just render up to the <li> here, and delegate rendering the content
            // to the actual event
        });
    }
,   render: function () {
        // XXX I guess our base class does title and all?
        this.$el.html(list({ events: this.collection.models }));
    }
});

module.exports = EventList;
