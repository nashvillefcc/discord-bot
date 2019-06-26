const { Client, RichEmbed } = require('discord.js');
const schedule = require('node-schedule');
const eventFetcher = require('./services/eventFetcher');
const presenceGenerator = require('./controllers/presenceGenerator');
const dotenv = require('dotenv');
dotenv.config();
const token = process.env.TOKEN;
const commandHandler = require('./controllers/commandHandler');

const bot = new Client();

bot.once('ready', () => {
  bot.user.setPresence(presenceGenerator());
  console.log('Ready...');
  schedule.scheduleJob('* 7 * * *', async () => {
    eventFetcher.todayEventFetcher(bot);
  });
  schedule.scheduleJob('* /4 * * *', () => {
    bot.user.setPresence(presenceGenerator());
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
