const presences = require('../data/presences');

module.exports = function() {
  return presences[Math.floor(Math.random() * presences.length)];
};
