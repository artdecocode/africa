"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.askQuestionsAndWrite = askQuestionsAndWrite;
exports.exists = void 0;

var _reloquent = _interopRequireDefault(require("reloquent"));

var _fs = require("fs");

var _bosom = _interopRequireDefault(require("bosom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const exists = async path => {
  const res = await new Promise((r, j) => {
    (0, _fs.stat)(path, err => {
      if (err && err.code == 'ENOENT') {
        r(false);
      } else if (err) {
        j(err);
      } else {
        r(true);
      }
    });
  });
  return res;
};

exports.exists = exists;

async function askQuestionsAndWrite(questions, path, timeout) {
  const answers = await (0, _reloquent.default)(questions, timeout);
  await (0, _bosom.default)(path, answers, {
    space: 2
  });
  return answers;
}
//# sourceMappingURL=index.js.map