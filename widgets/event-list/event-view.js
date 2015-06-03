
var Backbone = require("backbone")
,   $ = require("jquery")
,   issues = require("./issues.hbs")
,   issue_comment_created = require("./issue-comment-created.hbs")
,   pull_request = require("./pull-request.hbs")
,   push = require("./push.hbs")
,   endpoints = require("../../js/endpoints")
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
    ,   background:             "url('" + endpoints.octicons + icon + ".svg') no-repeat"
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

        // Operation on a GH issue
        else if (evtType === "issues") {
            var icon = "issue-opened";
            meta(time, p.issue.html_url, $el);
            // XXX we don't handle: assigned, unassigned, labeled, unlabeled
            // we handle opened, closed, reopened
            if (p.action === "opened") true; // noop
            else if (p.action === "closed") icon = "issue-closed";
            else if (p.action === "closed") icon = "issue-reopened";
            else console.log("Ignoring issues action=" + p.action);
            $el.append(issues(p));
            eventBox($el, icon);
        }

        // Comment made on a GH issue
        else if (evtType === "issue_comment") {
            eventBox($el, "comment");
            if (p.action === "created") {
                meta(time, p.comment.html_url, $el);
                $el.append(issue_comment_created(p));
            }
            else console.log("Ignoring issue_comment action=" + p.action);
        }

        // Operation on a pull request
        else if (evtType === "pull_request") {
            // not sure what that is, probably not useful
            if (p.action === "synchronize") return $el.hide();
            var icon = "git-pull-request";
            if (p.action === "closed") {
                icon = "git-merge";
                // this should be in the template, but HBS is just too dumb
                if (p.pull_request.merged) p.action = "merged";
            }
            eventBox($el, icon);
            meta(time, p.pull_request.html_url, $el);
            $el.append(pull_request(p));
        }

        // push
        else if (evtType === "push") {
            p.branch = p.ref.replace("refs/heads/", "");
            p.commits.forEach(function (c) { c.short_sha = c.id.substr(0, 7); });
            eventBox($el, "repo-push");
            meta(time, p.compare, $el);
            $el.append(push(p));
        }

        // log ignored events so that we don't forget
        else {
            console.log("Ignoring event " + evtType);
        }
    }
});

module.exports = EventView;
