const config = require('config');
const bent = require('bent');

const API_KEY = config.get('challonge.apiKey');

const put = bent('https://api.challonge.com/v1/',
  'PUT', 'json', 200, 404, 406);

const createTournament = async (tournamentID, matchID, payload) => {
  const body = payload;
  body.api_key = API_KEY;
  body.url = payload.name;

  const response = await put(`tournaments/${tournamentID}/matches/${matchID}`,
    body);

  if (response.errors) {
    throw response.errors;
  }

  return response.tournament;
};

module.exports = createTournament;
