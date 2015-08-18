
import DashboardDispatch from "../dispatcher";

module.exports = {
    error:  function (msg, opts) {
        console.error(msg);
        DashboardDispatch.dispatch({ type: "error", message: msg, mode: opts && opts.mode ? opts.mode : ""  });
    }
,   success:    function (msg) {
        console.log(msg);
        DashboardDispatch.dispatch({ type: "success", message: msg });
    }
,   dismiss:    function (id) {
        DashboardDispatch.dispatch({ type: "dismiss", id: id });
    }
};
