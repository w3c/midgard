
import DashboardDispatch from "../dispatcher";

module.exports = {
    startWatching:  function () {
        DashboardDispatch.dispatch({ type: "watch-seen-since" });
    }
,   sawFilter:  function (id, date) {
        DashboardDispatch.dispatch({ type: "saw-filter", id: id, date: date });
    }
};
