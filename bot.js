const { Client } = require('discord.js');
const announceFetcher = require('./services/announceFetcher');
const meetupTokenRefresher = require('./services/meetupTokenRefresher');
const dotenv = require('dotenv');
const ytdl = require('ytdl-core-discord');
const { RecurrenceRule, scheduleJob } = require('node-schedule');
const commandHandler = require('./controllers/commandHandler');
const presenceGenerator = require('./helpers/presenceGenerator');
const eventFetcher = require('./services/eventFetcher');
dotenv.config();

const token = process.env.TOKEN;

require('http')
  .createServer(async (req, res) => {
    console.log(req);
    res.statusCode = 200;
    res.write('ok');
    res.end();
  })
  .listen(3000, () => console.log('Now listening on port 3000'));

const bot = new Client();

const everyMorningAtEight = new RecurrenceRule();
everyMorningAtEight.hour = 13;
everyMorningAtEight.minute = 0;

async function play(connection, url) {
  connection.playOpusStream(await ytdl(url));
}

bot.once('ready', () => {
  bot.user.setPresence(presenceGenerator());
  console.log('Ready...');
  scheduleJob('* /30 * * * *', () => {
    bot.user.setPresence(presenceGenerator());
  });
  scheduleJob(everyMorningAtEight, async () => {
    eventFetcher.todayEventFetcher(bot);
  });
  scheduleJob('* /5 * * * *', () => {
    announceFetcher.fetchAnnounced(bot, process.env.ACCESS_TOKEN);
  });
  scheduleJob('* * * 1 * *', () => {
    meetupTokenRefresher(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REFRESH_TOKEN
    );
  });
  const voiceChannel = bot.channels.get('598594516580171817');
  voiceChannel.members.forEach(m => {
    if (m.id !== '593109197759971338') {
      m.setMute(true);
    } else {
      m.setMute(false);
    }
  });
  voiceChannel
    .join()
    .then(connection =>
      play(connection, 'https://www.youtube.com/watch?v=F0IbjVq-fgs')
    )
    .catch(err => console.log(err));
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
