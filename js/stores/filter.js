
import DashboardDispatch from "../dispatcher";
import EventEmitter from "events";
import assign from "object-assign";
import LoginStore from "./login.js";

//  /!\  magically create a global fetch
require("isomorphic-fetch");


// DRY
let utils = require("../utils")
,   _filters = {}
,   _user = null
,   apiFilters = utils.endpoint("api/user/filters")
,   FilterStore = module.exports = assign({}, EventEmitter.prototype, {
        emitChange: function () { this.emit("change"); }
    ,   addChangeListener: function (cb) { this.on("change", cb); }
    ,   removeChangeListener: function (cb) { this.removeListener("change", cb); }

    ,   getFilters: function () {
            return _filters;
        }
    })
;

LoginStore.addChangeListener(function () {
    if (LoginStore.isLoggedIn()) {
        _user = LoginStore.getUser();
        _filters = _user.filters || {};
        FilterStore.emitChange();
    }
});

function saveFilters () {
    _user.filters = _filters;
    fetch(  apiFilters
        , {
            credentials:    "include"
        ,   mode:           "cors"
        ,   method:         "put"
        ,   headers:        { "Content-Type": "application/json" }
        ,   body:           JSON.stringify(_filters)
        })
        .then(() => {
            FilterStore.emitChange();
        })
        .catch(utils.catchHandler);
}

FilterStore.dispatchToken = DashboardDispatch.register((action) => {
    switch (action.type) {
        case "add-filter":
            _filters[action.id] = true;
            saveFilters();
            break;
        case "remove-filter":
            delete _filters[action.id];
            saveFilters();
            break;
    }
});
