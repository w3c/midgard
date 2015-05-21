
var Backbone = require("backbone")
,   Event = require("./event")
,   endpoints = require("./endpoints")
,   $ = require("jquery")
;

var EventsSource = Backbone.Collection.extend({
    initialize: function (filterName) {
        this.filterName = filterName;
    }
,   model:  Event
,   comparator: function (a, b) {
        if (a.time > b.time) return -1;
        if (a.time < b.time) return 1;
        return 0;
    }
,   sync:   function (method, collection) {
        if (method === "read") {
            $.ajax(endpoints.filter + "/" + this.filterName, {
                method: "GET"
            ,   xhrFields: {
                    withCredentials: true
                }
            ,   success:    function (data) {
                    if (data && data.length) collection.set(data);
                    else collection.trigger("no-data");
                }
            ,   error:      function () {
                    collection.trigger("no-data");
                }
            });
        }
    }
,   render: function () {
        
    }
});

module.exports = EventsSource;

