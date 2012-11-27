window.buster.spec.expose();

describe('existence', function () {

  it('creates the function `window.module`', function () {
    expect(window.module).toBeFunction()
  })

  it('creates the function `window.require`', function () {
    expect(window.require).toBeFunction()
  })

})

describe('creating a module', function () {

  it('enables a module to be required', function () {

    require.register('a', function (module) {
      module.exports = 'I am a module'
    })

    var a = require('a')
    expect(a).toEqual('I am a module')

  })

  it('raises an error message when module of ' +
      'the same name already exists', function () {

    window.module('b', function (module) {
      module.exports = 'I am a module'
    })

    expect(function () {
      window.module('b', function (module) {
        module.exports = 'I am also a module'
      })
    }).toThrow()

  })

})

describe('loading a module absolutely', function () {

  it('raises an error message when module of ' +
      'the given name doesn\'t exist', function () {

    expect(function () {
      window.require('z')
    }).toThrow()

  })

})

describe('loading a module relatively', function () {

  it('', function () {

    window.require.register('baz.js', function (module, exports, require) {
      module.exports = 'baz'
    })

    window.require.register('foo/a.js', function (module, exports, require) {
      exports.foo = 10
    })

    window.require.register('foo/b.js', function (module, exports, require) {
      expect(require('./a').foo).toEqual(10)
      expect(require('../baz')).toEqual('baz')
    })

    window.require('foo/b')
  })

})