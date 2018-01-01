var _require = require('path'),
    resolve = _require.resolve;

var _require2 = require("wrote/es5/src"),
    readJSON = _require2.readJSON,
    writeJSON = _require2.writeJSON,
    exists = _require2.exists;

var _require3 = require('os'),
    home = _require3.homedir;

var _require4 = require('reloquent'),
    askQuestions = _require4.askQuestions;

function askQuestionsAndWrite(questions, path) {
  return new Promise(function ($return, $error) {
    var answers;
    return Promise.resolve(askQuestions(questions)).then(function ($await_2) {
      try {
        answers = $await_2;
        return Promise.resolve(writeJSON(path, answers, {
          space: 2
        })).then(function ($await_3) {
          try {
            return $return(answers);
          } catch ($boundEx) {
            return $error($boundEx);
          }
        }.bind(this), $error);
      } catch ($boundEx) {
        return $error($boundEx);
      }
    }.bind(this), $error);
  }.bind(this));
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


function africa(packageName) {
  var $args = arguments;
  return new Promise(function ($return, $error) {
    var questions, config, _config$homedir, homedir, _config$rcNameFunctio, rcNameFunction, _config$force, force, rc, path, ex, conf, parsed;

    questions = $args.length > 1 && $args[1] !== undefined ? $args[1] : {};
    config = $args.length > 2 && $args[2] !== undefined ? $args[2] : {};

    if (typeof packageName != 'string') {
      return $error(new Error('Package name is required.'));
    }

    _config$homedir = config.homedir, homedir = _config$homedir === void 0 ? home() : _config$homedir, _config$rcNameFunctio = config.rcNameFunction, rcNameFunction = _config$rcNameFunctio === void 0 ? function (packageName) {
      return `.${packageName}rc`;
    } : _config$rcNameFunctio, _config$force = config.force, force = _config$force === void 0 ? false : _config$force;
    rc = rcNameFunction(packageName);
    path = resolve(homedir, rc);
    return Promise.resolve(exists(path)).then(function ($await_4) {
      try {
        ex = $await_4;

        if (!ex || force) {
          return Promise.resolve(askQuestionsAndWrite(questions, path)).then(function ($await_5) {
            try {
              conf = $await_5;
              return $return(conf);
            } catch ($boundEx) {
              return $error($boundEx);
            }
          }.bind(this), $error);
        }

        return Promise.resolve(readJSON(path)).then(function ($await_6) {
          try {
            parsed = $await_6;
            return $return(parsed);
          } catch ($boundEx) {
            return $error($boundEx);
          }
        }.bind(this), $error);
      } catch ($boundEx) {
        return $error($boundEx);
      }
    }.bind(this), $error);
  }.bind(this));
}

module.exports = africa;