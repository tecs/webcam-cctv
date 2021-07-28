/**
 * Stream sorter
 *
 * @param {Object} a
 * @param {Object} b
 * @returns {Number}
 */
export const sortDevices = (a, b) => {
  // Enabled streams first
  if ('enabled' in a) {
    if (a.enabled && !b.enabled) return -1;
    if (!a.enabled && b.enabled) return 1;
  }

  // Active streams first
  if ('active' in a) {
    if (a.active && !b.active) return -1;
    if (!a.active && b.active) return 1;
  }

  // Video streams first
  if (a.type === 'video' && b.type !== 'video') return -1;
  if (a.type !== 'video' && b.type === 'video') return 1;

  // Sort by client name
  if ('parentName' in a) {
    if (a.parentName < b.parentName) return -1;
    if (a.parentName > b.parentName) return 1;
  }

  // Sort by stream name
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;

  return 0;
};

/**
 * Splits a comma-separated string of streams into an array
 *
 * @param {String} [config]
 * @returns {String[]}
 */
export const parseStreams = config => (config ? config.split(',') : []);
