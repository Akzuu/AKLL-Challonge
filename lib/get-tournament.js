const config = require('config');
const bent = require('bent');

const API_KEY = config.get('challonge.apiKey');

const get = bent('https://api.challonge.com/v1/',
  'GET', 'json', 200, 404, 406);

const getSingleTournament = async (tournamentID) => {
  const response = await get(`tournaments/${tournamentID}?api_key=${API_KEY}`);

  if (response.errors) {
    throw response.errors;
  }

  return response.tournament;
};

module.exports = getSingleTournament;
