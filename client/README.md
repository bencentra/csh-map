# csh-map-ui

Static BackboneJS UI app for the CSH Alumni Map.

Written in ES6, transpiled with Babel, and bundled with Browserify.

## Installation

```bash
cd client
npm install -g grunt-cli
npm install
```

## What's Here

* `demo/` - Demo loader app
* `dist/` - Transpiled, bundled and minfied source code
* `spec/` - Jasmine unit tests
* `src/` - Backbone app source code

## Developing

Use the following npm scripts during development:

### `npm start`

Used during development to:
* Build the unminified JS and move it to `dist/`
* Copy the CSS from `src/` to `dist/`
* Run unit tests
* __Watch for changes to `src/` and repeat this process__

### `npm run demo`

Used during development to start a local server serving the demo app (see `demo/`).

The demo app requires the API to be running (see the server's README).

### `npm run lint`

Used during development to run code linting.

Extends [Airbnb's eslint config](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb), based on their [detailed styleguide](https://github.com/airbnb/javascript).

### `npm run build`

Used before deploying to:
* Build the minified JS and move it to `dist/`
* Copy the CSS from `src/` to `dist/`
* Run unit tests

### `npm test`

Used before deploying to:
* Run unit tests
