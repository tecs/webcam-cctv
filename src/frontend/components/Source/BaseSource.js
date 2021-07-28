import { Component } from 'react';
import PropTypes from 'prop-types';
import { sendStreamData } from '../../Socket';

class BaseSource extends Component {
  /** @type {NodeJS.Timer} */
  interval = null;

  /** @type {MediaStream} */
  stream = null;

  /**
   * @type {String}
   * @abstract
   */
  mimeType = null;

  /**
   * @param {Object} props
   * @param {String} props.deviceId
   */
  constructor(props) {
    super(props);

    /** @type {{deviceId: String}} */
    this.state = { deviceId: props.deviceId };
  }

  static get propTypes() {
    return { deviceId: PropTypes.string };
  }

  /**
   * @abstract
   * @returns {Promise<MediaStream>}
   */
  getStream() {}

  async componentDidMount() {
    this.stream = await this.getStream();

    // Record data from capturing device
    const recorder = new MediaRecorder(this.stream, { mimeType: this.mimeType });
    recorder.ondataavailable = ({ data }) => sendStreamData(this.state.deviceId, data);
    recorder.start();

    // Send the recorded buffer every second
    this.interval = setInterval(() => recorder.requestData(), 1000);
  }

  componentWillUnmount() {
    // Stop sending data
    if (this.interval) {
      clearInterval(this.interval);
    }

    // Free up the capturing device
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }
}

export default BaseSource;
