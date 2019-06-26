const { Client, RichEmbed } = require('discord.js');
const schedule = require('node-schedule-tz');
const eventFetcher = require('./services/eventFetcher');
const presenceGenerator = require('./controllers/presenceGenerator');
const http = require('http');
const dotenv = require('dotenv');
dotenv.config();
const token = process.env.TOKEN;
const commandHandler = require('./controllers/commandHandler');

const bot = new Client();

bot.once('ready', () => {
  bot.user.setPresence(presenceGenerator());
  console.log('Ready...');
  schedule.scheduleJob(
    { hour: 7, minute: 00, tz: 'America/Chicago' },
    async () => {
      eventFetcher.todayEventFetcher(bot);
    }
  );
  schedule.scheduleJob('* * /4 * * *', 'America/Chicago', () => {
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
