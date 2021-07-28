const { connect, log } = require('../utils');

class BaseClient {
  log = log(this.constructor.name);

  /**
   * @param {EventEmitter} socket
   * @param {SocketHandler} iface
   */
  constructor(socket, iface) {
    this.socket = socket;
    this.iface = iface;

    connect(this, socket);
  }

  /**
   * An alias for `Client#socket.emit()`
   *
   * @param {String} event
   * @param  {...any} args
   */
  emit(event, ...args) {
    this.socket.emit(event, ...args);
  }
}

module.exports = BaseClient;
