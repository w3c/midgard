
import DashboardDispatch from "../dispatcher";
import EventEmitter from "events";
import assign from "object-assign";

//  /!\  magically create a global fetch
require("isomorphic-fetch");

let utils = require("../utils")
,   _loggedIn = null
,   LoginStore = module.exports = assign({}, EventEmitter.prototype, {
        emitChange: function () { this.emit("change"); }
    ,   addChangeListener: function (cb) { this.on("change", cb); }
    ,   removeChangeListener: function (cb) { this.removeListener("change", cb); }

    ,   isLoggedIn: function () {
            return _loggedIn;
        }
    })
;

LoginStore.dispatchToken = DashboardDispatch.register((action) => {
    switch (action.type) {
        case "login":
            // XXX needs to work with pheme
            //  this actually probably needs to take info, submit it, etc.
            //  we probably need a separate method to check login
            // fetch(pp + "api/logged-in", { credentials: "include" })
            //     .then(utils.jsonHandler)
            //     .then((data) => {
            //         _loggedIn = data.ok;
            //         LoginStore.emitChange();
            //     })
            //     .catch(utils.catchHandler);
            break;
        case "logout":
            // XXX needs to work with pheme
            // fetch(pp + "api/logout", { credentials: "include" })
            //     .then(utils.jsonHandler)
            //     .then((data) => {
            //         if (!data.ok) throw "Logout failed";
            //         _loggedIn = false;
            //         _admin = false;
            //         LoginStore.emitChange();
            //     })
            //     .catch(utils.catchHandler);
            break;
    }
});
