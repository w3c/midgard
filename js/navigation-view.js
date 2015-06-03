
var Backbone = require("backbone")
,   $ = require("jquery")
,   endpoints = require("./endpoints")
;

function makeButton (label, icon, event, $ul, self) {
    return $("<li><button><img></button></li>")
                .find("img")
                    .attr({
                        alt:    label
                    ,   src:    endpoints.octicons + icon + ".svg"
                    ,   width:  20
                    ,   height: 20
                    })
                .end()
                .find("button")
                    .click(function () {
                        self.trigger(event);
                    }.bind(this))
                .end()
                .appendTo($ul)
    ;
}

var NavView = Backbone.View.extend({
    showing:    false
,   noUser: function () {
        this.$el.empty();
        this.$el.hide();
        this.showing = false;
    }
,   update: function (data) {
        this.$el.show();
        var $ul;
        if (this.showing) $ul = this.$el.find("ul").first();
        else $ul = $("<ul></ul>").appendTo(this.$el);
        $ul.empty();
        // widget picker
        // XXX
        // logout
        makeButton("logout", "sign-out", "logout", $ul, this);
    }
});

module.exports = NavView;
