import { resolve } from 'path'
import { homedir as home } from 'os'
import ask from 'reloquent'
import bosom from 'bosom'
import { stat } from 'fs'

const exists = async (path) => {
  const res = await new Promise((r, j) => {
    stat(path, (err) => {
      if (err && err.code == 'ENOENT') {
        r(false)
      } else if (err) {
        j(err)
      } else {
        r(true)
      }
    })
  })
  return res
}

/**
 * @attach reloquent
 * @typedef {Object} Question
 * @property {string} text A text to show to the user.
 * @property {string} [defaultValue] A default answer to the question.
 * @property {function} [getDefault] A function which will get the default value, possibly asynchronously.
 * @property {function} [validation] A validation function which should throw on error.
 * @property {(s: string) => string} [postProcess] A transformation function for the answer.
 *
 * @typedef {Object.<string, Question>} Questions
 *
 * @typedef {Object} AfricaConfig
 * @property {boolean} [force=false] Force asking questions and re-writing config. Default false.
 * @property {string} [homedir] Path to the home directory.
 * @property {string} [defaultValue] A default answer to the question.
 * @property {number} [questionsTimeout] How log to wait before timing out. Will wait forever by default.
 * @property {(s: string) => string} [rcNameFunction] Function used to generate the rc name, e.g., packageName => `.${packageName}rc`,
 */


async function askQuestionsAndWrite(questions, path) {
  const answers = await ask(questions)
  await bosom(path, answers, { space: 2 })
  return answers
}

/**
 * Read package configuration from the home directory, or ask questions with
 * readline interface to create a new configuration in `~/.${packageName}rc`
 * @param {string} packageName the name of the package
 * @param {Questions} questions an object with questions to be passed to reloquent
 * @param {AfricaConfig} [config] configuration object
 * @param {boolean} [config.force=false] Force asking questions and re-writing config. Default false.
 * @param {string} [config.homedir] Path to the home directory.
 * @param {string} [config.defaultValue] A default answer to the question.
 * @param {string} [config.questionsTimeout] How log to wait before timing out. Will wait forever by default.
 * @param {(s: string) => string} [config.rcNameFunction] Function used to generate the rc name
 */
export default async function africa(packageName, questions = {}, config = {}) {
  if (typeof packageName != 'string') {
    throw new Error('Package name is required.')
  }
  const {
    homedir = home(),
    rcNameFunction = p => `.${p}rc`,
    force = false,
  } = config

  const rc = rcNameFunction(packageName)
  const path = resolve(homedir, rc)

  const ex = await exists(path)
  if (!ex) {
    const conf = await askQuestionsAndWrite(questions, path)
    return conf
  }
  const parsed = await bosom(path)
  if (force) {
    const q = extendQuestions(questions, parsed)
    const conf = await askQuestionsAndWrite(q, path)
    return conf
  }
  return parsed
}

/**
 *
 * @param {Questions} questions A set of questions to extend with default value from the existing config.
 * @param {object} current Current configuration object.
 * @returns {Questions} Questions with updated defaultValue where answers were present in the passed config object.
 */
const extendQuestions = (questions, current) => {
  const q = Object.keys(questions).reduce((acc, key) => {
    const question = questions[key]
    const defaultValue = current[key]
    const value = {
      ...question,
      ...(defaultValue ? { defaultValue } : {}),
    }

    return {
      ...acc,
      [key]: value,
    }
  }, {})
  return q
}
