var _require = require('path'),
    resolve = _require.resolve;

var _require2 = require("wrote/es5/src"),
    readJSON = _require2.readJSON,
    writeJSON = _require2.writeJSON,
    erase = _require2.erase,
    createWritable = _require2.createWritable;

var _require3 = require('os'),
    homedir = _require3.homedir;

var _require4 = require('child_process'),
    spawn = _require4.spawn;

var _require5 = require('stream'),
    Readable = _require5.Readable;

var FIXTURES_PATH = resolve(__dirname, '../fixtures');
/**
 * The context will read the .test-africarc file from fixtures and write it to
 * ~/.test-africarc, and erase it upon finishing the test.
 */

function Context() {
  return new Promise(function ($return, $error) {
    var _this, path;

    _this = this;
    this.packageName = 'test-africa';
    this.fixturesPath = FIXTURES_PATH;
    this.fixturesRcPath = resolve(FIXTURES_PATH, `.${this.packageName}rc`);
    return Promise.resolve(readJSON(this.fixturesRcPath)).then(function ($await_2) {
      try {
        this.json = $await_2; // can cache read (e.g., with second param)

        path = resolve(homedir(), `.${this.packageName}rc`);
        return Promise.resolve(writeJSON(path, this.json, {
          space: 2
        })).then(function ($await_3) {
          try {
            this.eraseRc = function () {
              return new Promise(function ($return, $error) {
                var ws2;
                return Promise.resolve(createWritable(path)).then(function ($await_4) {
                  try {
                    ws2 = $await_4;
                    return Promise.resolve(erase(ws2)).then(function ($await_5) {
                      try {
                        return $return();
                      } catch ($boundEx) {
                        return $error($boundEx);
                      }
                    }.bind(this), $error);
                  } catch ($boundEx) {
                    return $error($boundEx);
                  }
                }.bind(this), $error);
              }.bind(this));
            };

            this.readRc = function () {
              return new Promise(function ($return, $error) {
                var res;
                return Promise.resolve(readJSON(path)).then(function ($await_6) {
                  try {
                    res = $await_6;
                    return $return(res);
                  } catch ($boundEx) {
                    return $error($boundEx);
                  }
                }.bind(this), $error);
              }.bind(this));
            };

            this.fork = function (packageName, questions) {
              var $args = arguments;
              return new Promise(function ($return, $error) {
                var answers, testModule, proc;
                answers = $args.length > 2 && $args[2] !== undefined ? $args[2] : [];
                testModule = resolve(__dirname, '../fixtures/test');
                proc = spawn(process.execPath, [testModule], {
                  stdio: ['pipe', 'pipe', 'pipe', 'ipc']
                });
                proc.send({
                  packageName,
                  questions
                }); // proc.stdout.pipe(process.stdout)
                // proc.stderr.pipe(process.stdout)

                _this.proc = proc;
                return Promise.resolve(new Promise(function (resolve, reject) {
                  var r = new Readable({
                    read() {
                      var _this2 = this;

                      proc.stdout.on('data', function () {
                        if (!answers.length) {
                          _this2.push(null);
                        } else {
                          var answer = answers.shift();

                          _this2.push(`${answer}\n`);
                        }
                      });
                    }

                  });
                  r.pipe(proc.stdin);
                  proc.on('error', reject);
                  proc.on('exit', resolve);
                })).then(function ($await_7) {
                  try {
                    delete _this.proc;
                    return $return();
                  } catch ($boundEx) {
                    return $error($boundEx);
                  }
                }.bind(this), $error);
              }.bind(this));
            };

            this._destroy = function () {
              return new Promise(function ($return, $error) {
                return Promise.resolve(_this.eraseRc()).then(function ($await_8) {
                  try {
                    if (_this.proc) {
                      _this.proc.kill();

                      return Promise.resolve(new Promise(function (resolve) {
                        _this.proc.on('exit', resolve);
                      })).then(function ($await_9) {
                        try {
                          return $If_1.call(this);
                        } catch ($boundEx) {
                          return $error($boundEx);
                        }
                      }.bind(this), $error);
                    }

                    function $If_1() {
                      return $return();
                    }

                    return $If_1.call(this);
                  } catch ($boundEx) {
                    return $error($boundEx);
                  }
                }.bind(this), $error);
              }.bind(this));
            };

            return $return();
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

module.exports = Context;