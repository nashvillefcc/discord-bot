const { Client } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const token = process.env.TOKEN;

const bot = new Client();

bot.once('ready', () => {
  console.log('ready...');
});

bot.login(token);

bot.on('message', message => {
  if (message.content === 'test') {
    message.channel.send('Your test worked');
  }
});
