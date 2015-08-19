
import React from "react";

import Spinner from "../components/spinner.jsx";
import ShowGitHub from "./show-github.jsx";

import MailboxStore from "./stores/mailbox";
import LastSeenActions from "./actions/last-seen";

//  /!\  magically create a global fetch
require("isomorphic-fetch");
let utils = require("./utils")
,   apiEvents = utils.endpoint("api/events/")
;

function cleanup (html, origin) {
    let res;
    if (origin === "W3CMemes") res = html.replace(/<br\/?>/ig, "");
    else res = html;
    return { __html: res };
}


export default class EventList extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            mailbox:    null
        ,   loading:    false
        ,   events:     []
        };
    }
    componentDidMount () {
        MailboxStore.addChangeListener(this.loadEvents.bind(this));
        this.loadEvents();
    }
    componentWillUnmount () {
        MailboxStore.removeChangeListener(this.loadEvents.bind(this));
    }
    loadEvents () {
        var mbx = MailboxStore.mailbox()
        ,   comp = this
        ;
        if (!mbx) {
            return comp.setState({
                mailbox:    null
            ,   events:     []
            });
        }
        comp.setState({ loading: true });
        fetch(apiEvents + mbx, { credentials: "include", mode: "cors" })
            .then(utils.jsonHandler)
            .then((data) => {
                let mostRecent = data.payload[0];
                if (mostRecent) {
                    let d = new Date(mostRecent.time);
                    // up it by one so that the document we're seeing isn't selected.
                    d = new Date(d.getTime() + 1);
                    LastSeenActions.sawFilter(mbx, d);
                }
                comp.setState({
                    mailbox:    mbx
                ,   events:     data.payload
                ,   loading:    false
                });
            })
            .catch(utils.catchHandler);
    }

    render () {
        let st = this.state;
        if (st.loading) return <div className="messages"><Spinner/></div>;
        if (!st.events.length) return <div className="messages"><p>No events.</p></div>;
        return <div className="messages">
            {
                st.events.map((ev) => {
                        {
                            let type = ev.event
                            ,   p = ev.payload
                            ;
                            if (type === "rss") {
                                return <div className="message" key={ev.id}>
                                            <div className="meta">
                                              <time dateTime={ev.time}>{ev.time}</time>
                                              {" • "}
                                              <a href={p.link} target="_blank">#</a>
                                            </div>
                                            {
                                                (ev.origin === "W3CMemes") ?
                                                    "" :
                                                    <h3>{p.title}</h3>
                                            }
                                            <div dangerouslySetInnerHTML={cleanup(p.summary || p.content, ev.origin)}></div>
                                </div>;
                            }
                            else if (ev.origin === "github") return <ShowGitHub {...ev} key={ev.id}/>;
                            else return <pre key={ev.id}>{JSON.stringify(ev, null, 4)}</pre>;
                        }
                })
            }
        </div>;
    }
}
