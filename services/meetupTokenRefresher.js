const fetch = require('node-fetch');
const dotenv = require('dotenv');
dotenv.config();

module.exports = async (id, secret, refreshToken) => {
  return await fetch(
    `https://secure.meetup.com/oauth2/access?client_id=${id}&client_secret=${secret}&grant_type=refresh_token&refresh_token=${refreshToken}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }
  )
    .then(response => response.json())
    .catch(err => console.log(err));
};
