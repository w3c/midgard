
import React from "react";

import UserActions from "./actions/user";

export default class FilterToggle extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            selected:   props.selected
        };
    }
    _toggle () {
        if (this.state.selected)    UserActions.removeFilter(this.props.id);
        else                        UserActions.addFilter(this.props.id);
        this.setState({ selected: !this.state.selected });
    }

    render () {
        let st = this.state
        ,   pr = this.props
        ;
        return <div className="filter">
                <h3>
                    <input type="checkbox" checked={st.selected} ref="toggle" onChange={this._toggle.bind(this)}/>
                    {pr.name}
                </h3>
                <p>
                    {pr.description}
                </p>
            </div>
        ;
    }
}
