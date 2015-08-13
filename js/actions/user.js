
import DashboardDispatch from "../dispatcher";

module.exports = {
    login:  function (username, password) {
        DashboardDispatch.dispatch({ type: "login", username: username, password: password });
    }
,   loadUser:  function () {
        DashboardDispatch.dispatch({ type: "load-user" });
    }
,   logout:  function () {
        DashboardDispatch.dispatch({ type: "logout" });
    }
};
