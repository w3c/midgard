
import React from "react";

import Spinner from "../components/spinner.jsx";

//  /!\  magically create a global fetch
require("isomorphic-fetch");
let utils = require("./utils");

export default class ShowGitHub extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            html:       null
        ,   loading:    false
        };
    }
    componentWillMount () {
        let comp = this
        ,   renderURL = this.remoteRenderURL()
        ;
        if (renderURL) {
            comp.setState({ loading: true });
            fetch(  renderURL
                ,   {
                        mode:       "cors"
                    ,   headers:    { "Accept": "application/vnd.github.v3.html+json" }
                    }
                )
                .then(utils.jsonHandler)
                .then((data) => {
                    console.log(data);
                    comp.setState({
                        html:       data.body_html
                    ,   loading:    false
                    });
                })
                .catch(utils.catchHandler);
            
        }
    }
    remoteRenderURL () {
        let type = this.props.event
        ,   p = this.props.payload
        ;
        if (type === "push") return null;
        if (type === "issues") return p.issue.url;
        if (type === "issue_comment") return p.comment.url; // this includes pull request comments
        else return null;
    }

    render () {
        let st = this.state
        ,   props = this.props
        ,   p = props.payload
        ,   type = props.event
        ,   link
        ,   content
        ;
        if (type === "issues") link = p.issue.html_url;
        else if (type === "issue_comment") link = p.comment.html_url;
        else if (type === "pull_request") link = p.pull_request.html_url;
        else if (type === "push") link = p.compare;
        
        if (st.loading) content = <Spinner/>;
        else if (st.html) content = <div dangerouslySetInnerHTML={{__html: st.html}}></div>;
        else {
            content = <div dangerouslySetInnerHTML={{__html: JSON.stringify(props, null, 4)}}></div>;
        }
        
        return <div className="message" key={props.id}>
                    <div className="meta">
                      <time dateTime={props.time}>{props.time}</time>
                      •
                      {
                          link ? <a href={link} target="_blank">#</a> : "#"
                      }
                      
                    </div>
                    {content}
        </div>;
    }
}
