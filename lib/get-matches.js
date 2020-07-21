const config = require('config');
const bent = require('bent');

const API_KEY = config.get('challonge.apiKey');

const get = bent('https://api.challonge.com/v1/',
  'GET', 'json', 200, 404, 406);

const getSingleTournament = async (tournamentID, matchState, challongeTeamID) => {
  const response = await get(`tournaments/${tournamentID}/matches
  ?api_key=${API_KEY}&state=${matchState}&participant_id=${challongeTeamID}`);

  if (response.errors) {
    throw response.errors;
  }

  return response;
};

module.exports = getSingleTournament;
