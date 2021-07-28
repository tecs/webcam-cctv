const BaseClient = require('./BaseClient');

class WatcherClient extends BaseClient {
  /**
   * @param {String} id The id of the stream
   */
  _start(id) {
    this.log(`start ${id}`);
    this.iface.streamers.forEach(streamer => streamer.streams[id] && streamer.emit('start', id));
  }

  /**
   * @param {String} id The id of the stream
   */
  _stop(id) {
    this.log(`stop ${id}`);
    this.iface.streamers.forEach(streamer => streamer.streams[id] && streamer.emit('stop', id));
  }

  /**
   * @param {String} id The id of the stream
   */
  _zoom(id) {
    this.iface.streamers.forEach(streamer => {
      streamer.emit('reset');
      if (streamer.streams[id]) {
        streamer.emit('zoom', id);
      }
    });

    this.log(`zoom ${id || 'off'}`);
  }

  /**
   * @param {String} id The id of the client
   */
  _restart(id) {
    this.log(`restart ${id}`);
    this.iface.streamers.forEach(streamer => streamer.socket.id === id && streamer.emit('restart'));
  }
}

module.exports = WatcherClient;
