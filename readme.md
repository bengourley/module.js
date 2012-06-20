# module.js
A lightweight, node-style module system for the browser.

In my humble opinion:
- [require.js](https://github.com/jrburke/requirejs) does too much and makes your code unweildy
- [browserify](https://github.com/substack/node-browserify) is magic (and experimental)

But you should be able to organise your client-side code in to small modules without having to communicate via the global namespace.

## API

The API is purposefully *very* simple. Including `module.js` on your page exposes two global functions: `module(name, fn)` and `require(name)`.

### module(name, fn)

Define a module by giving it a name (string) and a function. The function will be called with a single argument which looks like this: `{ exports: {} }`.

You should label this object `module` if you want your code to feel like node.js modules: `module('name', function (module) { ... })`. Note that in node, you can attach things to `exports`. You **can't** do that with `module` – for consistency and simplicity only `module.exports` can be used.

### require(name)

Require a module by calling require with its name (a string). `require()` returns the result of the `module.exports` object after running the module's function. Note that the order in which modules are included on the page does not matter, as long as `module.js` comes first and the 'entry point' is the last thing to run. Once a module's function has been run, the result is stored, and subsequent `require`s return the stored value.

## Usage:

HTML:

```html
<!-- Make sure module.js is loaded before any scripts that are modules -->
<script src='module.js'></script>
<script src='b.js'></script>
<script src='a.js'></script>
<script src='app.js'></script>
```

*NOTE*: for production, you should use a build step or some middleware to concatenate and minify the scripts. We use [compact](http://github.com/serby/compact).

a.js:

```js
module('a', function (module) {

  // Within this function (just like in node)
  // only the things you attach to module.exports
  // will be available when this module is required.

  module.exports = 'I am module A'

})
```

b.js:

```js
module('b', function (module) {

  // Require module 'a'
  // Note that in the HTML, this module
  // comes before module a, illustrating that
  // the order is irrelevant
  var a = require('a')

  // Assign a property to the module.exports object
  module.exports.pretendToBeA = function () {
    return a
  }

})
```

app.js:

```js
(function () {

  // This is the entry point for the app.
  // Make sure all the modules that you will
  // require are included on the page by this point
  var b = require('b')

  b.pretendToBeA()
  //-> 'I am module A'

}())
```

## Tests
To be added shortly.

## Known issues
A caveat of caching the results of each `require` is that the object can be modified after it has been required – affecting subsequent requires. Generally modifying an object that has been `require`d doesn't happen, but I want to resolve this edge case. However, a simple object clone will not do - what if the object has some prototypical inheritance going on?

**Addendum:** I have just tried this in Node, and it has this same behaviour. You can, however, purge things from the cache in Node with require.cache, so perhaps it's worthwhile doing that?

## Licence
Author: [Ben Gourley](mailto:bn@grly.me). Licenced under the [New BSD License](http://opensource.org/licenses/bsd-license.php)