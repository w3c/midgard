
import DashboardDispatch from "../dispatcher";
import EventEmitter from "events";
import assign from "object-assign";

let _messages = []
,   _counter = 0
,   MessageStore = module.exports = assign({}, EventEmitter.prototype, {
        emitChange: function () { this.emit("change"); }
    ,   addChangeListener: function (cb) { this.on("change", cb); }
    ,   removeChangeListener: function (cb) { this.removeListener("change", cb); }

    ,   messages: function () {
            return _messages;
        }
    })
;

MessageStore.dispatchToken = DashboardDispatch.register((action) => {
    switch (action.type) {
        case "error":
        case "success":
            let msg = typeof action.message === "string" ? action.message : action.message.message;
            if (_messages.length > 0 && _messages[_messages.length - 1].message === msg) {
                _messages[_messages.length - 1].repeat++;
            } else {
                _messages.push({
                    id:         ++_counter
                ,   message:    msg
                ,   type:       action.type
                ,   mode:       action.mode
                ,   repeat:     0
                });
            }
            MessageStore.emitChange();
            break;
        case "dismiss":
            _messages = _messages.filter(function (m) { return m.id != action.id; });
            MessageStore.emitChange();
            break;
    }
});
