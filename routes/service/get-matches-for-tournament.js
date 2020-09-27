/* eslint-disable no-param-reassign */
const config = require('config');
const bent = require('bent');
const { log, getMatches } = require('../../lib');
const getParticipans = require('../../lib/get-participants');

const AKL_CORE_BACKEND_URL = config.get('coreBackendUrl');

const getTeam = bent(AKL_CORE_BACKEND_URL, 'GET', 'json', 200);

const schema = {
  description: 'Get matches for the tournament in a more useful form.',
  summary: 'Pretty get matches',
  tags: ['Service'],
  params: {
    type: 'object',
    properties: {
      tournamentID: {
        type: 'string',
        description: 'Challonge ID for the tournament',
      },
    },
  },
  query: {
    type: 'object',
    properties: {
      matchStatus: {
        type: 'string',
        enum: ['all', 'pending', 'open', 'complete'],
        default: 'open',
        description: 'Return matches based on their status.',
      },
    },
  },
};

// TODO: Rewrite this shit
const handler = async (req, reply) => {
  const { matchStatus } = req.query;

  let matches;
  try {
    matches = await getMatches(req.params.tournamentID,
      matchStatus);
  } catch (error) {
    log.error('Error when trying to get matches! ', error);
    reply.status(500).send({
      status: 'ERROR',
      error: 'Internal Server Error',
    });
    return;
  }

  if (!matches || matches.length < 1) {
    reply.status(404).send({
      status: 'ERROR',
      error: 'Not Found',
      message: 'No matches found for this tournament!',
    });
    return;
  }

  let participants;
  try {
    participants = await getParticipans(req.params.tournamentID);
  } catch (error) {
    log.error('Error when trying to get participants! ', error);
    reply.status(500).send({
      status: 'ERROR',
      error: 'Internal Server Error',
    });
    return;
  }

  if (!participants || participants.length < 1) {
    reply.status(404).send({
      status: 'ERROR',
      error: 'Not Found',
      message: 'Participants not found for tournament',
    });
    return;
  }

  const promises = [];
  const searchedTeams = [];
  let prettyMatches = [];
  matches.forEach((matchElement) => {
    const { match } = matchElement;

    const prettyMatch = {
      matchId: match.id,
      teamOne: match.player1_id,
      teamOneName: '',
      teamOneCoreId: '',
      teamTwo: match.player2_id,
      teamTwoName: '',
      teamTwoCoreId: '',
      round: match.round,
    };

    participants.forEach((participantElement) => {
      const { participant } = participantElement;
      if (participant.id === match.player1_id
        || (participant.group_player_ids.length === 1
          && participant.group_player_ids[0] === match.player1_id)) {
        prettyMatch.teamOneName = participant.name;
      } else if (participant.id === match.player2_id
        || (participant.group_player_ids.length === 1
          && participant.group_player_ids[0] === match.player2_id)) {
        prettyMatch.teamTwoName = participant.name;
      }

      if (!searchedTeams.includes(participant.name)) {
        promises.push(getTeam(`/team/teamName/${participant.name}/info`));
        searchedTeams.push(participant.name);
      }
    });

    prettyMatches.push(prettyMatch);
  });

  let results;
  try {
    results = await Promise.all(promises.map((p) => p.catch((e) => e)));
  } catch (error) {
    log.error('Looking for all the teams failed! ', error);
    return;
  }

  const validResults = results.filter((result) => !(result instanceof Error));

  validResults.forEach((team) => {
    prettyMatches.forEach((prettyMatch) => {
      if (prettyMatch.teamOneName === team.teamName) {
        prettyMatch.teamOneCoreId = team._id;
      } else if (prettyMatch.teamTwoName === team.teamName) {
        prettyMatch.teamTwoCoreId = team._id;
      } else {
        prettyMatch.remove = true;
      }
    });
  });

  prettyMatches = prettyMatches.filter((match) => !(match.remove));

  reply.send({
    status: 'OK',
    matches: prettyMatches,
  });
};

module.exports = async function (fastify) {
  fastify.route({
    method: 'GET',
    url: '/:tournamentID/matches',
    handler,
    schema,
  });
};
