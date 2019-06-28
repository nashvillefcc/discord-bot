const { RichEmbed } = require('discord.js');
const fetch = require('node-fetch');
const dateStringFormatter = require('../helpers/dateStringFormatter');
const todaysDateCreator = require('../helpers/todaysDateCreator');
const channelIds = require('../data/channel_ids');

module.exports = {
  async todayEventFetcher(bot) {
    const todaysDate = todaysDateCreator();
    const nextEvent = await fetch(
      `https://api.meetup.com/freeCodeCamp-Nashville/events?&sign=true&photo-host=public&page=1`
    )
      .then(response => response.json())
      .then(body => body[0]);
    if (nextEvent.local_date === todaysDate) {
      const date = new Date(`${nextEvent.local_date} ${nextEvent.local_time}`);
      switch (nextEvent.name) {
        case 'Mentor Night':
          const mnEmbed = new RichEmbed()
            .setTitle(`Mentor Night ${dateStringFormatter(date)}`)
            .setURL(nextEvent.link)
            .setThumbnail(
              'https://secure.meetupstatic.com/photos/event/1/8/d/c/600_459726364.jpeg'
            )
            .setDescription(
              nextEvent.description.replace(/<[^>]*>?/gm, '').slice(0, 280) +
                '... (Click title link for full description)'
            );
          bot.channels.get(channelIds.mentorNight_announcements).send(mnEmbed);
          break;
        default:
          const defaultEmbed = new RichEmbed()
            .setTitle(`${nextEvent.title} ${dateStringFormatter(date)}`)
            .setURL(nextEvent.link)
            .setThumbnail('https://i.imgur.com/pERFswi.png')
            .setDescription(
              nextEvent.description.replace(/<[^>]*>?/gm, '').slice(0, 280) +
                '... (Click title link for full description)'
            );
          bot.channels
            .get(channelIds.monthlyMeetup_announcements)
            .send(defaultEmbed);
          break;
      }
    }
  },
  async nextEventFetcher(message) {
    const channel = message.channel;
    const nextEvent = await fetch(
      `https://api.meetup.com/freeCodeCamp-Nashville/events?&sign=true&photo-host=public&page=1`
    )
      .then(response => response.json())
      .then(body => body[0]);
    const date = new Date(`${nextEvent.local_date} ${nextEvent.local_time}`);
    const embed = new RichEmbed()
      .setTitle(`${nextEvent.name} ${dateStringFormatter(date)}`)
      .setURL(nextEvent.link)
      .setThumbnail('https://i.imgur.com/pERFswi.png')
      .setDescription(
        nextEvent.description.replace(/<[^>]*>?/gm, '').slice(0, 280) +
          '... (Click title link for full description)'
      );
    channel.send(embed);
  }
};
