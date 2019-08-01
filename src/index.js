import { resolve } from 'path'
import { homedir as home } from 'os'
import bosom from 'bosom'
import { exists, askQuestionsAndWrite } from './lib'

/**
 * Read package configuration from the home directory, or ask questions with
 * readline interface to create a new configuration in `~/.${packageName}rc`
 * @param {string} packageName The name of the package.
 * @param {!_reloquent.Questions} questions An object with questions to be passed to reloquent.
 * @param {!_africa.Config} [config] Configuration object.
 */
export default async function africa(packageName, questions = {}, config = {}) {
  if (typeof packageName != 'string')
    throw new Error('Package name is required.')

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
 * @param {_reloquent.Questions} questions A set of questions to extend with default value from the existing config.
 * @param {!Object} current Current configuration object.
 * @returns {_reloquent.Questions} Questions with updated defaultValue where answers were present in the passed config object.
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
 * @suppress {nonStandardJsDocs}
 * @typedef {import('reloquent/types').Questions} _reloquent.Questions
 */

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('..').Config} _africa.Config
 */