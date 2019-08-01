module.exports = {}
/* typal types/index.xml closure noSuppress */
/**
 * @typedef {_africa.Config} Config `＠record` The configuration object to configure additional functionality.
 */
/**
 * @typedef {Object} _africa.Config `＠record` The configuration object to configure additional functionality.
 * @prop {boolean} [force=false] Ask questions and update the configuration file even if it already exists. Default `false`.
 * @prop {string} [homedir="os.homedir()"] In which directory to save and search for configuration file. Default `os.homedir()`.
 * @prop {number} [questionsTimeout] How log to wait in ms before timing out. Will wait forever by default.
 * @prop {boolean} [local=false] Whether to read a local config file in the current working directory rather than in the `HOMEDIR`. When initialising, the default values will be taken from the home config if it exists so that it is easy to extend `.rc` files. Default `false`.
 * @prop {function(string): string} [rcNameFunction] Function used to generate the `.rc` name.
 * Default: <code>packageName => `.${packageName}rc`</code>
 */
