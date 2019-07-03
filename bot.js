const { Client, RichEmbed } = require('discord.js');
const schedule = require('node-schedule-tz');
const eventFetcher = require('./services/eventFetcher');
const presenceGenerator = require('./helpers/presenceGenerator');
const dotenv = require('dotenv');
dotenv.config();
const token = process.env.TOKEN;
const commandHandler = require('./controllers/commandHandler');

require('http')
  .createServer(async (req, res) => {
    res.statusCode = 200;
    res.write('ok');
    res.end();
  })
  .listen(3000, () => console.log('Now listening on port 3000'));

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
