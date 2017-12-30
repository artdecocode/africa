const assert = require('assert')
const context = require('../context/')
const africa = require('../../src/')

const africaTestSuite = {
    context,
    'should be a function': () => {
        assert.equal(typeof africa, 'function')
    },
    'should call package without error': () => {
        assert.doesNotThrow(() => {
            africa()
        })
    },
}

module.exports = africaTestSuite
