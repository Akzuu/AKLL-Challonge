const log = require('./logger');
const createTournament = require('./create-tournament');
const getSingleTournament = require('./get-tournament');
const addTeamToTournament = require('./add-team-to-tournament');
const getMatches = require('./get-matches');
const submitScore = require('./submit-score');

module.exports = {
  log,
  createTournament,
  getSingleTournament,
  addTeamToTournament,
  getMatches,
  submitScore,
};
