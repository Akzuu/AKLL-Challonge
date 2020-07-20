const config = require('config');
const bent = require('bent');

const API_KEY = config.get('challonge.apiKey');

const post = bent('https://api.challonge.com/v1/',
  'POST', 'json', 200, 404, 406);

const createTournament = async (payload) => {
  const body = payload;
  body.api_key = API_KEY;
  body.url = payload.name;

  const response = await post('tournaments', body);

  if (response.errors) {
    throw response.errors;
  }

  return response.tournament;
};

module.exports = createTournament;
