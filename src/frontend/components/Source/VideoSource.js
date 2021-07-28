import React from 'react';
import PropTypes from 'prop-types';
import BaseSource from './BaseSource';
import { getVideo } from '../../Media';

class VideoSource extends BaseSource {
  mimeType = 'video/webm;codecs="vp9"';

  /**
   * @param {Object} props
   * @param {String} props.deviceId
   * @param {Boolean} props.zoomed
   */
  constructor(props) {
    super(props);

    this.state.zoomed = props.zoomed;
  }

  static get propTypes() {
    return Object.assign(super.propTypes, { zoomed: PropTypes.bool });
  }

  async componentDidMount() {
    await super.componentDidMount();

    // Generate a preview
    document.getElementById(this.state.deviceId).srcObject = this.stream;
  }

  async getStream() {
    return await getVideo(this.state.deviceId, this.state.zoomed);
  }

  render() {
    return <video id={this.state.deviceId} autoPlay playsInline muted></video>;
  }
}

export default VideoSource;
