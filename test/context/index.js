import { deepEqual } from 'zoroaster/assert'
import { resolve as r } from 'path'
import { readJSON, writeJSON, erase, createWritable } from 'wrote'
import { homedir as h } from 'os'
import { Readable } from 'stream'
import { fork } from 'spawncommand'
import { debuglog } from 'util'

const LOG = debuglog('africa')

const FIXTURES_PATH = r(__dirname, '../fixtures')

/**
 * @typedef {Object} ForkResult
 * @property {string[]} questions Questions presented in the stdout.
 * @property {object} result The return of the program.
 */

/**
 * The context will read the .test-africarc file from fixtures and write it to
 * ~/.test-africarc, and erase it upon finishing the test.
 */
export default class Context {
  async _init() {
    this._json = await readJSON(this.fixturesRcPath) // can cache read (e.g., with second param)
    deepEqual(this._json, {
      name: 'test-name',
      org: 'test-org',
    })
    this._path = r(h(), `.${this.packageName}rc`)
    this._extendPath = r(FIXTURES_PATH, `.${this.extendPackageName}rc`)
    await writeJSON(this.path, this.json, { space: 2 })
    await writeJSON(this.extendPath, this.json, { space: 2 })
  }
  get extendPath() {
    return this._extendPath
  }
  get path() {
    return this._path
  }
  get json() {
    return this._json
  }
  get packageName() {
    return 'test-africa'
  }
  get extendPackageName() {
    return `extend-${this.packageName}`
  }
  get fixturesPath() {
    return FIXTURES_PATH
  }
  get fixturesRcPath() {
    return r(FIXTURES_PATH, `.${this.packageName}rc`)
  }
  async eraseRc() {
    const ws2 = await createWritable(this.path)
    await erase(ws2)
  }
  async readPackageRc(packageName) {
    const res = await readJSON(r(FIXTURES_PATH, `.${packageName}rc`))
    return res
  }
  async readRc() {
    const res = await readJSON(this.path)
    return res
  }
  /**
   * A module which can be used to spawn africa via a fork.
   */
  get fixtureModule() {
    return '../fixtures/register.js'
    // return process.env.BABEL_ENV == 'test-build' ? '../fixtures' : '../fixtures/register.js'
  }


  /**
   * Fork a Node.js process to execute africa in a clean environment. The method will answer questions with provided answers automatically.
   * @param {string} packageName Name of the package to run africa against.
   * @param {Object} questions An object with questions
   * @param {Object} answers An object with answers.
   * @param {Object} [config] Config to pass to africa.
   * @returns {ForkResult>} Questions asked via stdout.
   */
  async fork(packageName, questions, answers = [], config) {
    const mod = r(__dirname, this.fixtureModule)
    const proc = fork(mod, [], {
      stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
      execArgv: [
        // '--inspect-brk=9229',
      ],
    })
    proc.send({ packageName, questions, config })
    const messages = []
    proc.on('message', (message) => {
      messages.push(message)
    })

    const q = []
    proc.stdout.on('data', (data) => {
      const d = `${data}`
      q.push(d)
      LOG(d)
    })
    proc.stderr.on('data', (data) => {
      const d = `${data}`
      LOG(d)
    })

    this.proc = proc

    const re = new Readable({
      read() {
        proc.stdout.on('data', () => {
          if (!answers.length) {
            this.push(null)
          } else {
            // const d = `${data}`
            // q.push(d)
            const answer = answers.shift()
            this.push(`${answer}\n`)
          }
        })
      },
    })

    re.pipe(proc.stdin)
    const { stderr, code } = await proc.promise
    if (code) throw new Error(stderr)
    const [result] = messages
    return { questions: q, result }
  }

  get questions() {
    const questions = {
      name: {
        text: 'name',
      },
      org: {
        text: 'organisation',
      },
    }
    return questions
  }
  async _destroy() {
    await this.eraseRc()
    if (this.proc && this.proc.connected) {
      this.proc.kill()
      await new Promise((resolve) => {
        this.proc.on('exit', resolve)
      })
    }
  }
}
