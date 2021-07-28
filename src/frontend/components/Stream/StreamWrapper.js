import React from 'react';
import { Link } from 'react-router-dom';

/**
 * @param {Object} params
 * @param {React.Component} params.children The stream or other content to be wrapped
 * @param {String} params.type Type of the stream. Either "video" or "audio"
 * @param {String} params.name Name of the stream
 * @param {Function} [params.handler] Click handler for the wrapper
 * @param {Boolean} [params.fullWidth=false] Whether the wrapper should span the full width of the screen
 * @param {String} [params.closeUrl] A "close button" URL. When provided a close button is rendered
 * @param {String} [params.cardClass] Extra class names to append to the wrapper
 * @returns {React.Component}
 */
const StreamWrapper = ({ children, type, name, fullWidth, closeUrl, handler = () => {}, cardClass = '' }) => (
  <div className={`col ${fullWidth ? 'col-12' : ''}`} onClick={handler}>
    <div className={`card h-100 mx-auto ${cardClass}`} style={{ width: fullWidth ? '100%' : '320px' }}>
      <div className="card-header">
        {closeUrl ? <Link to={closeUrl} className="btn-close float-end"></Link> : null}
        <div title={name}>
          <i className={`m-1 fas fa-${type === 'video' ? 'video' : 'microphone'}`}></i>
          {name}
        </div>
      </div>
      <div className="card-img-bottom h-100">{children}</div>
    </div>
  </div>
);

export default StreamWrapper;
