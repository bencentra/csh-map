# CSH Alumni Map

Visualizing the diaspora of CSHers out of Rochester, NY using the [Google Maps API](https://developers.google.com/maps/documentation/javascript/).

Members of [Computer Science House](http://csh.rit.edu/) can see the map here: https://members.csh.rit.edu/~bencentra/alumni-map/

## `index.php`

The "loader" page to deploy to CSH systems. Pulls in the deployed JS and CSS and initializes the app with required Webauth values (`uid` and `cn`).

## Client

A static BackboneJS app. Relies on a consuming page (`index.php`) to provide Webauth info.

See [client/README.md](client/README.md).

## Server

A JSON API written in Express, backed by a MySQL database.

See [server/README.md](server/README.md).

## Contributing

Fork. Clone. Code. Test. PR. +1. Merge.

## Project History

_For future CSHers maintaining this project:_

I initially wrote this in 2014, just after graduating from RIT. It worked, but it became [a mess](https://github.com/bencentra/csh-map/tree/138b335f91df921b8deb67c618475ebe5c5ba915) of crappy PHP and unorganized JavaScript.

In late 2015, after joining an all-JavaScript team at Constant Contact, I decided I needed some practice with Backbone and ES2015. I also wanted to try out Node and Express. This project seemed like the perfect fit.

In addition to learning new frameworks and syntax, I wanted to treat this project like a "real-world" web app - maintainable code, linting, unit tests, Gruntfiles, the whole deal. I think I mostly succeeded.

In late 2016, after many long breaks, I finally achieved feature parity with the original (minus some unnecessary admin stuff). As such, I'm calling it "done." I'll still maintain it - I am hosting [the backend API](https://bencentra.com/csh-map/api/v1/) myself - but I hope to get current CSHers to contribute if any big feature requests come up.

Cheers,

- Ben

P.S. - Unlike the first version, the rewrite tracks each time a user changes their location on the map. The client doesn't show it, but the data is available for people to use in other projects!
