(function () {

  /*
   * Module store and
   * instance cache
   */
  var modules = {}
    , instances = {}

  /*
   * Require a module
   */
  function require(path) {

    var resolved = require.resolve(path)

    if (typeof modules[resolved] === 'undefined') {
      throw new Error('Module `' + path + '` is not defined')
    }

    // Run the module function
    // if it's not been run yet
    if (!instances[path]) {

      // Create the exports
      // to pass to the function
      var m = { exports: {} }

      // Execute the module function in
      // the context of an empty object
      // to sandbox local variables
      modules[resolved].apply({}, [m, m.exports, require.relative(resolved)])

      // Cache the exports
      instances[resolved] = m.exports

    }

    // Return the cached exports
    return instances[resolved]

  }

  require.resolve = function(path) {
    var orig = path
      , filename = path + '.js'
      , index = path + '/index.js'
    return modules[filename] && filename
      || modules[index] && index
      || orig
  }

  require.relative = function(parent) {
    return function(p){
      if ('.' !== p.charAt(0)) return require(p)

      var path = parent.split('/')
        , segs = p.split('/')
      path.pop()

      for (var i = 0; i < segs.length; i++) {
        var seg = segs[i]
        if ('..' === seg) {
          path.pop()
        } else if ('.' !== seg) {
          path.push(seg)
        }
      }
      return require(path.join('/'))
    }
  }

  /*
   * Define a module
   */
  require.register = function (path, fn) {

    if (typeof modules[path] !== 'undefined') {
      throw new Error('Module `' + path + '` is already defined')
    }

    modules[path] = fn
    return;

  }


  // Expose on the window object
  window.require = require
  // Compatibility with older module.js versions
  window.module = require.register

}())