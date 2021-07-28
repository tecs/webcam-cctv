const fs = require('fs');
const { EventEmitter } = require('stream');

/**
 * Connects instance methods to incoming socket events.
 *
 * ```
 * // given
 * obj = { _fooBar() {}, _baz() {} }
 *
 * // this:
 * connect(obj, sock);
 *
 * // is equivalent to:
 * sock.on('foo-bar', (...args) => obj._fooBar(...args));
 * sock.on('baz', (...args) => obj._baz(...args));
 * ```
 *
 * @param {Object} instance
 * @param {EventEmitter} socket An object that implements EventEmitter's `.on()` method.
 * @param {Function} [argsMiddleware] Interceptor function that allows modifying the event arguments.
 */
const connect = (instance, socket, argsMiddleware = (x => x)) => {
  // Get all instance methods starting with an underscore
  const protptype = Object.getPrototypeOf(instance);
  const methods = Object.getOwnPropertyNames(protptype).filter(([_]) => _ === '_');

  for (const method of methods) {
    // Convert underscore-prefixed methods to kebab-case events (_myEvent -> my-event)
    const event = method.substr(1).replace(/[A-Z]/g, c => `-${c.toLowerCase()}`);
    socket.on(event, (...args) => instance[method](...argsMiddleware(args)));
  }
};

/**
 * Disconnects event listeners from a socket.
 *
 * @param {EventEmitter} socket An object that implements EventEmitter's `.removeAllListeners()` method.
 * @param  {...String} events Event name for which to remove listeners.
 */
const disconnect = (socket, ...events) => events.forEach(event => socket.removeAllListeners(event));

/**
 * Creates a prefixed version of `console.log`, wrapping each prefix in square brackets.
 *
 * @param  {...String|null} prefixes Prefix to prepend to the log output. For each `null` provided, a log argument will be consumed and substituted.
 * @returns {Function} Prefixes can be accessed and edited via the `.prefixes` property of the returned function.
 */
const log = (...prefixes) => Object.assign(function fn(...args) {
  console.log(...fn.prefixes.map(prefix => `[${prefix || args.shift()}]`), ...args);
}, { prefixes });


/**
 * Lists all files' paths recursively under the supplied directory.
 *
 * @param {String} dir
 * @returns {String[]}
 */
const tree = dir => fs.readdirSync(dir, { withFileTypes: true })
  .flatMap(item => {
    const stat = fs.statSync(`${dir}/${item.name}`);
    if (item.isDirectory() || stat.isDirectory()) {
      return tree(`${dir}/${item.name}`).map(file => `${item.name}/${file}`);
    }
    return item.name;
  });

module.exports = { connect, disconnect, log, tree };
