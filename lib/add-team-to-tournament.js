const config = require('config');
const bent = require('bent');

const API_KEY = config.get('challonge.apiKey');

const post = bent('https://api.challonge.com/v1/',
  'POST', 'json', 200, 404, 406);

const addTeamToTournament = async (tournamentID, payload) => {
  const body = payload;
  body.api_key = API_KEY;

  const response = await post(`tournaments/${tournamentID}/participants`, body);

  if (response.errors) {
    throw response.errors;
  }

  return response.participant;
};

module.exports = addTeamToTournament;
