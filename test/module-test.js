// Expose BDD verbs
window.buster.spec.expose();

var describe = window.describe
  , it = window.it
  , expect = window.expect

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

    window.module('a', function (module) {
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
    }).toThrow('Error')

  })

})

describe('loading a module', function () {

  it('raises an error message when module of ' +
      'the given name doesn\'t exist', function () {

    expect(function () {
      window.require('z')
    }).toThrow('Error')

  })

})