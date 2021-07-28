import React from 'react';
import StreamWrapper from './StreamWrapper';

/**
 * @param {Object} params
 * @param {String} params.id Id of the stream
 * @param {String} params.name Name of the stream
 * @param {String} params.parent Name of the client
 * @param {String} params.type Type of the stream. Either "video" or "audio"
 * @param {Boolean} params.zoomed Whether or not the stream is zoomed
 * @param {Boolean} params.muted Whether or not the stream is muted
 * @param {Function} params.handler Toggle zoom/mute handler
 * @returns {React.Component}
 */
const PlaybackStream = ({ id, name, type, zoomed, muted, parent, handler }) => (
  <StreamWrapper name={`${parent} - ${name}`} type={type} fullWidth={zoomed} handler={handler}>
    {type === 'video' ?
      <video id={id} autoPlay playsInline muted></video> :
      <>
        <audio id={id} autoPlay playsInline muted={muted}></audio>
        <i className={`fas fa-microphone${muted ? '-slash' : ''}`}></i>
      </>
    }
  </StreamWrapper>
);

export default PlaybackStream;
