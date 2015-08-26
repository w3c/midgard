
# How to develop and deploy Pheme and Midgard

[Pheme][Pheme] can be deployed on its own, it can be used for things other than [Midgard][Midgard].
Midgard, however, requires Pheme.

This document describes what one needs to know in order to hack on Pheme and Midgard. If you are
familiar with Node, CouchDB, and React you are already on sane territory but I recommend you at
least skim this document as the local specificities are laid out as well.

## IMPORTANT WARNING

If you are rebuilding the Midgard code on a Mac, you are likely to get an incomprehensible
error from Browserify of the type `Error: EMFILE, open '/some/path'`. That is because the number of
simultaneously open files is bizarrely low on OSX, and Browserify opens a bizarrely high number
of resources concurrently.

In order to do that, in the environment that runs the build, you will need to run:

    ulimit -n 2560

If you don't know that, you can waste quite some time.

## Overall Architecture

The Pheme repository is a purely server-side application. It exposes a JSON API over the Web but
nothing user-consumable. It is written in Node and uses [Express][Express] as well as the typical
Express middleware for sessions, logging, etc.

The database system is [CouchDB][CouchDB]. It is also used in a straightforward manner, with no
reliance on CouchDB specificities. If needed, it could be ported to another system. The only thing
that is worth knowing is that the filters that provide views on the data are used to generate actual
CouchDB views. This gives them huge performance (since they're basically pre-indexed), but it means
you have to remember to run the DB updater when you change the filters. If a UI were made to create
filters (which might be a good idea at some point) this could be done live.

Midgard is, on its side, a purely client-side application. It consumes the JSON API that Pheme
exposes and simply renders it. It can be served by pretty much any Web server.

It is written using [React][React], making lightweight use of the [Flux][Flux] architecture, and is
built using [Browserify][Browserify]. React is its own way of thinking about Web applications that
has its own learning curve (and can require a little bit of retooling of one's editor for the
[JSX][JSX] part) but once you start using it it is hard to go back. It's the first framework I find
to be worth the hype since jQuery (and for completely different reasons).

No CSS framework is used; but the CSS does get built too using [cleancss][cleancss] (for modularity
and minification).

## Installing Pheme

It's pretty straightforward:

    git clone https://github.com/w3c/pheme
    cd pheme
    npm install -d

You now need to configure the system so that it can find various bits and pieces. For this create a
`config.json` at the root, with the following content:

```
{
    // This is the port you want to run on; it can be 80 but I run it behind an nginx proxy.
    "port": 3042
    // This is the list of data sources. The keys correspond to source modules (under `sources/`).
    // Each source module accepts an array of instances each of which can get its own configuration.
,   "sources": {
        // The "rss" source can take an arbitrary number of RSS/Atom sources. Each of those needs to
        // have a `name` (which is has to be unique in the list and ismapped in the event filters),
        // a `url` to the RSS/Atom to poll, and an `acl` which can be `public` or `team` (and
        // should eventually include `member` too; unless we decide that all that's in the
        // dashboard is public).
        // Here there are two RSS sources, the official W3C news from W3C Memes, and the party line
        // from the W3C itself.
        "rss": [
            {
                "name": "W3CMemes"
            ,   "url":  "http://w3cmemes.tumblr.com/rss"
            ,   "acl":  "public"
            }
        ,   {
                "name": "W3C News"
            ,   "url":  "http://www.w3.org/blog/news/feed/atom"
            ,   "acl":  "public"
            }
        ]
        // The "github" source can take an arbitrary number of hook locations. The value in having
        // more than one is because Web hooks need to have a secret (so that people can't send you
        // spurious content), and it's good practice to have different secrets for different places.
        // Note that you can set up an organisation-wide hook (there's one for W3C).
        // The secret below isn't the real one for W3C. It's probably a good idea to get the real
        // one from @darobin if you need it.
        // If you have several hooks, they need to have unique names and unique paths.
    ,   "github": [
            {
                "name":     "GitHub W3C Repositories"
            ,   "secret":   "Some magical phrase"
            ,   "path":     "/hook"
            }
        ]
    }
    // Configuration for the store, probably self-explanatory
,   "store": {
        "auth": {
            "username": "robin"
        ,   "password": "wickEdCo0lPasswr.D"
        }
    }
    // The logging. `console` turns logging to the console on or off (likely off in production); and
    // `file` (if present) is the absolute path to, yes, a log file to log logs into.
,   "logs": {
        "console":  true
    ,   "file":     "/some/absolute/path/all.log"
    }
}
```
Now, with CouchDB is already up and running, you want to run:

    node lib/store.js

This installs all the design documents that Couch needs. Whenever you change the design documents,
or **whenever you update `lib/filters/events.js`** just run `lib/store.js` again.

Running the server is as simple as:

    node bin/server.js

If you are going to develop however, that isn't the best way of running the server. When developing
the server code, you want to run:

    npm run watch

This will start a [nodemon][nodemon] instance that will monitor the changes you make to the Pheme
code, and restart it for you.

One of the issues with developing on one's box is that it is not typically accessible over the Web
for outside services to interact with. If you are trying to get events from repositories on GitHub,
you will need to expose yourself to the Web. You may already have your preferred way of doing that,
but in case you don't you can use [ngrok][ngrok] (which is what I do). In order to expose your
service through ngrok, just run

    npm run expose

Note that you don't need that for regular development, you only need to be exposed if you want to
receive GitHub events.

## Deploying Pheme in Production

You will want a slightly different `config.json`; the one in hatchery is serviceable (it notably has
the right secret for the W3C hook).

You don't want to use `npm run` in production; instead use [pm2][pm2]. A configuration is provided
for it in `pm2-production.json` (it's what's used on hatchery).

## Installing Midgard

It's pretty straightforward:

    git clone https://github.com/w3c/midgard
    cd midgard
    npm install -d

Note that even though this is client-side code you *must* install the dependencies *even just to
deploy it*.

You now need to configure the system so that it can find various bits and pieces. For this create a
`config.json` at the root, with the following content:

```
{
    // This is the URL to the root of the API server, with trailing /.
    "api":          "http://pheme.bast/"
    // If Midgard is not running at the root of its host, this is the path to it; otherwise /.
,   "pathPrefix":   "/"
}
```

You then need to run:

    npm run build

(Technically, you only need to run `npm run build-js` as the `config.json` only affects that; but
given how the JS build dominates the build time it makes no difference.)

That's it, you have a working Midgard, ready to be served. ***IMPORTANT NOTE***: whenever you udpate
the code, you need to run the build again. That's because the built version is not under version
control, because it depends on the small configuration.

When developing the code, you absolutely *do not want to run `npm run build` yourself for every
change*. The reason for that is that a full Browserify build can be quite slow. Instead we have a
[Watchify][Watchify]-based command that does incremental building whenever it detects a change. On
my laptop that's the different between insufferable 5 seconds build time and tolerable 0.2s build
time. Just:

    npm run watch

This will build both the CSS and JS/JSX whenever needed.

## Production deployment

You will want a slightly different `config.json` as the Pheme server might be elsewhere (that said
if you're doing pure-client changes nothing keeps you from having the client talk to the live
production Pheme instance).


## The CouchDB Design

Just two design documents are used in CouchDB, they're very simple. They are basic
maps to index the data. You can find them all under `store.js` in `setupDDocs()`. There are:

* users, that can be queried by username;
* events (with one view per filter), queried by date.


## Pheme Code Layout

The server makes use of several files.

### `bin/server.js`

This is the executable. All it does is load up the Pheme library and run it.

### `lib/pheme.js`

This is the main library that binds the rest together.

It sets up the store and server, but the core of its work is to set up the sources correctly based
on the configuration. This involves:

* Loading the source modules that match the configuration.
* Handling them differently depending on whether they declare being push or poll sources.
* Configuring each source instance.
* Exposing the push sources through the web server, and notifying the poll sources that they need to
  poll at their preferred interval.

### `lib/store.js`

This is a very straightforward access point to CouchDB, built atop the [cradle][cradle] library.
When ran directly it creates the DB and sets up the design documents; otherwise it's a library that
can be used to access the content of the DB.

It has simple setup methods that are just used to configure the database. `setupDDocs` can look a
little confusing because it is generating view filters based on what's specified in
`filters/events.js`, but the resulting code is all pretty simple (filtering views on type and
source, and indexing them by date).

It has a few simple methods to access the data that should be self-explanatory.

### `lib/server.js`

A basic set of Express endpoints. It manages sessions, CORS, and logging.

You can get the current user (if logged in) and update her preferences for the filters. The login
endpoint is of some interest: it receives genuine W3C credentials and does a `HEAD` against a
Member and a Team endpoint to determine if the login works and which ACL level to grant the user
(note that at this point there is no content in the DB that isn't public, so this isn't all that
useful). This should probably be replaced by LDAP at some point. You can also logout.

Other endpoints have to do with the event filters. You can list all those that are available (to
use in the configuration dialog); you can get a bunch of recent events for a given filter (right now
there is no paging and it's limited to the more recent 30, but that would be easy to add — there are
comments to that effect in the store code). Finally you can `POST` a JSON object with filter names
as its keys and date specifications for values being the date of the most recent event seen for
that filter. The server will respond with the same keys and for each a number of events more recent
than the given date. The client uses that by tracking which most recent documents have been seen
for each filter, and uses the response to mark the event mailboxes as having new content (the client
polls for that every minute).

### `lib/log.js`

This is a simple wrapper that exposes an already-built instance of [Winston][Winston], configured to
log to the console, file, or both. It's easy to add other logging targets if need be.

### `sources/*`

There are currently two sources, one pull and one push, but it is easy to add more.

All sources must expose a `method` field that is either `push` or `poll` so that Pheme knows how to
handle them. They also must expose a `createSource(conf, pheme)` method that they use to return an
object. It gets the instance-specific configuration and an instance of Pheme.

The object returned for poll sources must have a `poll()` method. It can do whatever it wants (see
the RSS source for an example), and it is expected to use `pheme.store` in order to store the
events it finds.

The object returned for push sources must have a `handle(req, res, next)` method. This behaves
basically like an Express middleware. The source can decline to process it by calling `next()`, and
`req` and `res` are the usual Express request and response objects. The expectation is that the
source knows how to respond to whatever hook calls it. It also uses `pheme.store` to add new events
to the database. See the GitHub source for an example.

### `lib/filters/events.js`

The structure hints that there could be multiple filter types, other than events, even though now
that's all there is. The idea is indeed that at some point there could be other filters on the
dashboard content, for instance for things that aren't events like currently open WBS polls for a
given person.

Right now that module just exports a big map of filters on the events. Each has a key name (which
identifies it across the system), a human `name` and `description`. It must have an `origin` which
maps to what a given source produces as the origin of its events (RSS uses the RSS feed name given
in the configuration so that different RSS feeds have different origins, GitHub uses "github" for
all its content because it makes sense as a source).

Filters with a `github` origin are expected to have an array of repositories that are sources to be
included in the filter.

At this point there is no way to union multiple origins (say, those two GitHub repos and that RSS
feed together) even though it will almost certainly make sense. That's a limitation that relatively
easy to lift just by making the keys accept arrays of filters, and having the view-generation
code generator in `setupDDocs()` handle that.


## Midgard Code Layout

### `index.html`

A very basic bare bones HTML page that loads the style and script.

### `css/midgard.css`

A pretty basic CSS file. It just loads up [normalize][normalize] and [ungrid][ungrid], and then
styles the various controls in a pretty general manner.

There is no magic and no framework. The complete built CSS is ~7K.

### `components/*.jsx`

The JSX files under `components/` are simple, reusable components. At some point they should probably be extracted into a shared library that can be reused across W3C applications.

Most of them are extremely simple and largely there to keep the JSX readable, without having to rely
excessively on `div`s and classes.

#### `application.jsx`

A simple layout wrapper, with a title, that just renders its children. Used to render routed
components into.

#### `col.jsx` and `row.jsx`

Very simple row and column items that use ungrid. Nothing fancy.

#### `spinner.jsx`

This is a simple loading/progress spinner with built-in SVG, no dependencies, and CSS animation so
that when Chrome drops SMIL support this will work. It takes a few options.

#### `flash-list.jsx`

This just renders the list of success/error messages that are stored in the message store.

It has a magical mode, but only the initiated can turn it on.

### `js/midgard.jsx`

This is the entry point for the JS application. Most of what it does is to import things and get
them set up.

It does not do much apart from rendering either a spinner (while loading), a login form (if not
logged in), or the application itself. There is routing support in place, but it is not currently
wired in. Doing so would be relatively easy.

### `stores/*.js` and `actions/*.js`

One architectural approach that works well with React is known as Flux. At its heart it is a simple
idea to handle events and data in an application, in such a manner that avoids tangled-up messes.

The application (typically driven by the user) can trigger an **action**, usually with attached
data. An example from the code are error messages that can be emitted pretty much anywhere in the
application (ditto success messages).

Actions are all sent towards the **dispatcher** (which we reuse from the basic Flux implementation).
The dispatcher makes these available to whoever wants to listen. This is similar to pub/sub, except that an event's full trip is taken into consideration, and it only ever travels in one direction.

Stores listen to actions, and keep any data that the application might need handy (either locally or
by accessing it when needed). For the error/success messages, the store just keeps them around until
they are dismissed, which means that navigation across components will still render the messages in
the store.

Finally, components can listen to changes in stores, and react to them so as to update their
rendering.

This application uses actions and stores relatively extensively but data management could probably
be refactored some to make it a little bit clearer. One promising approach being developed is
Redux; its ideas would seem to match this type of application really well, but I estimated that it
was still too early days to apply that.

#### `actions/messages.js` and `actions/user.js`

These are actions. These modules can just be imported by any component that wishes to carry out such
actions, without having to know anything about whether or how the result gets stored, or how it
might influence the rest of the application (it's completely fire-and-forget).

The `messages.js` action module supports `error()` and `success()` messages, and can `dismiss()` a
given message.

The `user.js` action module supports `login()` and `logout()` actions corresponding to what the user
does, it can `loadUser()` to get the user's information (after login has completed), and can
manipulate the filters that the user has configured using `addFilter()` and `removeFilter()`.

#### `stores/login.js` and `stores/message.js`

The `login` store keeps information about whether the user is logged in, what their information is,
and handles the logging out when requested. The `message` store keeps a list of error and success
messages that haven't been dismissed.

#### `actions/mailbox.js`, `actions/last-seen.js` and `actions/configuration.js`

These actions will select a filter mailbox (which enables various parts of the app to stay in sync
with that), trigger the loading of the configuration (currently just the list of filters the server
has available), and `last-seen.js` can both indicate the date of the last message seen in a box and
initiate polling for updates to mailbox filters.

#### `store/mailbox.js`, `store/last-seen.js`, `store/configuration.js`, and `store/filter.js`

The configuration store just lists the filters available on the server. If the server's list
changes, the application currently needs to be reloaded. This could be changed (but it's not a very
frequent situation).

The last-seen store handles polling the server regularly by sending it a map of the most recently
seen message in a filter mailbox (which it tracks) and receiving a count of new events since each
of those dates. The date structure is an array that is basically (where `d` is a date):

```js
[
  d.getUTCFullYear()
, d.getUTCMonth() + 1
, d.getUTCDate()
, d.getUTCHours()
, d.getUTCMinutes()
, d.getUTCSeconds()
, d.getUTCMilliseconds()
]
```

The reason for this unusual structure (apart from the fact that JSON doesn't do dates) is that it is
the same structure used as key for the event views in CouchDB. The advantage is that it allows for
other queries, for instance `[2015, 3, 15]` will match everything on March 15, 2015 irrespective of
the rest.

By default last-seen polls every minute. This could be made configurable.

The mailbox store just stores the current mailbox. It is a very good example of why there is
currently too much boilerplate in stores that could be extracted relatively easily.

The filter store keeps track of the user's preference in terms of which filters she wants to have
active as mailboxes. The data is stored on the server so as to persist across devices, but it's
handled not through saving the user object directly (which could be problematic given that such
objects tend to have ACL information and the such) but by talking to a special endpoint that just
enables saving the filters. They are saved immediately with every edit, it's fast enough for that.

### The `js/*.jsx` components

These are non-reusable components that are specific to this applications.

#### `login.jsx`

A simple component that displays a login form and triggers an action to log in.

#### `logout-button.jsx`

A button that can be used (and reused) anywhere (in our case, it's part of the navigation). When
clicked it dispatches a `logout` action.

#### `toolbar.jsx`

A simple component that lists the actions available from the toolbar, and handles toggling the
visibility of the setting.

#### `filter-toggle.jsx`

A small component that is instantiated with an available filter description and knows how to toggle
it by dispatching add/remove actions.

#### `filter-list.jsx`

Shows the list of filter mailboxes that the user has configured, reacting to changes in that
configuration. It also manages picking which one is actually selected, and stores that information
locally so that reloading returns to the same place.

#### `filter-selector.jsx`

Essentially a button and/or tab that can be clicked to select a filter mailbox, sitting in the list
of filters. It also knows how to render the unread count.

#### `event-list.jsx`

The list of events for the selected mailbox. It simply tracks changes to the currently selected
mailbox and fetches the events that match it. It will use different rendering for different types of
events. RSS rendering is built-in (though it could be farmed out); GitHub rendering is complex
enough to justify its own component.

#### `show-github.jsx`

A component that knows how to render a GitHub-related event. This gets relatively convoluted because
there are many different types of those.

One important aspect of this component is `remoteRenderURL()`. Upon instantiation, for certain types
of events, it will actually contact GitHub's API in order to obtain an HTML rendering of the content
of the event. This is typically true of any event that can include Markdown — we don't want to
render that ourselves.

The actual rendering is basically a big bunch of if branches that depend on event type and possibly
other information bits to pick the right rendering for a given event.

It is known at this time that not all events have rendering. If you see a JSON dump, that's where
it's coming from. Adding the rendering for a new event type is easy.

## Suggested Improvements

The Flux usage was grown rather than architected. It could use a bit of fine-tuning now that the
application has taken shape. Also, it's worth looking at Redux.

The components and much of the style can probably be extracted so that that can be reused in other
W3C applications (see what's similar with Ash-Nazg, noting that the component may have been
tweaked between the two).

[CouchDB]: http://couchdb.apache.org/
[Express]: http://expressjs.com/
[Pheme]: https://github.com/w3c/pheme
[Midgard]: https://github.com/w3c/midgard
[React]: https://facebook.github.io/react/docs/getting-started.html
[Flux]: http://facebook.github.io/flux/
[Browserify]: http://browserify.org/
[JSX]: https://facebook.github.io/react/docs/displaying-data.html
[cleancss]: https://github.com/jakubpawlowicz/clean-css
[nodemon]: https://github.com/remy/nodemon
[ngrok]: https://ngrok.com/
[pm2]: https://github.com/Unitech/pm2
[Watchify]: https://github.com/substack/watchify
[cradle]: https://github.com/flatiron/cradle
[Winston]: http://github.com/flatiron/winston
[normalize]: http://necolas.github.com/normalize.css/
[ungrid]: http://chrisnager.github.io/ungrid/
