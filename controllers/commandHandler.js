const eventFetcher = require('../services/eventFetcher');
const { RichEmbed } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

module.exports = commandHandler = message => {
  switch (message.content) {
    case '!test': {
      return 'Test message.';
    }
    case '!help' || '!commands': {
      return `__Commands__:
    - !test: Returns a test message.
    - !time: Returns the local time.
    - !next-event: Returns info for the next freeCodeCamp event`;
    }
    case '!time': {
      return `The time is now ${new Date().toLocaleTimeString(undefined, {
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
    default:
      return '';
  }
};
