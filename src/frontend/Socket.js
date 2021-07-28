const client = io();

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
 *
 * @callback StreamersHandler
 * @param {Streamer[]} streamers
 *
 * @callback DataHandler
 * @param {String} id The id of the stream
 * @param {ArrayBuffer} data The Binary stream data
 *
 * @callback StreamHandler
 * @param {String} id The id of the stream
 */

/**
 * Authenticate and mark client as watcher
 *
 * @param {String} password
 */
export const authenticate = password => client.emit('auth', password);

/**
 * Set the client's name and mark client as broadcaster
 *
 * @param {String} name
 */
export const setName = name => client.emit('name', name);

/**
 * Request starting a stream
 *
 * @param {String} id The id of the stream
 */
export const start = id => client.emit('start', id);

/**
 * Request stopping a stream
 *
 * @param {String} id The id of the stream
 */
export const stop = id => client.emit('stop', id);

/**
 * Request zooming a stream
 *
 * @param {String} id The id of the stream
 */
export const zoom = id => client.emit('zoom', id);

/**
 * Request restarting a client
 *
 * @param {String} id The id of the client
 */
export const restart = id => client.emit('restart', id);

/**
 * Send a stream's buffer to the server
 *
 * @param {String} id The id of the stream
 * @param {Blob} data Binary stream data
 */
export const sendStreamData = (id, data) => client.emit('data', id, data);

/**
 * Register a stream with the server
 *
 * @param {String} id The id of the stream
 * @param {String} name The name of the stream
 * @param {String} type The type of the stream. Either "audio" or "video"
 */
export const addStream = (id, name, type) => client.emit('add-stream', id, name, type);

/**
 * Removes a stream from the server
 *
 * @param {String} id The id of the stream
 */
export const removeStream = id => client.emit('remove-stream', id);

/**
 * Registers a callback to be called when the list of streamers and/or their streams has been updated
 *
 * @param {StreamersHandler} handler
 */
export const onUpdateStreamers = handler => client.on('update-streamers', handler);

/**
 * Registers a callback to be called when stream data is received
 *
 * @param {DataHandler} handler
 */
export const onData = handler => client.on('data', handler);

/**
 * Registers a callback to be called when a request to start a stream has been received
 *
 * @param {StreamHandler} handler
 */
export const onStart = handler => client.on('start', handler);

/**
 * Registers a callback to be called when a request to stop a stream has been received
 *
 * @param {StreamHandler} handler
 */
export const onStop = handler => client.on('stop', handler);

/**
 * Registers a callback to be called when a request to zoom a stream has been received
 *
 * @param {StreamHandler} handler
 */
export const onZoom = handler => client.on('zoom', handler);

/**
 * Registers a callback to be called when request to reset all streams has been received
 *
 * @param {Function} handler
 */
export const onReset = handler => client.on('reset', handler);

/**
 * Registers a callback to be called when a request to restart the client has been received
 *
 * @param {Function} handler
 */
export const onRestart = handler => client.on('restart', handler);

/**
 * Registers a callback to be called when the client has been disconnected from the server
 *
 * @param {Function} handler
 */
export const onDisconnect = handler => client.on('disconnect', handler);
