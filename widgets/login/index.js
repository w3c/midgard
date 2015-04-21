
var _ = require("underscore")
,   $ = require("jquery")
,   form = require("./login.hbs")
,   Midgard = require("../../js/midgard")
;

function Login (opt) {
    _.extend(this, opt);
    this.render();
}
Login.prototype = {
    render: function () {
        this.$parent
            .html(form({}))
            .find("form")
            .submit(function () {
                Midgard.user.login($("#login-id").val(), $("#login-password").val());
                return false;
            })
        ;
        // on submit, event a login attempt
        // register for login failure notifications
    }
};
module.exports = Login;
