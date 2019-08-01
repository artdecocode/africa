import ask from 'reloquent'
import { stat } from 'fs'
import bosom from 'bosom'

export const exists = async (path) => {
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
 * @param {_reloquent.Questions} questions
 * @param {string} path
 * @param {number} [timeout]
 */
export async function askQuestionsAndWrite(questions, path, timeout) {
  const answers = await ask(questions, timeout)
  await bosom(path, answers, { space: 2 })
  return answers
}

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('reloquent/types').Questions} _reloquent.Questions
 */
