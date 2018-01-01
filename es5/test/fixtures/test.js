var africa = require("../../src/");

process.on('message', function (_ref) {
  return new Promise(function ($return, $error) {
    var packageName, questions;
    packageName = _ref.packageName, questions = _ref.questions;
    return Promise.resolve(africa(packageName, questions)).then(function ($await_1) {
      try {
        process.exit();
        return $return();
      } catch ($boundEx) {
        return $error($boundEx);
      }
    }.bind(this), $error);
  }.bind(this));
});