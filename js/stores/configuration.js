
import DashboardDispatch from "../dispatcher";
import EventEmitter from "events";
import assign from "object-assign";

// this loads up whatever required configuration is sitting on the server

//  /!\  magically create a global fetch
require("isomorphic-fetch");

let utils = require("../utils")
,   _filters = null
,   apiFilters = utils.endpoint("api/events")
,   ConfigurationStore = module.exports = assign({}, EventEmitter.prototype, {
        emitChange: function () { this.emit("change"); }
    ,   addChangeListener: function (cb) { this.on("change", cb); }
    ,   removeChangeListener: function (cb) { this.removeListener("change", cb); }

    ,   getFilters: function () {
            return _filters;
        }
    })
;

ConfigurationStore.dispatchToken = DashboardDispatch.register((action) => {
    switch (action.type) {
        case "load-configuration":
            fetch(apiFilters, { credentials: "include", mode: "cors" })
                .then(utils.jsonHandler)
                .then((data) => {
                    _filters = data;
                    ConfigurationStore.emitChange();
                })
                .catch(utils.catchHandler);
            break;
    }
});
