module.exports = function(date) {
  return `${date
    .toLocaleString('en-US')
    .slice(0, date.toLocaleString('en-US').indexOf(','))} ${date.toLocaleString(
    'en-US',
    {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }
  )}`;
};
