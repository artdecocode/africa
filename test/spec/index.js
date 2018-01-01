const { throws, deepEqual, equal } = require('zoroaster/assert')
const context = require('../context/')
const africa = require('../..')

const africaTestSuite = {
    context,
    'should be a function'() {
        equal(typeof africa, 'function')
    },
    async 'should throw an error if package name is not passed'() {
        await throws({ fn: africa, message: 'Package name is required.' })
    },
    async 'should read rc by package name from home directory'(
        { packageName, json }
    ) {
        const res = await africa(packageName)
        deepEqual(res, json)
    },
    async 'should read correctly from specified home directory'(
        { packageName, json, fixturesPath }
    ) {
        const res = await africa(packageName, { homedir: fixturesPath })
        deepEqual(res, json)
    },
    async 'should write answers to the rc'({ packageName, eraseRc, readRc, fork }) {
        await eraseRc()
        const questions = {
            name: {
                text: 'name',
            },
            org: {
                text: 'organisation',
            },
        }
        await fork(packageName, questions, ['test-name', 'test-org'])

        const res = await readRc()
        deepEqual(res, {
            name: 'test-name',
            org: 'test-org',
        })
    },
}

module.exports = africaTestSuite
