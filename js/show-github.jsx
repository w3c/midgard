
import React from "react";

import Spinner from "../components/spinner.jsx";

//  /!\  magically create a global fetch
require("isomorphic-fetch");
let utils = require("./utils");

function background (pic) {
    return "transparent url('" + utils.pathPrefix() + "node_modules/octicons/svg/" + pic + ".svg') no-repeat scroll 0px 7px / 15px 15px";
}

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
        if (type === "pull_request_review_comment") return p.comment.url;
        else return null;
    }

    render () {
        let st = this.state
        ,   props = this.props
        ,   p = props.payload
        ,   type = props.event
        ,   link
        ,   content
        ,   intro
        ,   style = {} // padding-left: 20px
        ;

        // some things we don't bother rendering
        if (
            (type === "delete" && p.ref_type === "branch") ||
            (type === "create" && p.ref_type === "branch") ||
            (type === "pull_request" && p.action === "synchronize")
        ) return <div></div>;

        // pick the link
        if (type === "issues") link = p.issue.html_url;
        else if (type === "issue_comment" || type === "pull_request_review_comment") link = p.comment.html_url;
        else if (type === "pull_request") link = p.pull_request.html_url;
        else if (type === "push") link = p.compare;
        else if (type === "fork") link = p.forkee.html_url;
        else if (type === "gollum") link = p.pages[0].html_url;

        // some types have actual content payloads
        if (st.loading) content = <Spinner/>;
        else if (st.html) content = <div dangerouslySetInnerHTML={{__html: st.html}}></div>;

        // here we need to actually switch on events
        if (type === "issues") {
            intro = <p>
                      <span className="gh-user">@{p.sender}</span> <em>{p.action}</em> issue
                      {" "}
                      <a href={p.issue.html_url} target="_blank">{p.repository}#{p.issue.number}</a>
                      {" "}
                      <span className="issue-title">“{p.issue.title}”</span>.
                      {
                          p.label ?
                                <span className="label" style={{ background: p.label.color }}>{p.label.name}</span> :
                                ""
                      }
            </p>
            ;
            // XXX we don't handle: assigned, unassigned, labeled, unlabeled
            // we handle opened, closed, reopened
            if (p.action === "closed") style.background = background("issue-closed");
            else if (p.action === "opened") style.background = background("issue-opened");
            else if (p.action === "reopened") style.background = background("issue-reopened");
        }
        else if (type === "issue_comment") {
            // XXX there may be other actions than "created"
            intro = <p>
                      <span className="gh-user">@{p.sender}</span> commented on issue
                      {" "}
                      <a href={p.issue.html_url} target="_blank">{p.repository}#{p.issue}</a>.
                    </p>
            ;
            style.background = background("comment");
        }
        else if (type === "pull_request_review_comment") {
            intro = <p>
                      <span className="gh-user">@{p.sender}</span> commented on pull request
                      {" "}
                      <a href={p.comment.html_url} target="_blank">{p.repository}#{p.pull_request.number}</a>
                      {" "}
                      <span className="issue-title">“{p.pull_request.title}”</span>.
                      {
                          p.label ?
                                <span className="label" style={{ background: p.label.color }}>{p.label.name}</span> :
                                ""
                      }
                    </p>
            ;
            style.background = background("comment");
        }
        else if (type === "pull_request") {
            intro = <p>
                      <span className="gh-user">@{p.sender}</span> <em>{p.action}</em> pull request
                      {" "}
                      <a href={p.pull_request.html_url} target="_blank">{p.repository}#{p.pull_request.number}</a>
                      {" "}
                      <span className="issue-title">“{p.pull_request.title}”</span>.
                      {
                          p.label ?
                                <span className="label" style={{ background: p.label.color }}>{p.label.name}</span> :
                                ""
                      }
            </p>
            ;
            if (p.action === "closed") style.background = background("git-merge");
            else style.background = background("git-pull-request");
        }
        else if (type === "push") {
            intro = <p>
                      <span className="gh-user">@{p.sender}</span> <em>pushed</em> to
                      {" "}
                      <a href={p.compare} target="_blank">{p.repository}#{p.ref.replace("refs/heads/", "")}</a>.
                    </p>
            ;
            content = <ul className='commits-list'>
                        {
                            p.commits.map((c) => {
                                let short_sha = c.id.substr(0, 7);
                                return <li key={short_sha}><a href={c.url} target="_blank">{short_sha}</a> {c.message}</li>;
                            })
                        }
                    </ul>
            ;
            style.background = background("repo-push");
        }
        else if (type === "create") {
            intro = <p>
                      <span className="gh-user">@{p.sender}</span> <em>created</em> a {p.ref_type} named <a href={"https://github.com/" + p.repository + "/tree/" + p.ref} target="_blank">{p.ref}</a> on repository
                      {" "}
                      <a href={"https://github.com/" + p.repository} target="_blank">{p.repository}</a>.
                    </p>
            ;
            style.background = background("repo-created");
        }
        else if (type === "fork") {
            intro = <p>
                      <span className="gh-user">@{p.sender}</span> <em>forked</em> repository
                      {" "}
                      <a href={"https://github.com/" + p.repository} target="_blank">{p.repository}</a> to
                      {" "}
                      <a href={p.forkee.html_url} target="_blank">{p.forkee.full_name}</a>.
                    </p>
            ;
            style.background = background("repo-forked");
        }
        else if (type === "gollum") {
            intro = <p>
                      <span className="gh-user">@{p.sender}</span> <em>changed</em> wiki pages in repository
                      {" "}
                      <a href={"https://github.com/" + p.repository} target="_blank">{p.repository}</a>.
                    </p>
            ;
            content = <ul className='wiki-list'>
                        {
                            p.pages.map((w) => {
                                let short_sha = w.sha.substr(0, 7);
                                return <li key={short_sha}><a href={w.html_url} target="_blank">{w.title}</a> ({w.action})</li>;
                            })
                        }
                    </ul>
            ;

            style.background = background("repo-wiki");
        }
        else {
            intro = <p>Unknown GH event type</p>;
            content = <div dangerouslySetInnerHTML={{__html: JSON.stringify(props, null, 4)}}></div>;
        }

        return <div className="message" key={props.id} style={style}>
                    <div className="meta">
                      <time dateTime={props.time}>{props.time}</time>
                      {" • "}
                      {
                          link ? <a href={link} target="_blank">#</a> : "#"
                      }

                    </div>
                    {intro}
                    <div className="content">
                        {content}
                    </div>
        </div>;
    }
}
