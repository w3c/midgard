var fs = require("fs");
var _ = require("underscore")
,   $ = require("jquery")
,   swig = require("swig")
,   jn = require("path").join
,   form = swig.compile(fs.readFileSync(jn(__dirname, "login.html"), "utf8"))
;

function Login (opt) {
    _.extend(this, opt);
    this.render();
}
Login.prototype = {
    render: function () {
        this.$parent.html(form({}));
        // on submit, event a login attempt
        // register for login failure notifications
    }
};
module.exports = Login;
