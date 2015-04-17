
var Midgard = {
    user:   null
};

// loading
$(function () {
    // load up user
    Midgard.user = new Midgard.User();
    Midgard.user.fetch({
        success:    function () {
            // render based on layout
        }
    ,   error:    function () {
            // go to login
        }
    });
});

