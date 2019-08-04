const fetch = require('node-fetch');
const channelIds = require('../data/channelIds');
const eventMessageCreator = require('../helpers/eventMessageCreator');

module.exports = {
  async fetchAnnounced(bot, accessToken) {
    const notifications = await fetch('https://api.meetup.com/notifications', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(response => response.json())
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
            .then(eventDetails => {
              switch (eventDetails.name) {
                case 'Mentor Night':
                  {
                    bot.channels
                      .get(channelIds.mentorNight_announcements)
                      .send('@everyone\n' + eventMessageCreator(eventDetails));
                  }
                  break;
                default:
                  {
                    bot.channels
                      .get(channelIds.monthlyMeetup_announcements)
                      .send('@everyone\n' + eventMessageCreator(eventDetails));
                  }
                  break;
              }
            })
            .catch(err => console.log(err));
        }
      });
  }
};
