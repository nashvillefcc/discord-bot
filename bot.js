const { Client, RichEmbed } = require('discord.js');
const schedule = require('node-schedule');
const eventFetcher = require('./eventFetcher');
const dotenv = require('dotenv');
dotenv.config();
const token = process.env.TOKEN;
const commandHandler = require('./commandHandler');

const bot = new Client();

bot.once('ready', () => {
  bot.user.setPresence({
    game: {
      name: 'robot pr0n',
      type: 'WATCHING'
    },
    status: 'dnd'
  });
  console.log('Ready...');
  schedule.scheduleJob('* 7 * * *', async () => {
    eventFetcher.todayEventFetcher(bot);
  });
});

bot.login(token);

bot.on('message', async message => {
  const response = await commandHandler(message);
  if (response) {
    message.channel.send(response);
  }
});

setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);
