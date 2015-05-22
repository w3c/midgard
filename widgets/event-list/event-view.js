
var Backbone = require("backbone")
,   $ = require("jquery")
,   issue_comment_created = require("./issue-comment-created.hbs")
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

function eventBox ($el, icon) {
    $el.css({
        "padding-left":         "20px"
    ,   background:             "url('../node_modules/octicons/svg/" + icon + ".svg') no-repeat"
    ,   "background-size":      "15px 15px"
    ,   "background-position":  "0 7px"
    });
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
        // any RSS entry looks like this
        if (evtType === "rss") {
            meta(time, p.link, $el);
            if (p.lang) $el.attr("lang", p.lang);
            if (origin !== "W3CMemes") $("<h3></h3>").text(p.title).appendTo($el);
            $el.append(cleanup(p.summary || p.content, origin));
        }
        // Comment made on a GH issue
        else if (evtType === "issue_comment") {
            console.log(p);
            eventBox($el, "comment");
            if (p.action === "created") {
                meta(time, p.comment.html_url, $el);
                $el.append(issue_comment_created(p));
            }
            else console.log("Ignoring issue_comment action=" + p.action);
        }
        else {
            console.log("Ignoring event " + evtType);
        }
    }
});

module.exports = EventView;
