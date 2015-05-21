# Midgard

A dashboard for the dwellers of our world.

## Architecture

These are rough notes, they may not completely reflect reality. The core inspiration for this
approach is essentially described in [Straightening our Backbone: A lesson in event-driven UI
development](https://code.mixpanel.com/2015/04/08/straightening-our-backbone-a-lesson-in-event-driven-ui-development/).

`Midgard` (in `js/midgard.js`) performs overall initialisation and instantiation, it wires things
together. But that's about it: when initialisation is done, it pretty much doesn't do anything
anymore.

`LayoutView` (in `js/layout-view.js`) serves as the orchestrator. It sets up its subviews and wires
events between all the relevant parts. A lot of its work is in setting up widgets.

`WidgetView` (in `js/widget-view.js`) is a base class for all widgets (all of which are under `widgets`). It serves as a registration point and factory. Widgets are registered in `Midgard`.


