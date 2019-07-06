const { Client } = require('discord.js');
const schedule = require('node-schedule-tz');
const eventFetcher = require('./services/eventFetcher');
const presenceGenerator = require('./helpers/presenceGenerator');
const dotenv = require('dotenv');
dotenv.config();
const token = process.env.TOKEN;
const commandHandler = require('./controllers/commandHandler');
const announceFetcher = require('./services/announceFetcher');
const meetupTokenRefresher = require('./services/meetupTokenRefresher');

require('http')
  .createServer(async (req, res) => {
    console.log(req);
    res.statusCode = 200;
    res.write('ok');
    res.end();
  })
  .listen(3000, () => console.log('Now listening on port 3000'));

const bot = new Client();

const everyMorningAtSeven = new schedule.RecurrenceRule();
everyMorningAtSeven.hour = 12;
everyMorningAtSeven.minute = 0;

bot.once('ready', () => {
  bot.user.setPresence(presenceGenerator());
  console.log('Ready...');
  // sets a new presence every 30 minutes
  schedule.scheduleJob('* /30 * * * *', () => {
    bot.user.setPresence(presenceGenerator());
  });
  // checks for an event at 7 o'clock every morning
  schedule.scheduleJob(everyMorningAtSeven, async () => {
    eventFetcher.todayEventFetcher(bot);
  });
  // checks for event announcements every 5 minutes
  schedule.scheduleJob('* /5 * * * *', () => {
    announceFetcher.fetchAnnounced(bot, process.env.ACCESS_TOKEN);
  });
  // refreshes the access token on the 1st of every month
  schedule.scheduleJob('* * * 1 * *', () => {
    meetupTokenRefresher(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REFRESH_TOKEN
    );
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
