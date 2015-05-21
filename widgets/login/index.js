
var $ = require("jquery")
,   form = require("./login.hbs")
,   WidgetView = require("../../js/widget-view")
;

// Events:
//  login-attempt(username, password): attempting to log in

var Login = WidgetView.extend({
    initialise: function (data) {
        this.parentView = data.parentView;
    }
,   render: function () {
        this.$el
            .html(form({}))
            .find("form")
            .submit(function (evt) {
                evt.preventDefault();
                this.trigger("login-attempt", $("#login-username").val(), $("#login-password").val());
            }.bind(this))
        ;
    }
});

module.exports = Login;
