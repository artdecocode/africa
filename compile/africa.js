#!/usr/bin/env node
             
const path = require('path');
const os = require('os');
const util = require('util');
const fs = require('fs');
const stream = require('stream');
const readline = require('readline');             
const {resolve:m} = path;
const {homedir:n} = os;
const {debuglog:p} = util;
const {createReadStream:q, createWriteStream:r, stat:t} = fs;
const {Writable:u} = stream;
const v = (a, b = 0, c = !1) => {
  if (0 === b && !c) {
    return a;
  }
  a = a.split("\n", c ? b + 1 : void 0);
  return c ? a[a.length - 1] : a.slice(b).join("\n");
}, w = (a, b = !1) => v(a, 2 + (b ? 1 : 0)), x = a => {
  ({callee:{caller:a}} = a);
  return a;
};
const y = /\s+at.*(?:\(|\s)(.*)\)?/, z = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, A = n(), B = a => {
  const {pretty:b = !1, ignoredModules:c = ["pirates"]} = {}, e = c.join("|"), d = new RegExp(z.source.replace("IGNORED_MODULES", e));
  return a.replace(/\\/g, "/").split("\n").filter(f => {
    f = f.match(y);
    if (null === f || !f[1]) {
      return !0;
    }
    f = f[1];
    return f.includes(".app/Contents/Resources/electron.asar") || f.includes(".app/Contents/Resources/default_app.asar") ? !1 : !d.test(f);
  }).filter(f => f.trim()).map(f => b ? f.replace(y, (g, h) => g.replace(h, h.replace(A, "~"))) : f).join("\n");
};
function C(a, b, c = !1) {
  return function(e) {
    var d = x(arguments), {stack:f} = Error();
    const g = v(f, 2, !0), h = (f = e instanceof Error) ? e.message : e;
    d = [`Error: ${h}`, ...null !== d && a === d || c ? [b] : [g, b]].join("\n");
    d = B(d);
    return Object.assign(f ? e : Error(), {message:h, stack:d});
  };
}
;function D(a) {
  var {stack:b} = Error();
  const c = x(arguments);
  b = w(b, a);
  return C(c, b, a);
}
;const E = (a, b) => {
  b.once("error", c => {
    a.emit("error", c);
  });
  return b;
};
class F extends u {
  constructor(a) {
    const {binary:b = !1, rs:c = null, ...e} = a || {}, {f:d = D(!0), proxyError:f} = a || {}, g = (h, l) => d(l);
    super(e);
    this.a = [];
    this.c = new Promise((h, l) => {
      this.on("finish", () => {
        let k;
        b ? k = Buffer.concat(this.a) : k = this.a.join("");
        h(k);
        this.a = [];
      });
      this.once("error", k => {
        if (-1 == k.stack.indexOf("\n")) {
          g`${k}`;
        } else {
          const L = B(k.stack);
          k.stack = L;
          f && g`${k}`;
        }
        l(k);
      });
      c && E(this, c).pipe(this);
    });
  }
  _write(a, b, c) {
    this.a.push(a);
    c();
  }
  get b() {
    return this.c;
  }
}
const G = async a => {
  ({b:a} = new F({rs:a, f:D(!0)}));
  return await a;
};
async function H(a) {
  a = q(a);
  return await G(a);
}
;async function I(a, b) {
  if (!a) {
    throw Error("No path is given.");
  }
  const c = D(!0), e = r(a);
  await new Promise((d, f) => {
    e.on("error", g => {
      g = c(g);
      f(g);
    }).on("close", d).end(b);
  });
}
;const J = p("bosom"), K = async(a, b, c) => {
  const {replacer:e = null, space:d = null} = c;
  b = JSON.stringify(b, e, d);
  await I(a, b);
}, M = async(a, b, c = {}) => {
  if (b) {
    return await K(a, b, c);
  }
  J("Reading %s", a);
  a = await H(a);
  return JSON.parse(a);
};
const {createInterface:N} = readline;
function O(a, b, c) {
  return setTimeout(() => {
    const e = Error(`${a ? a : "Promise"} has timed out after ${b}ms`);
    e.stack = `Error: ${e.message}`;
    c(e);
  }, b);
}
function P(a, b) {
  let c;
  const e = new Promise((d, f) => {
    c = O(a, b, f);
  });
  return {timeout:c, b:e};
}
async function Q(a, b, c) {
  if (!(a instanceof Promise)) {
    throw Error("Promise expected");
  }
  if (!b) {
    throw Error("Timeout must be a number");
  }
  if (0 > b) {
    throw Error("Timeout cannot be negative");
  }
  const {b:e, timeout:d} = P(c, b);
  try {
    return await Promise.race([a, e]);
  } finally {
    clearTimeout(d);
  }
}
;function R(a, b = {}) {
  const {timeout:c, password:e = !1, output:d = process.stdout, input:f = process.stdin, ...g} = b;
  b = N({input:f, output:d, ...g});
  if (e) {
    const l = b.output;
    b._writeToOutput = k => {
      if (["\r\n", "\n", "\r"].includes(k)) {
        return l.write(k);
      }
      k = k.split(a);
      "2" == k.length ? (l.write(a), l.write("*".repeat(k[1].length))) : l.write("*");
    };
  }
  var h = new Promise(b.question.bind(b, a));
  h = c ? Q(h, c, `reloquent: ${a}`) : h;
  b.promise = S(h, b);
  return b;
}
const S = async(a, b) => {
  try {
    return await a;
  } finally {
    b.close();
  }
};
async function T(a, b) {
  if ("object" != typeof a) {
    throw Error("Please give an object with questions");
  }
  return await Object.keys(a).reduce(async(c, e) => {
    c = await c;
    var d = a[e];
    switch(typeof d) {
      case "object":
        d = {...d};
        break;
      case "string":
        d = {text:d};
        break;
      default:
        throw Error("A question must be a string or an object.");
    }
    d.text = `${d.text}${d.text.endsWith("?") ? "" : ":"} `;
    var f;
    if (d.defaultValue) {
      var g = d.defaultValue;
    }
    d.getDefault && (f = await d.getDefault());
    let h = g || "";
    g && f && g != f ? h = `\x1b[90m${g}\x1b[0m` : g && g == f && (h = "");
    g = f || "";
    ({promise:g} = R(`${d.text}${h ? `[${h}] ` : ""}${g ? `[${g}] ` : ""}`, {timeout:b, password:d.password}));
    f = await g || f || d.defaultValue;
    "function" == typeof d.validation && d.validation(f);
    "function" == typeof d.postProcess && (f = await d.postProcess(f));
    return {...c, [e]:f};
  }, {});
}
;async function U(a, b) {
  return await T(a, b);
}
;const V = async a => await new Promise((b, c) => {
  t(a, e => {
    e && "ENOENT" == e.code ? b(!1) : e ? c(e) : b(!0);
  });
});
async function W(a, b, c) {
  a = await U(a, c);
  await M(b, a, {space:2});
  return a;
}
;const Y = async(a, b, c, e, d) => a ? await X(b, c, d, e) : await W(c, b, e), X = async(a, b, c, e) => {
  const d = await M(a);
  return c ? await Z(b, a, d, e) : d;
}, aa = async(a, b, c, e, d, f, g) => b ? await X(e, d, g, f) : (a = a ? await M(c) : {}, await Z(d, e, a, f)), Z = async(a, b, c, e) => {
  a = ba(a, c);
  return await W(a, b, e);
}, ba = (a, b) => Object.keys(a).reduce((c, e) => {
  const d = b[e];
  return {...c, [e]:{...a[e], ...d ? {defaultValue:d} : {}}};
}, {});
module.exports = async function(a, b = {}, c = {}) {
  if ("string" != typeof a) {
    throw Error("Package name is required.");
  }
  const {homedir:e = n(), rcNameFunction:d = k => `.${k}rc`, force:f = !1, local:g = !1, questionsTimeout:h} = c;
  var l = d(a);
  a = m(e, l);
  c = await V(a);
  if (g) {
    l = m(l);
    const k = await V(l);
    return await aa(c, k, a, l, b, h, f);
  }
  return await Y(c, a, b, h, f);
};


//# sourceMappingURL=africa.js.map