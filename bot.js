const { Client } = require('discord.js');
const dotenv = require('dotenv');
const { RecurrenceRule, scheduleJob } = require('node-schedule');
const commandHandler = require('./controllers/commandHandler');
const presenceGenerator = require('./helpers/presenceGenerator');
const todayEventFetcher = require('./services/eventFetcher');
dotenv.config();
const token = process.env.TOKEN;

require('http')
  .createServer(async (req, res) => {
    console.log(req.query);
    res.statusCode = 200;
    res.write('ok');
    res.end();
  })
  .listen(3000, () => console.log('Now listening on port 3000'));

const bot = new Client();

const everyMorningAtSeven = new RecurrenceRule();
everyMorningAtSeven.hour = 12;
everyMorningAtSeven.minute = 0;

bot.once('ready', () => {
  bot.user.setPresence(presenceGenerator());
  console.log('Ready...');
  scheduleJob('* /30 * * * *', () => {
    bot.user.setPresence(presenceGenerator());
  });
  scheduleJob(everyMorningAtSeven, async () => {
    todayEventFetcher(bot);
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
