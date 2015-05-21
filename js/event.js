
var Backbone = require("backbone");

var Event = Backbone.Model.extend({
    render: function () {
        console.log(this.attributes);
    }
});

module.exports = Event;

