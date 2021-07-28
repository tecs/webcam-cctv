import React from 'react';
import PlaybackStream from './Stream/PlaybackStream';
import Input from './Input';
import { sortDevices } from '../Utils';
import {
  authenticate,
  onData, onUpdateStreamers,
  start, stop, zoom, restart,
} from '../Socket';

class Dashboard extends React.Component {
  /**
   * @typedef Stream
   * @property {String} id The id of the stream
   * @property {String} name The name of the stream
   * @property {String} type The type of the stream. Either "audio" or "video"
   *
   * @typedef Streamer
   * @property {String} id The id of the client
   * @property {String} name The name of the client
   * @property {Stream[]} streams List of enabled streams
   */

  /** @type {Object.<string, SourceBuffer>} */
  buffers = {};

  constructor(props) {
    super(props);

    /** @type {{password: String, streamers: Streamer[],audio: String[], zoomed: String}} */
    this.state = {
      password: '',
      streamers: [],
      audio: [],
      zoomed: null,
    };
  }

  /**
   * A list of all streams across all streamers
   *
   * @type {(Stream & {parent: String, zoomed: Boolean, muted: Boolean})[]}
   */
  get streams() {
    return this.state.streamers
      .flatMap(({ name, streams }) => Object.values(streams).map(stream => ({
        ...stream,
        parent: name,
        zoomed: this.state.zoomed === stream.id,
        muted: !this.state.audio.includes(stream.id),
      })));
  }

  componentDidMount() {
    onUpdateStreamers(streamers => this.setState({ streamers }));
    onData((id, data) => this.buffers[id].appendBuffer(data));
  }

  /**
   * @param {Object} _
   * @param {Object} state
   * @param {String|null} state.zoomed
   */
  async componentDidUpdate(_, { zoomed }) {
    const streams = this.streams;

    // Reset all streams on toggling zoom
    if (zoomed !== this.state.zoomed) {
      await new Promise(res => setTimeout(res, 1000));
      this.buffers = {};
    }

    // Setup all streams that are not already set up, and if zoomed - only the zoomed and audio streams
    streams
      .filter(({ id }) => !this.buffers[id])
      .filter(({ id, type }) => !this.state.zoomed || id === this.state.zoomed || type === 'audio')
      .forEach(stream => this.connectStream(stream));

    // Remove disabled or missing streams
    for (const id of Object.keys(this.buffers)) {
      if (!streams.find(stream => stream.id === id)) {
        delete this.buffers[id];
      }
    }

    // Mute disabled or missing audio streams
    const audio = this.state.audio.filter(id => streams.find(stream => stream.id === id));
    if (audio.length !== this.state.audio.length) {
      this.setState({ audio });
    }
  }

  /**
   * Setup a stream to receive data and display its contents
   *
   * @param {Stream} stream
   */
  connectStream({ id, type }) {
    const mediaSource = new MediaSource();
    document.getElementById(id).src = URL.createObjectURL(mediaSource);

    mediaSource.addEventListener('sourceopen', () => {
      const mime = type === 'video' ? 'video/webm;codecs="vp9"' : 'audio/webm;codecs="opus"';
      this.buffers[id] = mediaSource.addSourceBuffer(mime);
      if (type === 'video') {
        start(id);
      }
    });
  }

  /**
   * Logs the client in
   *
   * @param {String} password
   */
  submitPassword(password) {
    authenticate(password);
    this.setState({ password });
  }

  /**
   * Toggles the zoom state for video streams, and the mute state for audio ones
   *
   * @param {Stream} stream
   */
  toggle(stream) {
    if (stream.type === 'video') {
      this.toggleZoom(stream.id);
    } else {
      this.toggleAudio(stream.id);
    }
  }

  /**
   * Toggles the zoom state of a video stream
   *
   * @param {String} id The id of the stream
   */
  toggleZoom(id) {
    const zoomed = this.state.zoomed ? null : id;
    zoom(zoomed);
    this.setState({ zoomed, audio: [] });
  }

  /**
   * Toggles the mute state of an audio stream
   *
   * @param {String} id The id of the stream
   */
  toggleAudio(id) {
    const remove = this.state.audio.includes(id);
    const audio = this.state.audio
      .concat(id)
      .filter(audioId => !remove || audioId !== id);

    if (remove) {
      stop(id);
    } else {
      start(id);
    }

    this.setState({ audio });
  }

  /**
   * @returns {React.Component[]}
   */
  renderControls() {
    return this.state.streamers
      .map(({ id, name }) => <button key={id} onClick={() => restart(id)} className="btn btn-danger m-1">Restart {name}</button>);
  }

  /**
   * @returns {React.Component[]}
   */
  renderStreams() {
    return this.streams
      .filter(({ type, zoomed }) => !this.state.zoomed || zoomed || type !== 'video')
      .sort(sortDevices)
      .map(stream => <PlaybackStream key={stream.id} {...stream} handler={() => this.toggle(stream)} />);
  }

  render() {
    // Display login screen if password not set
    if (!this.state.password) {
      return <Input placeholder="Password" type="password" handler={this.submitPassword.bind(this)} />;
    }

    return (
      <>
        {this.renderControls()}
        <hr />
        <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 row-cols-xxl-4 g-3 g-md-4 g-xl-5">{this.renderStreams()}</div>
      </>
    );
  }
}

export default Dashboard;
