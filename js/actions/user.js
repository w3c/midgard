
import DashboardDispatch from "../dispatcher";

module.exports = {
    login:  function () {
        DashboardDispatch.dispatch({ type: "login" });
    }
,   logout:  function () {
        DashboardDispatch.dispatch({ type: "logout" });
    }
};
