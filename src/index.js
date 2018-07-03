import { resolve } from 'path'
import { homedir as home } from 'os'
import bosom from 'bosom'
import { exists, askQuestionsAndWrite } from './lib'

/**
 * Read package configuration from the home directory, or ask questions with
 * readline interface to create a new configuration in `~/.${packageName}rc`
 * @param {string} packageName the name of the package
 * @param {Questions} questions an object with questions to be passed to reloquent
 * @param {AfricaConfig} [config] configuration object
 * @param {boolean} [config.force=false] Force asking questions and re-writing config. Default false.
 * @param {string} [config.homedir] Path to the home directory.
 * @param {string} [config.questionsTimeout] How log to wait before timing out. Will wait forever by default.
 * @param {string} [config.local] Look up for the `.rc` file in the current directory first, and use homedir if not found. When initialising, the local file will be created and default values for questions read from the home `.rc` if exists.. Default `false`.
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
    local = false,
    questionsTimeout,
  } = config

  const rc = rcNameFunction(packageName)
  const path = resolve(homedir, rc)

  const homeEx = await exists(path)

  if (local) {
    const localPath = resolve(rc)
    const localEx = await exists(localPath)
    const c = await handleLocal(homeEx, localEx, path, localPath, questions, questionsTimeout, force)
    return c
  }

  const c = await handleHome(homeEx, path, questions, questionsTimeout, force)
  return c
}

const handleHome = async (homeEx, path, questions, questionsTimeout, force) => {
  if (!homeEx) {
    const conf = await askQuestionsAndWrite(questions, path, questionsTimeout)
    return conf
  }
  const p = await getParsed(path, questions, force, questionsTimeout)
  return p
}

const getParsed = async (path, questions, force, questionsTimeout) => {
  const parsed = await bosom(path)
  if (force) {
    const c = await forceQuestions(questions, path, parsed, questionsTimeout)
    return c
  }
  return parsed
}

const handleLocal = async (homeEx, localEx, path, localPath, questions, questionsTimeout, force) => {
  if (!localEx) {
    const h = homeEx ? await bosom(path) : {}
    const conf = await forceQuestions(questions, localPath, h, questionsTimeout)
    return conf
  }
  const p = await getParsed(localPath, questions, force, questionsTimeout)
  return p
}

const forceQuestions = async (questions, path, config, questionsTimeout) => {
  const q = extendQuestions(questions, config)
  const conf = await askQuestionsAndWrite(q, path, questionsTimeout)
  return conf
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


/**
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
 * @property {number} [questionsTimeout] How log to wait before timing out. Will wait forever by default.
 * @property {(s: string) => string} [rcNameFunction] Function used to generate the rc name, e.g., packageName => `.${packageName}rc`.
 * @property {string} [config.local] Look up for the `.rc` file in the current directory first, and use homedir if not found. When initialising, the local file will be created and default values for questions read from the home `.rc` if exists.. Default `false`.
 */
