import React from 'react';
import { Link } from 'react-router-dom';

import StreamWrapper from './StreamWrapper';
import VideoSource from '../Source/VideoSource';
import AudioSource from '../Source/AudioSource';

/**
 * @param {Object} params
 * @param {String} params.id Id of the stream
 * @param {String} params.name Name of the stream
 * @param {String} params.type Type of the stream. Either "video" or "audio"
 * @param {String} params.url Either an "add" or "remove" stream URL
 * @param {Boolean} params.enabled Whether or not the stream is enabled
 * @param {Boolean} params.active Whether or not the stream is active
 * @param {Boolean} params.zoomed Whether or not the stream is zoomed
 * @returns {React.Component}
 */
const CaptureStream = ({ id, name, type, url, enabled, active, zoomed }) => {
  const color = enabled ? (active ? 'danger' : 'secondary') : 'success';

  return (
    <StreamWrapper name={name} closeUrl={enabled && url} type={type} cardClass={`text-white bg-${color}`}>
      {active ?
        // Active streams are either a video or an audio source
        (type === 'video' ?
          <VideoSource deviceId={id} zoomed={zoomed} /> :
          <AudioSource deviceId={id} />
        ) :
        // Inactive streams are either paused or not yet enabled
        (enabled ?
          <i className="fas fa-pause-circle"></i> :
          <Link to={url} className="fas fa-plus-circle" />
        )
      }
    </StreamWrapper>
  );
};

export default CaptureStream;
