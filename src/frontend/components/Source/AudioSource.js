import React from 'react';
import BaseSource from './BaseSource';
import { getAudio } from '../../Media';

class AudioSource extends BaseSource {
  mimeType = 'audio/webm;codecs="opus"';

  getStream() {
    return getAudio(this.state.deviceId);
  }

  render() {
    return <i className="fas fa-microphone audiosource"></i>;
  }
}

export default AudioSource;
