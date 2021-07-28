/**
 * @returns {Promise<{id: String, type: String, name: String}>}
 */
export const getDevices = async () => {
  await navigator.mediaDevices.getUserMedia({ audio: true, video: true});
  return navigator.mediaDevices.enumerateDevices()
    .then(devices => devices.filter(({ kind }) => ['videoinput', 'audioinput'].includes(kind)))
    .then(devices => devices.filter(({ deviceId }) => deviceId !== 'default'))
    .then(devices => devices.map(({ deviceId, kind, label }) => ({
      id: deviceId,
      type: kind.substr(0, 5),
      name: label,
    })));
}

/**
 * @param {String} deviceId
 * @param {Boolean} zoomed
 * @returns {Promise<MediaStream>}
 */
export const getVideo = (deviceId, zoomed) => navigator.mediaDevices.getUserMedia({
  audio: false,
  video: {
    deviceId,
    width: { ideal: zoomed ? 4096 : 320 },
    height: { ideal: zoomed ? 2160 : 240 },
  },
});

/**
 * @param {String} deviceId
 * @returns {Promise<MediaStream>}
 */
export const getAudio = deviceId => navigator.mediaDevices.getUserMedia({
  audio: { deviceId },
  video: false,
});
