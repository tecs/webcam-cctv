const StreamingClient = require('./client/StreamingClient');
const WatcherClient = require('./client/WatcherClient');
const config = require('./config');
const { connect, disconnect, log } = require('./utils');

class SocketHandler {
  /** @type {Map<EventEmitter, StreamingClient} */
  streamers = new Map();

  /** @type {WatcherClient} */
  watcher = null;

  /** @type {NodeJS.Timeout} */
  debounce = null;

  log = log('Main', null);

  /**
   * @param {EventEmitter} io Socket.io instance
   */
  constructor(io) {
    io.on('connection', socket => {
      this.log(socket.id, 'connected');
      connect(this, socket, args => [socket, ...args]);
    });
  }

  /**
   * Sends the watcher an updated list of streamers and their streams
   */
  update() {
    if (this.debounce) {
      clearTimeout(this.debounce);
    }
    this.debounce = setTimeout(() => {
      if (this.watcher) {
        const streamers = Array.from(this.streamers, ([{ id }, { streams, name }]) => ({ id, streams, name }));
        this.watcher.emit('update-streamers', streamers);
      }
    }, 10);
  }

  /**
   * @param {EventEmitter} socket
   * @param {String} password
   */
  _auth(socket, password) {
    disconnect(socket, 'auth', 'name');

    if (password === config.password) {
      if (this.watcher) {
        this.log(socket.id, 'disconnecting existig watcher');
        this.watcher.socket.disconnect(true);
      }

      this.log(socket.id, 'authenticated successfully');
      this.watcher = new WatcherClient(socket, this);
      this.update();
    } else {
      this.log(socket.id, 'FAILED AUTHENTICATION');
    }
  }

  /**
   * @param {EventEmitter} socket
   * @param {String} name
   */
  _name(socket, name) {
    disconnect(socket, 'auth', 'name');

    this.log(socket.id, `set name to "${name}"`);
    this.streamers.set(socket, new StreamingClient(name, socket, this));

    this.update();
  }

  /**
   * @param {EventEmitter} socket
   */
  _disconnect(socket) {
    this.log(socket.id, 'disconnected');

    if (socket === this.watcher?.socket) {
      this.watcher = null;
      this.streamers.forEach(streamer => streamer.emit('reset'));
    } else {
      this.streamers.delete(socket);
      this.update();
    }
  }
}

module.exports = SocketHandler;
