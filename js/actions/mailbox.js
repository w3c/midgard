
import DashboardDispatch from "../dispatcher";

module.exports = {
    selectMailbox:  function (id) {
        DashboardDispatch.dispatch({ type: "select-mailbox", id: id });
    }
};
