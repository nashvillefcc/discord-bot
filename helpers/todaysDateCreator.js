module.exports = function() {
  const today = new Date(
    new Date().toLocaleString('en-US', {
      timeZone: 'America/Chicago'
    })
  );
  const todaysDate = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
  )
    .toISOString()
    .split('T')[0];
  return todaysDate;
};
