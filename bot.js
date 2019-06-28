const { Client, RichEmbed } = require('discord.js');
const schedule = require('node-schedule-tz');
const eventFetcher = require('./services/eventFetcher');
const presenceGenerator = require('./helpers/presenceGenerator');
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
    { hour: 7, minute: 0, tz: 'America/Chicago' },
    async () => {
      eventFetcher.todayEventFetcher(bot);
    }
  );
  schedule.scheduleJob('* /30 * * * *', 'America/Chicago', () => {
    bot.user.setPresence(presenceGenerator());
  });
});

bot.login(token);

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

setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 240000);
