const { RichEmbed } = require('discord.js');
const fetch = require('node-fetch');
const todaysDateCreator = require('../helpers/todaysDateCreator');
const embedCreator = require('../helpers/embedCreator');
const channelIds = require('../data/channel_ids');
const eventURL = `https://api.meetup.com/freeCodeCamp-Nashville/events?&sign=true&photo-host=public&page=1`;

module.exports = {
  async todayEventFetcher(bot) {
    const todaysDate = todaysDateCreator();
    const nextEvent = await fetch(eventURL)
      .then(response => response.json())
      .then(body => body[0]);
    if (nextEvent.local_date === todaysDate) {
      const date = new Date(`${nextEvent.local_date} ${nextEvent.local_time}`);
      switch (nextEvent.name) {
        case 'Mentor Night':
          const mnEmbed = embedCreator(nextEvent, date);
          bot.channels.get(channelIds.mentorNight_announcements).send(mnEmbed);
          break;
        default:
          const defaultEmbed = embedCreator(nextEvent, date);
          bot.channels
            .get(channelIds.monthlyMeetup_announcements)
            .send(defaultEmbed);
          break;
      }
    }
  },
  async nextEventFetcher(message) {
    const channel = message.channel;
    const nextEvent = await fetch(eventURL)
      .then(response => response.json())
      .then(body => body[0]);
    const date = new Date(`${nextEvent.local_date} ${nextEvent.local_time}`);
    const embed = embedCreator(nextEvent, date);
    channel.send(embed);
  }
};
