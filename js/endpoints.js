
var config = require("../config.json")
,   url = require("url")
;

exports.user = url.resolve(config.api, "/api/user");

