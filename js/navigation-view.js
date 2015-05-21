
var Backbone = require("backbone")
,   $ = require("jquery")
;

function makeButton (label, icon, event, $ul) {
    return $("<li><button></button></li>")
                .find("button")
                    .attr("title", label)
                    .text(icon) // this is more likely to be an image
                    .click(function () {
                        this.trigger(event);
                    }.bind(this))
                .end()
                .appendTo($ul)
    ;
}

var NavView = Backbone.View.extend({
    showing:    false
,   noUser: function () {
        this.$el.empty();
        this.showing = false;
    }
,   update: function (data) {
        var $ul;
        if (this.showing) $ul = this.$el.find("ul").first();
        else $ul = $("<ul></ul>").appendTo(this.$el);
        $ul.empty();
        // widget picker
        // XXX
        // logout
        makeButton("logout", "logout", "logout", $ul);
    }
});

module.exports = NavView;
