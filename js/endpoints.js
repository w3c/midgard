
var url = require("url");

if (!window.config && window.config.api) throw(new Error("You must specify a config.js file."));

exports.user = url.resolve(window.config.api, "/api/user");
exports.events = url.resolve(window.config.api, "/api/events");

