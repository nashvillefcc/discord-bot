const presences = require('../data/presences');

export default {
  function() {
    return presences[Math.floor(Math.random() * presences.length)];
  }
};
