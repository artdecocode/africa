/**
 * @fileoverview
 * @externs
 */

/* typal types/index.xml externs */
/** @const */
var _africa = {}
/**
 * The configuration object to configure additional functionality.
 * @record
 */
_africa.Config
/**
 * Ask questions and update the configuration file even if it already exists.
 * @type {boolean|undefined}
 */
_africa.Config.prototype.force
/**
 * In which directory to save and search for configuration file. Default `os.homedir()`.
 * @type {string|undefined}
 */
_africa.Config.prototype.homedir
/**
 * How log to wait in ms before timing out. Will wait forever by default.
 * @type {number|undefined}
 */
_africa.Config.prototype.questionsTimeout
/**
 * Whether to read a local config file in the current working directory rather than in the `HOMEDIR`. When initialising, the default values will be taken from the home config if it exists so that it is easy to extend `.rc` files.
 * @type {boolean|undefined}
 */
_africa.Config.prototype.local
/**
 * Function used to generate the `.rc` name.
 * Default: <code>packageName => `.${packageName}rc`</code>
 * @type {(function(string): string)|undefined}
 */
_africa.Config.prototype.rcNameFunction = function() {}
