
import DashboardDispatch from "../dispatcher";
import EventEmitter from "events";
import assign from "object-assign";
import FilterStore from "./filter.js";

//  /!\  magically create a global fetch
require("isomorphic-fetch");

// DRY
let utils = require("../utils")
,   _filterCounts = {}
,   _lastSeen = {}
,   apiSince = utils.endpoint("api/events-since")
,   LastSeenStore = module.exports = assign({}, EventEmitter.prototype, {
        emitChange: function () { this.emit("change"); }
    ,   addChangeListener: function (cb) { this.on("change", cb); }
    ,   removeChangeListener: function (cb) { this.removeListener("change", cb); }

    ,   getFilterCount: function (filter) {
            return _filterCounts[filter] || 0;
        }
    ,   load:   function () {
            let json = localStorage.getItem("last-seen-filters");
            _lastSeen = json ? JSON.parse(json) : {};
        }
    })
;

function save () {
    localStorage.setItem("last-seen-filters", JSON.stringify(_lastSeen, null, 4));
}

function checkNewStuff () {
    fetch(  apiSince
        , {
            credentials:    "include"
        ,   mode:           "cors"
        ,   method:         "post"
        ,   headers:        { "Content-Type": "application/json" }
        ,   body:           JSON.stringify(_lastSeen)
        })
        .then(utils.jsonHandler)
        .then((data) => {
            _filterCounts = data;
            save();
            LastSeenStore.emitChange();
        })
        .catch(utils.catchHandler)
    ;
}

FilterStore.addChangeListener(function () {
    let userFilters = FilterStore.getFilters()
    ,   newSeen = {}
    ,   newFilters = {}
    ,   unseen = false
    ;
    for (let k in userFilters) {
        if (typeof _lastSeen[k] === "undefined") unseen = true;
        newSeen[k] = _lastSeen[k] || null;
        newFilters[k] = _filterCounts[k] || 0;
    }
    _lastSeen = newSeen;
    _filterCounts = newFilters;
    save();
    if (unseen) checkNewStuff();
    else LastSeenStore.emitChange();
});

LastSeenStore.dispatchToken = DashboardDispatch.register((action) => {
    switch (action.type) {
        case "watch-seen-since":
            LastSeenStore.load();
            checkNewStuff();
            // check every minute
            setInterval(checkNewStuff, 60 * 1000);
            break;
        case "saw-filter":
            let d = action.date;
            _lastSeen[action.id] = [d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(),
                                    d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(),
                                    d.getUTCMilliseconds()];
            _filterCounts[action.id] = 0;
            save();
            LastSeenStore.emitChange();
            break;
    }
});
