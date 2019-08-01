import { deepEqual } from '@zoroaster/assert'
import Context from '../context'

/** @type {Object.<string, (c: Context)} */
const T = {
  context: Context,
  async 'can override answers to the rc with same answers'({
    questions, extendPackageName, fixturesPath, readPackageRc, fork, json,
  }) {
    const { questions: q, result } = await fork(extendPackageName, questions, ['', ''], {
      homedir: fixturesPath,
      force: true,
    })

    const res = await readPackageRc(extendPackageName)
    deepEqual(res, json)
    deepEqual(result, json)
    const { name, org } = json
    deepEqual(q, [
      `name: [${name}] `,
      `organisation: [${org}] `,
    ])
  },
  async 'can override answers to the rc with new answers'({
    questions, extendPackageName, fixturesPath, readPackageRc, fork, json: { name, org },
  }) {
    const extended = {
      name: `new-${name}`,
      org: `new-${org}`,
    }

    const { questions: q, result } = await fork(extendPackageName, questions, [extended.name, extended.org], {
      homedir: fixturesPath,
      force: true,
    })

    const res = await readPackageRc(extendPackageName)
    deepEqual(res, extended)
    deepEqual(result, extended)
    deepEqual(q, [
      `name: [${name}] `,
      `organisation: [${org}] `,
    ])
  },
  async 'can override a single answer to the rc'({
    questions, extendPackageName, fixturesPath, readPackageRc, fork, json: { name, org },
  }) {
    const extendedName = `new-${name}`

    const { questions: q, result } = await fork(extendPackageName, questions, [extendedName, ''], {
      homedir: fixturesPath,
      force: true,
    })

    const res = await readPackageRc(extendPackageName)
    deepEqual(res, {
      org,
      name: extendedName,
    })
    deepEqual(result, {
      org,
      name: extendedName,
    })
    deepEqual(q, [
      `name: [${name}] `,
      `organisation: [${org}] `,
    ])
  },
  async 'overrides defaultValue with getDefault'({
    questions, extendPackageName, fixturesPath, readPackageRc, fork, json: { name, org },
  }) {
    const getDefault = 'default-value'
    questions.name = {
      ...questions.name,
      getDefault,
    }

    const { questions: q, result } = await fork(extendPackageName, questions, ['', ''], {
      homedir: fixturesPath,
      force: true,
    })

    const res = await readPackageRc(extendPackageName)
    deepEqual(res, {
      org,
      name: getDefault,
    })
    deepEqual(result, {
      org,
      name: getDefault,
    })
    deepEqual(q, [
      `name: [\u001b[90m${name}\u001b[0m] [${getDefault}] `,
      `organisation: [${org}] `,
    ])
  },
  async 'sets a value when none exist'({
    questions, extendPackageName, fixturesPath, readPackageRc, fork, json: { name, org },
  }) {
    const city = {
      text: 'city',
    }
    const answer = 'New York City'
    const { questions: q, result } = await fork(extendPackageName, {
      ...questions,
      city,
    }, ['', '', answer], {
      homedir: fixturesPath,
      force: true,
    })

    const res = await readPackageRc(extendPackageName)
    deepEqual(res, {
      org,
      name,
      city: answer,
    })
    deepEqual(result, {
      org,
      name,
      city: answer,
    })
    deepEqual(q, [
      `name: [${name}] `,
      `organisation: [${org}] `,
      'city: ',
    ])
  },
}

export default T
