const { Client, RichEmbed } = require('discord.js');
const schedule = require('node-schedule-tz');
const eventFetcher = require('./services/eventFetcher');
const presenceGenerator = require('./helpers/presenceGenerator');
const dotenv = require('dotenv');
const http = require('http');
dotenv.config();
const token = process.env.TOKEN;
const commandHandler = require('./controllers/commandHandler');

const express = require('express');
const app = express();
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendStatus(200);
});
app.listen(process.env.PORT || 3000);

setTimeout(() => {
  http.get(`https://${process.env.PROJECT_DOMAIN}.glitch.me`);
}, 240000);

const bot = new Client();

const everyMorningAtSeven = new schedule.RecurrenceRule();
everyMorningAtSeven.hour = 7;
everyMorningAtSeven.minute = 0;
everyMorningAtSeven.tz = 'America/Chicago';

bot.once('ready', () => {
  bot.user.setPresence(presenceGenerator());
  console.log('Ready...');
  schedule.scheduleJob('* /30 * * * *', () => {
    bot.user.setPresence(presenceGenerator());
  });
  schedule.scheduleJob(everyMorningAtSeven, async () => {
    eventFetcher.todayEventFetcher(bot);
  });
});

bot.on('message', async message => {
  if (message.content[0] === '!') {
    const response = await commandHandler(message);
    if (response) {
      message.channel.send(response);
    }
  }
});

bot.on('guildMemberAdd', member => {
  bot.channels
    .get('542870629737824279')
    .send(
      `Greetings <@${
        member.id
      }>. This discord server has a bot (me!). Please use <#586210139053228042> to introduce yourself. Type \`!help\` or \`!commands\` to see things I can help you with.`
    );
});

bot.login(token);
