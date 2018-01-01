const { resolve } = require('path')
const { readJSON, writeJSON, erase, createWritable } = require('wrote')
const { homedir } = require('os')
const { fork } = require('child_process')
const { Readable } = require('stream')

const FIXTURES_PATH = resolve(__dirname, '../fixtures')

/**
 * The context will read the .test-africarc file from fixtures and write it to
 * ~/.test-africarc, and erase it upon finishing the test.
 */
async function Context () {
    this.packageName = 'test-africa'
    this.fixturesPath = FIXTURES_PATH
    this.fixturesRcPath = resolve(FIXTURES_PATH, `.${this.packageName}rc`)

    this.json = await readJSON(this.fixturesRcPath) // can cache read (e.g., with second param)

    const path = resolve(homedir(), `.${this.packageName}rc`)
    await writeJSON(path, this.json, { space: 2 })

    this.eraseRc = async () => {
        const ws2 = await createWritable(path)
        await erase(ws2)
    }
    this.readRc = async () => {
        const res = await readJSON(path)
        return res
    }
    this.fork = async (packageName, questions, answers = []) => {
        const testModule = resolve(__dirname, '../fixtures/test')
        const proc = fork(testModule, [], {
            stdio: 'pipe',
        })
        proc.send({ packageName, questions })

        // proc.stdout.pipe(process.stdout)
        // proc.stderr.pipe(process.stdout)

        this.proc = proc

        await new Promise((resolve, reject) => {
            const r = new Readable({
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

            r.pipe(proc.stdin)

            proc.on('error', reject)
            proc.on('exit', resolve)
        })
        delete this.proc
    }

    this._destroy = async () => {
        await this.eraseRc()
        if (this.proc) {
            this.proc.kill()
            await new Promise((resolve) => {
                this.proc.on('exit', resolve)
            })
        }
    }
}

module.exports = Context
