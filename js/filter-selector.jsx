
import React from "react";

import LastSeenStore from "./stores/last-seen";

export default class FilterSelector extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            selected:       props.selected
        ,   unreadCount:    0
        };
    }
    select () { this.setState({ selected: true }); }
    unselect () { this.setState({ selected: false }); }
    _onClick () {
        // if (this.state.selected) return; // you can click it if there's new stuff, it reload
        this.props.onClick(this.props.id);
    }
    componentDidMount () {
        // XXX get rid of this if you can figure out why we get multiple calls to _unreadCount()
        //  even after the components has unmounted, when toggling back and forth a filter in the
        //  configuration panel.
        this.mounted = true;
        LastSeenStore.addChangeListener(this._unreadCount.bind(this));
    }
    componentWillUnmount () {
        // XXX see above
        this.mounted = false;
        LastSeenStore.removeChangeListener(this._unreadCount.bind(this));
        // notify our death
        // this is all a bad code smell
        if (this.state.selected) this.props.onClick(null);
    }
    _unreadCount () {
        // XXX see above
        if (!this.mounted) return;
        this.setState({ unreadCount: LastSeenStore.getFilterCount(this.props.id) });
    }

    render () {
        let st = this.state
        ,   unread
        ;
        if (st.unreadCount) unread = <span className="pill">{st.unreadCount}</span>;
        return <li className={st.selected ? "selected" : ""}>
                <button onClick={this._onClick.bind(this)}>
                    {this.props.name}
                    {" "}
                    {unread}
                </button>
            </li>
        ;
    }
}
