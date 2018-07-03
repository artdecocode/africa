"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = africa;

var _path = require("path");

var _os = require("os");

var _bosom = _interopRequireDefault(require("bosom"));

var _lib = require("./lib");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
async function africa(packageName, questions = {}, config = {}) {
  if (typeof packageName != 'string') {
    throw new Error('Package name is required.');
  }

  const {
    homedir = (0, _os.homedir)(),
    rcNameFunction = p => `.${p}rc`,
    force = false,
    local = false,
    questionsTimeout
  } = config;
  const rc = rcNameFunction(packageName);
  const path = (0, _path.resolve)(homedir, rc);
  const homeEx = await (0, _lib.exists)(path);

  if (local) {
    const localPath = (0, _path.resolve)(rc);
    const localEx = await (0, _lib.exists)(localPath);
    const c = await handleLocal(homeEx, localEx, path, localPath, questions, questionsTimeout, force);
    return c;
  }

  const c = await handleHome(homeEx, path, questions, questionsTimeout, force);
  return c;
}

const handleHome = async (homeEx, path, questions, questionsTimeout, force) => {
  if (!homeEx) {
    const conf = await (0, _lib.askQuestionsAndWrite)(questions, path, questionsTimeout);
    return conf;
  }

  const p = await getParsed(path, questions, force, questionsTimeout);
  return p;
};

const getParsed = async (path, questions, force, questionsTimeout) => {
  const parsed = await (0, _bosom.default)(path);

  if (force) {
    const c = await forceQuestions(questions, path, parsed, questionsTimeout);
    return c;
  }

  return parsed;
};

const handleLocal = async (homeEx, localEx, path, localPath, questions, questionsTimeout, force) => {
  if (!localEx) {
    const h = homeEx ? await (0, _bosom.default)(path) : {};
    const conf = await forceQuestions(questions, localPath, h, questionsTimeout);
    return conf;
  }

  const p = await getParsed(localPath, questions, force, questionsTimeout);
  return p;
};

const forceQuestions = async (questions, path, config, questionsTimeout) => {
  const q = extendQuestions(questions, config);
  const conf = await (0, _lib.askQuestionsAndWrite)(q, path, questionsTimeout);
  return conf;
};
/**
 *
 * @param {Questions} questions A set of questions to extend with default value from the existing config.
 * @param {object} current Current configuration object.
 * @returns {Questions} Questions with updated defaultValue where answers were present in the passed config object.
 */


const extendQuestions = (questions, current) => {
  const q = Object.keys(questions).reduce((acc, key) => {
    const question = questions[key];
    const defaultValue = current[key];
    const value = { ...question,
      ...(defaultValue ? {
        defaultValue
      } : {})
    };
    return { ...acc,
      [key]: value
    };
  }, {});
  return q;
};
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
//# sourceMappingURL=index.js.map