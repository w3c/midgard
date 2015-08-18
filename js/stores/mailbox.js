
import DashboardDispatch from "../dispatcher";
import EventEmitter from "events";
import assign from "object-assign";

// XXX DRY

let _mbx = null
,   MailboxStore = module.exports = assign({}, EventEmitter.prototype, {
        emitChange: function () { this.emit("change"); }
    ,   addChangeListener: function (cb) { this.on("change", cb); }
    ,   removeChangeListener: function (cb) { this.removeListener("change", cb); }

    ,   mailbox: function () {
            return _mbx;
        }
    })
;

MailboxStore.dispatchToken = DashboardDispatch.register((action) => {
    switch (action.type) {
        case "select-mailbox":
            _mbx = action.id;
            MailboxStore.emitChange();
            break;
    }
});
