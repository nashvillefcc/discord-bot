const fetch = require('node-fetch');
const channelIds = require('../data/channel_ids');
const eventMessageCreator = require('../helpers/eventMessageCreator');
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  async fetchAnnounced(bot) {
    const notifications = await fetch('https://api.meetup.com/notifications', {
      headers: { Authorization: `Bearer ${process.env.ACCESS_TOKEN}` }
    })
      .then(response => response.json())
      .then(data => data)
      .catch(err => console.log(err));
    notifications
      .filter(
        n => n.kind === 'event_announce' && n.target.group_id === '22817838'
      )
      .map(event => {
        const now = new Date.now();
        if (now - event.updated < 300000) {
          const event_id = event.target.event_id;
          fetch(
            `https://api.meetup.com/freeCodeCamp-Nashville/events/${event_id}`
          )
            .then(response => response.json())
            .then(event => {
              switch (event.name) {
                case 'Mentor Night':
                  {
                    bot.channels
                      .get(channelIds.mentorNight_announcements)
                      .send(eventMessageCreator(event));
                  }
                  break;
                default:
                  {
                    bot.channels
                      .get(channelIds.monthlyMeetup_announcements)
                      .send(eventMessageCreator(event));
                  }
                  break;
              }
            })
            .catch(err => console.log(err));
        }
      });
  }
};
