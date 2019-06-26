const { RichEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  async todayEventFetcher(bot) {
    const today = new Date().toISOString().slice(0, 10);
    const nextEvent = await fetch(
      `https://api.meetup.com/freeCodeCamp-Nashville/events?&sign=true&photo-host=public&page=1`
    )
      .then(response => response.json())
      .then(body => body[0]);
    if (nextEvent.local_date === today) {
      switch (nextEvent.name) {
        case 'Mentor Night': {
          const embed = new RichEmbed()
            .setTitle(`@here Mentor Night ${today}`)
            .setURL(nextEvent.link)
            .setImage(
              'https://secure.meetupstatic.com/photos/event/1/8/d/c/600_459726364.jpeg'
            )
            .setDescription(
              nextEvent.description.replace(/<[^>]*>?/gm, '').slice(0, 280) +
                '... (Click title link for full description)'
            );
          bot.channels.get('586211310434254848').send(embed);
        }
        default: {
          const embed = new RichEmbed()
            .setTitle(`@here ${nextEvent.title} ${today}`)
            .setURL(nextEvent.link)
            .setImage('https://i.imgur.com/pERFswi.png')
            .setDescription(
              nextEvent.description.replace(/<[^>]*>?/gm, '').slice(0, 280) +
                '... (Click title link for full description)'
            );
          bot.channels.get('586213122008809487').send(embed);
        }
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
    const embed = new RichEmbed()
      .setTitle(nextEvent.name)
      .setURL(nextEvent.link)
      .setThumbnail('https://i.imgur.com/pERFswi.png')
      .setDescription(
        nextEvent.description.replace(/<[^>]*>?/gm, '').slice(0, 280) +
          '... (Click title link for full description)'
      );
    channel.send(embed);
  }
};
