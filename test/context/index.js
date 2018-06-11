import { resolve as r } from 'path'
import { readJSON, writeJSON, erase, createWritable } from 'wrote'
import { homedir } from 'os'
import { spawn } from 'child_process'
import { Readable } from 'stream'

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
    async fork(packageName, questions, answers = []) {
        const testModule = r(__dirname, '../fixtures/test')
        const proc = spawn(process.execPath, [testModule], {
            stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
        })
        proc.send({ packageName, questions })

        // proc.stdout.pipe(process.stdout)
        // proc.stderr.pipe(process.stdout)

        this.proc = proc

        await new Promise((resolve, reject) => {
            const re = new Readable({
                read() {
                    proc.stdout.on('data', () => {
                        if (!answers.length) {
                            this.push(null)
                        } else {
                            const answer = answers.shift()
                            this.push(`${answer}\n`)
                        }
                    })
                },
            })

            re.pipe(proc.stdin)

            proc.on('error', reject)
            proc.on('exit', resolve)
        })
        delete this.proc
    }

    async _destroy() {
        await this.eraseRc()
        if (this.proc) {
            this.proc.kill()
            await new Promise((resolve) => {
                this.proc.on('exit', resolve)
            })
        }
    }
}
