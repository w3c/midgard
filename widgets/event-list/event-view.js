
var Backbone = require("backbone")
,   $ = require("jquery")
;

function meta (date, link, $parent) {
    var $div = $("<div class='meta'></div>");
    $("<time></time>")
        .attr("datetime", date)
        .text(date)
        .appendTo($div)
    ;
    $div.append(document.createTextNode(" • "));
    $("<a>#</a>")
        .attr({
            href:   link
        ,   target: "_blank"
        })
        .appendTo($div)
    ;
    $div.appendTo($parent);
    return $div;
}

function cleanup (html, origin) {
    if (origin === "W3CMemes") return html.replace(/<br\/?>/ig, "");
    return html;
}

var EventView = Backbone.View.extend({
    render: function () {
        // switch on various types of events and their content in order
        var evtType = this.model.get("event")
        ,   origin = this.model.get("origin")
        ,   time = this.model.get("time")
        ,   p = this.model.get("payload")
        ,   $el = this.$el
        ;
        console.log("event=" + evtType);
        if (evtType === "rss") {
            if (p.lang) $el.attr("lang", p.lang);
            if (origin !== "W3CMemes") $("<h3></h3>").text(p.title).appendTo($el);
            $el.append(cleanup(p.summary || p.content, origin));
            meta(time, p.link, $el);
        }
        else {
            console.log("Ignoring event " + evtType);
        }
    }
});

module.exports = EventView;
