# CSH Alumni Map

Visualizing the diaspora of CSHers out of Rochester, NY.

## `index.php`

The "loader" page to deploy to CSH systems. Pulls in the deployed JS and CSS and initializes the app.

## Client

A static BackboneJS app. Relies on a consuming page (i.e. `index.php`) to provide Webauth info (e.g. uid).

See [client/README.md](client/README.md).

## Server

A JSON API written in Express, backed by a MySQL database.

See [server/README.md](server/README.md).

## Contributing

Fork. Clone. Code. Test. PR. +1. Merge.
