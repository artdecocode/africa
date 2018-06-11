import { throws, deepEqual, equal } from 'zoroaster/assert'
import Context from '../context'
import africa from '../../src'

/** @type {Object.<string, (c: Context)} */
const T = {
  context: Context,
  'is a function'() {
    equal(typeof africa, 'function')
  },
  async 'throws an error if package name is not passed'() {
    await throws({ fn: africa, message: 'Package name is required.' })
  },
  async 'reads rc by package name from home directory'(
    { packageName, json }
  ) {
    const res = await africa(packageName)
    deepEqual(res, json)
  },
  async 'reads correctly from specified home directory'(
    { packageName, json, fixturesPath }
  ) {
    const res = await africa(packageName, { homedir: fixturesPath })
    deepEqual(res, json)
  },
  async 'writes answers to the rc'({ packageName, eraseRc, readRc, fork }) {
    await eraseRc()
    const questions = {
      name: {
        text: 'name',
      },
      org: {
        text: 'organisation',
      },
    }
    const q = await fork(packageName, questions, ['test-name', 'test-org'])

    const res = await readRc()
    deepEqual(res, {
      name: 'test-name',
      org: 'test-org',
    })
    deepEqual(q, [
      'name: ',
      'organisation: ',
    ])
  },
}

export default T
