"use strict";

var _path = require("path");

var _wrote = require("wrote");

var _os = require("os");

var _reloquent = require("reloquent");

async function askQuestionsAndWrite(questions, path) {
  const answers = await (0, _reloquent.askQuestions)(questions);
  await (0, _wrote.writeJSON)(path, answers, {
    space: 2
  });
  return answers;
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
    throw new Error('Package name is required.');
  }

  const {
    homedir = (0, _os.homedir)(),
    rcNameFunction = packageName => `.${packageName}rc`,
    force = false
  } = config;
  const rc = rcNameFunction(packageName);
  const path = (0, _path.resolve)(homedir, rc);
  const ex = await (0, _wrote.exists)(path);

  if (!ex || force) {
    const conf = await askQuestionsAndWrite(questions, path);
    return conf;
  }

  const parsed = await (0, _wrote.readJSON)(path);
  return parsed;
}

module.exports = africa;