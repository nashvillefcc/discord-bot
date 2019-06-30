const { RichEmbed } = require('discord.js');
const thumbnailURL = 'https://i.imgur.com/pERFswi.png';
const dateStringFormatter = require('./dateStringFormatter');

module.exports = function(nextEvent, date) {
  return new RichEmbed()
    .setTitle(`${nextEvent.name} ${dateStringFormatter(date)}`)
    .setURL(nextEvent.link)
    .setThumbnail(thumbnailURL)
    .setDescription(
      nextEvent.description.replace(/<[^>]*>?/gm, '').slice(0, 280) +
        '... (Click title link for full description)'
    )
    .addField('Attention', '@everyone');
};
