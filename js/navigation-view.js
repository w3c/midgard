
var Backbone = require("backbone")
,   $ = require("jquery")
;

function makeButton (label, icon, event, $ul) {
    return $("<li><button><img></button></li>")
                .find("img")
                    .attr({
                        alt:    label
                    ,   src:    "node_modules/octicons/svg/" + icon + ".svg"
                    ,   width:  20
                    ,   height: 20
                    })
                .end()
                .find("button")
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
        makeButton("logout", "sign-out", "logout", $ul);
    }
});

module.exports = NavView;
