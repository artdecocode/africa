const { resolve } = require('path')
const { readJSON, writeJSON, exists } = require('wrote')
const { homedir: home } = require('os')
const { askQuestions } = require('reloquent')

async function askQuestionsAndWrite(questions, path) {
    const answers = await askQuestions(questions)
    await writeJSON(path, answers, { space: 2 })
    return answers
}

/**
 * Read package configuration from the home directory, or ask questions with
 * readline interface to create a new configuration in `~/.${packageName}rc`
 * @param {string} packageName the name of the package
 * @param {object} questions an object with questions to be passed to reloquent
 * @param {object} config configuration object
 * @param {string} [config.force] Force asking questions and re-writing config
 * @param {string} [config.homedir] path to the home directory
 * @param {string} [config.questionsTimeout] how log to wait before timing out
 * @param {string} [config.rcNameFunction] Function used to generate the rc name
 */
async function africa(packageName, questions = {}, config = {}) {
    if (typeof packageName != 'string') {
        throw new Error('Package name is required.')
    }
    const {
        homedir = home(),
        rcNameFunction = packageName => `.${packageName}rc`,
        force = false,
    } = config

    const rc = rcNameFunction(packageName)
    const path = resolve(homedir, rc)

    const ex = await exists(path)
    if (!ex || force) {
        const conf = await askQuestionsAndWrite(questions, path)
        return conf
    }
    const parsed = await readJSON(path)
    return parsed
}

module.exports = africa
