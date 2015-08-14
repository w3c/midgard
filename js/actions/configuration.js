
import DashboardDispatch from "../dispatcher";

module.exports = {
    loadConfiguration:  function () {
        DashboardDispatch.dispatch({ type: "load-configuration" });
    }
};
