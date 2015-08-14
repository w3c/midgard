
import React from "react";

export default class FilterSelector extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            selected:    props.selected
        };
    }
    select () { this.setState({ selected: true }); }
    unselect () { this.setState({ selected: false }); }
    _onClick () {
        if (this.state.selected) return;
        this.props.onClick(this.props.id);
    }
    componentWillUnmount () {
        // notify our death
        // this is all a bad code smell
        if (this.state.selected) this.props.onClick(null);
    }

    render () {
        let st = this.state;
        return <li className={st.selected ? "selected" : ""}>
                <button onClick={this._onClick.bind(this)}>{this.props.name}</button>
            </li>
        ;
    }
}
