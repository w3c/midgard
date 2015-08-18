
import React from "react";

import FilterStore from "./stores/filter";
import ConfigurationStore from "./stores/configuration";
import MailboxActions from "./actions/mailbox";

import FilterSelector from "./filter-selector.jsx";

export default class FilterList extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            userFilters:    FilterStore.getFilters()
        ,   allFilters:     ConfigurationStore.getFilters()
        };
    }
    componentDidMount () {
        FilterStore.addChangeListener(this._onChange.bind(this));
        ConfigurationStore.addChangeListener(this._onChange.bind(this));
        let sid = this.getSelected();
        // XXX this is bad because we drive it but we don't respond to it
        // this project is a good candidate for Redux, if there's a refactor
        if (sid) MailboxActions.selectMailbox(sid); // code smell
    }
    componentWillUnmount () {
        FilterStore.removeChangeListener(this._onChange.bind(this));
        ConfigurationStore.removeChangeListener(this._onChange.bind(this));
    }
    _onChange () {
        this.setState({ userFilters: FilterStore.getFilters(), allFilters: ConfigurationStore.getFilters() });
    }
    _onSelect (id) {
        if (id === null) return this.removeSelected();
        let sid = this.getSelected();
        if (sid) this.refs["fs-" + sid].unselect();
        this.setSelected(id);
        this.refs["fs-" + id].select();
    }
    setSelected (id) {
        localStorage.setItem("selectedID", id);
        MailboxActions.selectMailbox(id);
    }
    removeSelected () {
        localStorage.removeItem("selectedID");
    }
    getSelected () {
        return localStorage.getItem("selectedID");
    }

    render () {
        let st = this.state
        ,   comp = this
        ;
        if (Object.keys(st.userFilters).length === 0) {
            return <p>
                    You have no configured event lists to follow; add some using the “Configure”
                    button above.
                    </p>
            ;
        }
        return <ul>
                {
                    Object.keys(st.userFilters)
                        .map((id) => {
                            return <FilterSelector key={id} id={id} selected={id === comp.getSelected()}
                                                    ref={"fs-" + id} {...st.allFilters[id]}
                                                    onClick={this._onSelect.bind(this)}/>;
                        })
                }
            </ul>
        ;
    }
}
