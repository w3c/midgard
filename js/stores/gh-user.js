
import DashboardDispatch from "../dispatcher";
import EventEmitter from "events";
import assign from "object-assign";

let utils = require("../utils");

let _ghusers = {}, _loading = {}
,   GHUserStore = module.exports = assign({}, EventEmitter.prototype, {
        emitChange: function () { this.emit("change"); }
    ,   addChangeListener: function (cb) { this.on("change", cb); }
    ,   removeChangeListener: function (cb) { this.removeListener("change", cb); }
    ,   getUser: function (name) {
            if (_ghusers[name]) {
                return _ghusers[name];
            }
            if (!_loading[name]) {
                _loading[name] = true;
                fetch(  "https://api.github.com/users/" + name
                        ,   {
                            mode:       "cors"
                            ,   headers:    { "Accept": "application/vnd.github.v3.html+json" }
                        })
                    .then(utils.jsonHandler)
                    .then((data) => {
                        _ghusers[name] = {
                            fullname:   data.name
                            ,   avatar:    data.avatar_url + "&s=48"
                        };
                        GHUserStore.emitChange();
            })
                    .catch(utils.catchHandler);
            }
            return {};
        }
});

