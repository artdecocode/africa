import { resolve as r } from 'path'
import { readJSON, writeJSON, erase, createWritable } from 'wrote'
import { homedir } from 'os'
import { Readable } from 'stream'
import { fork } from 'spawncommand'

const FIXTURES_PATH = r(__dirname, '../fixtures')

/**
 * The context will read the .test-africarc file from fixtures and write it to
 * ~/.test-africarc, and erase it upon finishing the test.
 */
export default class Context {
  async _init() {
    this._json = await readJSON(this.fixturesRcPath) // can cache read (e.g., with second param)
    this._path = r(homedir(), `.${this.packageName}rc`)
    await writeJSON(this.path, this.json, { space: 2 })
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
   * @returns {string}[] Questions asked via stdout.
   */
  async fork(packageName, questions, answers = []) {
    const mod = r(__dirname, this.fixtureModule)
    const proc = fork(mod, [], {
      stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
      execArgv: [],
    })
    proc.send({ packageName, questions })

    // proc.stdout.pipe(process.stdout)
    // proc.stderr.pipe(process.stdout)

    this.proc = proc
    const q = []

    const re = new Readable({
      read() {
        proc.stdout.on('data', (data) => {
          if (!answers.length) {
            this.push(null)
          } else {
            q.push(`${data}`)
            const answer = answers.shift()
            this.push(`${answer}\n`)
          }
        })
      },
    })

    re.pipe(proc.stdin)
    const { stderr, code } = await proc.promise
    if (code) throw new Error(stderr)
    return q
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
