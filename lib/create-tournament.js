const config = require('config');
const bent = require('bent');

const API_KEY = config.get('challonge.apiKey');

const post = bent('https://api.challonge.com/v1/',
  'POST', 'json', 200, 401, 404, 406, 422, 500);

const createTournament = async (payload) => {
  const body = payload;
  body.api_key = API_KEY;
  body.url = payload.name;

  const tournament = await post('tournaments', body);

  if (tournament.errors) {
    throw tournament.errors;
  }

  return tournament;
};

module.exports = createTournament;
