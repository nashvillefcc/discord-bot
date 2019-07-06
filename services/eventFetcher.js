const fetch = require('node-fetch');
const todaysDateCreator = require('../helpers/todaysDateCreator');
const eventMessageCreator = require('../helpers/eventMessageCreator');
const channelIds = require('../data/channelIds');
const eventURL = `https://api.meetup.com/freeCodeCamp-Nashville/events?&sign=true&photo-host=public&page=1`;

module.exports = {
  async todayEventFetcher(bot) {
    const todaysDate = todaysDateCreator();
    const nextEvent = await fetch(eventURL)
      .then(response => response.json())
      .then(body => body[0]);
    if (nextEvent.local_date === todaysDate) {
      switch (nextEvent.name) {
        case 'Mentor Night': {
          const mnMessage = eventMessageCreator(nextEvent);
          bot.channels
            .get(channelIds.mentorNight_announcements)
            .send(mnMessage);
          break;
        }
        default: {
          const mmMessage = eventMessageCreator(nextEvent);
          bot.channels
            .get(channelIds.monthlyMeetup_announcements)
            .send(mmMessage);
          break;
        }
      }
    }
  },
  async nextEventFetcher(message) {
    const channel = message.channel;
    const nextEvent = await fetch(eventURL)
      .then(response => response.json())
      .then(body => body[0]);
    const nextEventMessage = eventMessageCreator(nextEvent);
    channel.send(nextEventMessage);
  },
};
