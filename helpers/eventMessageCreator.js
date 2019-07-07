module.exports = event => {
  return `**Event:**\n${event.name}\n\n**When:**\n${new Date(
    `${event.local_date} ${event.local_time}`
  ).toLocaleString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })}\n\n**Where:**\n${event.venue.name}\n${event.venue.address_1}\n${
    event.venue.city
  }, ${event.venue.state} ${event.venue.zip}\n\n${event.link}`;
};
