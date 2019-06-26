const { Client, RichEmbed } = require('discord.js');
const schedule = require('node-schedule');
const eventFetcher = require('./eventFetcher');
const dotenv = require('dotenv');
dotenv.config();
const token = process.env.TOKEN;
const commandHandler = require('./config/commandHandler');

const bot = new Client();

bot.once('ready', () => {
  bot.user.setPresence({
    game: {
      name: 'diagnostic sleep cycle',
      type: 'STREAMING'
    }
  });
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
