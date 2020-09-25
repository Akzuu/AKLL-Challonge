const config = require('config');
const bent = require('bent');

const API_KEY = config.get('challonge.apiKey');

const get = bent('https://api.challonge.com/v1/',
  'GET', 'json', 200);

const getParticipans = async (tournamentID) => {
  const response = await get(`tournaments/${tournamentID}/participants?api_key=${API_KEY}`);

  if (response.errors) {
    throw response.errors;
  }

  return response;
};

module.exports = getParticipans;
