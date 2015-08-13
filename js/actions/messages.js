
import DashboardDispatch from "../dispatcher";

module.exports = {
    error:  function (msg) {
        console.error(msg);
        DashboardDispatch.dispatch({ type: "error", message: msg });
    }
,   success:    function (msg) {
        console.log(msg);
        DashboardDispatch.dispatch({ type: "success", message: msg });
    }
,   dismiss:    function (id) {
        DashboardDispatch.dispatch({ type: "dismiss", id: id });
    }
};
