import React from 'react';
import PropTypes from 'prop-types';
import CaptureStream from './Stream/CaptureStream';
import Input from './Input';
import { getDevices } from '../Media';
import { parseStreams, sortDevices } from '../Utils';
import {
  setName,
  addStream, removeStream,
  onStart, onStop, onZoom,
  onDisconnect, onReset, onRestart,
} from '../Socket';

class Broadcast extends React.Component {
  /** @type {NodeJS.Timer} */
  interval = null;

  /**
   * @typedef {{match: {params: {name: String, devices: String}}}} Props
   */

  /**
   * @param {Props} props
   */
  constructor(props) {
    super(props);

    /** @type {{devices: {id: String, type: String, name: String}[], name: String, streams: String[], running: String[], zoomed: String}} */
    this.state = {
      devices: [],
      name: decodeURIComponent(props.match.params.name || ''),
      streams: [],
      running: [],
      zoomed: null,
    };
  }

  static get propTypes() {
    return { match: PropTypes.any };
  }

  async componentDidMount() {
    // Attach listeners
    onStart(id => this.setState({ running: this.state.running.concat(id) }));
    onStop(id => this.setState({ running: this.state.running.filter(deviceId => deviceId !== id) }));
    onZoom(id => this.setState({ zoomed: id }));
    onReset(() => this.setState({ running: [], zoomed: null }));
    onRestart(() => window.location.reload());
    onDisconnect(() => window.location.reload());

    // Send name to server if set
    if (this.state.name) {
      setName(this.state.name);
    }

    // Collect capturing devices
    const devices = await getDevices();
    this.setState({ devices });

    this.updateStreams();
  }

  /**
   * @param {Props} props
   */
  componentDidUpdate(props) {
    this.updateStreams(parseStreams(props.match.params.devices));
  }

  /**
   * Compares the current list of streams to the previous one and updates the state if necessary
   *
   * @param {String[]} [oldStreams] An array of stream ids
   */
  updateStreams(oldStreams = []) {
    const streams = parseStreams(this.props.match.params.devices);

    // Find the streams to be added (missing from old state) and removed (extra in old state)
    const streamsToAdd = streams.filter(id => !oldStreams.includes(id));
    const streamsToRemove = oldStreams.filter(id => !streams.includes(id));

    // Notify the server of any stream changes
    streamsToAdd.forEach(stream => this.addStream(stream));
    streamsToRemove.forEach(stream => removeStream(stream));

    // Update the state if the streams have changed
    if (streamsToAdd.length + streamsToRemove.length) {
      const running = this.state.running.filter(id => streams.includes(id));
      this.setState({ streams, running, zoomed: null });
    }
  }

  /**
   * Registers a stream with the server
   *
   * @param {String} stream The id of the stream
   */
  addStream(stream) {
    const device = this.state.devices.find(({ id }) => id === stream);
    addStream(stream, device.name, device.type);
  }

  /**
   * Sets the name of the client
   *
   * @param {String} name
   */
  submitName(name) {
    window.location.href = this.generateUri(name);
  }

  /**
   * Generates a client URI with the selected name and streams, optionally toggling a stream
   *
   * @param {String} name The name of the client
   * @param {String} [toggleDevice] The id of the stream to enable or disable
   * @returns {String}
   */
  generateUri(name, toggleDevice = null) {
    const fragments = ['/broadcast', encodeURIComponent(name)];

    const devices = this.state.streams
      .concat(toggleDevice)
      .filter(() => toggleDevice)
      .filter(stream => !this.state.streams.includes(toggleDevice) || stream !== toggleDevice);

    if (devices.length) {
      fragments.push(devices.join(','));
    }

    return fragments.join('/');
  }

  /**
   * @returns {React.Component}
   */
  renderStreams() {
    return this.state.devices
      .map(device => ({
          ...device,
          enabled: this.state.streams.includes(device.id),
          active: this.state.running.includes(device.id),
          zoomed: this.state.zoomed === device.id,
          url: this.generateUri(this.state.name, device.id),
        }))
      .sort(sortDevices)
      .map(device => <CaptureStream key={device.id} {...device} />);
  }

  render() {
    // Display name selection screen in name not set
    if (!this.state.name) {
      return <Input placeholder="Name" handler={this.submitName.bind(this)} />;
    }

    return (
      <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 row-cols-xxl-4 g-3 g-md-4 g-xl-5">
        {this.state.devices.length ? this.renderStreams() : null}
      </div>
    );
  }
}

export default Broadcast;
