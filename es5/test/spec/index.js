var _require = require('zoroaster/assert'),
    throws = _require.throws,
    deepEqual = _require.deepEqual,
    equal = _require.equal;

var context = require('../context/');

var africa = require("../../src/");

var africaTestSuite = {
  context,

  'should be a function'() {
    equal(typeof africa, 'function');
  },

  'should throw an error if package name is not passed'() {
    return new Promise(function ($return, $error) {
      return Promise.resolve(throws({
        fn: africa,
        message: 'Package name is required.'
      })).then(function ($await_1) {
        try {
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  },

  'should read rc by package name from home directory'(_ref) {
    return new Promise(function ($return, $error) {
      var packageName, json, res;
      packageName = _ref.packageName, json = _ref.json;
      return Promise.resolve(africa(packageName)).then(function ($await_2) {
        try {
          res = $await_2;
          deepEqual(res, json);
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  },

  'should read correctly from specified home directory'(_ref2) {
    return new Promise(function ($return, $error) {
      var packageName, json, fixturesPath, res;
      packageName = _ref2.packageName, json = _ref2.json, fixturesPath = _ref2.fixturesPath;
      return Promise.resolve(africa(packageName, {
        homedir: fixturesPath
      })).then(function ($await_3) {
        try {
          res = $await_3;
          deepEqual(res, json);
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  },

  'should write answers to the rc'(_ref3) {
    return new Promise(function ($return, $error) {
      var packageName, eraseRc, readRc, fork, questions, res;
      packageName = _ref3.packageName, eraseRc = _ref3.eraseRc, readRc = _ref3.readRc, fork = _ref3.fork;
      return Promise.resolve(eraseRc()).then(function ($await_4) {
        try {
          questions = {
            name: {
              text: 'name'
            },
            org: {
              text: 'organisation'
            }
          };
          return Promise.resolve(fork(packageName, questions, ['test-name', 'test-org'])).then(function ($await_5) {
            try {
              return Promise.resolve(readRc()).then(function ($await_6) {
                try {
                  res = $await_6;
                  deepEqual(res, {
                    name: 'test-name',
                    org: 'test-org'
                  });
                  return $return();
                } catch ($boundEx) {
                  return $error($boundEx);
                }
              }.bind(this), $error);
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

};
module.exports = africaTestSuite;