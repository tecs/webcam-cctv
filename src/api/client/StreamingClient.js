const BaseClient = require('./BaseClient');

class StreamingClient extends BaseClient {
  /**
   * @typedef Stream
   * @property {String} id The id of the stream
   * @property {String} name The name of the stream
   * @property {String} type The type of the stream. Either "audio" or "video"
   */

  /** @type {Object.<string, Stream>} */
  streams = {};

  /**
   * @param {String} name
   * @param {EventEmitter} socket
   * @param {SocketHandler} iface
   */
  constructor(name, socket, iface) {
    super(socket, iface);

    this.name = name;
    this.log.prefixes.push(name);
  }

  /**
   * @param {String} id The id of the stream
   * @param {String} name The name of the stream
   * @param {String} type The type of the stream. Either "audio" or "video"
   */
  _addStream(id, name, type) {
    if (this.streams[id]) {
      this._removeStream(id);
    }

    this.streams[id] = { id, name, type };
    this.log(`added stream ${id}`);

    this.iface.update();
  }

  /**
   * @param {String} id The id of the stream
   */
  _removeStream(id) {
    delete this.streams[id];
    this.log(`removed stream ${id}`);

    this.iface.update();
  }

  /**
   * @param {String} id The id of the stream
   * @param {ArrayBuffer} data Binary stream data
   */
  _data(id, data) {
    if (this.streams[id]) {
      this.iface.watcher?.emit('data', id, data);
    }
  }
}

module.exports = StreamingClient;
