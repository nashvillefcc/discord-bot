const eventFetcher = require('../services/eventFetcher');
const { RichEmbed } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

module.exports = message => {
  switch (message.content) {
    case '!test': {
      return 'Test message from my laptop.';
    }
    case '!help':
    case '!commands': {
      return `__Commands__:
    - !test: Returns a test message.
    - !time: Returns the local time.
    - !next-event: Returns info for the next freeCodeCamp event
    - !mods: get a list of moderators/admins currently online`;
    }
    case '!time': {
      return `The time is now ${new Date().toLocaleTimeString('en-US', {
        timeZone: 'America/Chicago',
        hour: '2-digit',
        minute: '2-digit'
      })}.`;
    }
    case `!next-event`: {
      return eventFetcher.nextEventFetcher(message);
    }
    case `!disturb`: {
      return `Leave me alone! I'm having private time!`;
    }
    case `!didyoueverthinkyoumayenjoyasausage`: {
      return new RichEmbed().setImage('https://i.redd.it/uqxma5zdzqk11.png');
    }
    case `!mods`:
      {
        const admins = message.guild.members
          .filter(
            m =>
              m._roles.includes('563146021706661909') ||
              m._roles.includes('588375598553104434')
          )
          .filter(a => a.presence.status === 'online');
        admins.map(a => message.channel.send(`${a}`));
      }
      break;
    default:
      return '';
  }
};
