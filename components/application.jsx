
import React from "react";
import DocumentTitle from "react-document-title";

export default class Application extends React.Component {
    render () {
        return  <DocumentTitle title={this.props.title}>
                    <main>
                      <header><h1>{this.props.title}</h1></header>
                      <div className="app-body">{this.props.children}</div>
                      <footer></footer>
                     </main>
                </DocumentTitle>
        ;
    }
}
