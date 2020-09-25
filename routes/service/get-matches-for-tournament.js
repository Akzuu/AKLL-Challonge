const { log, getMatches } = require('../../lib');
const getParticipans = require('../../lib/get-participants');

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
    });
    return;
  }

  const payload = {};
  matches.forEach((elem) => {
    if (!payload[elem.match.player1_id]) {
      payload[elem.match.player1_id] = {
        teamName: '',
        teamChallongeId: '',
        teamParticipantChallongeId: elem.match.player1_id,
        matches: [],
      };
    }

    if (!payload[elem.match.player2_id]) {
      payload[elem.match.player2_id] = {
        teamName: '',
        teamChallongeId: '',
        teamParticipantChallongeId: elem.match.player2_id,
        matches: [],
      };
    }

    payload[elem.match.player1_id].matches.push({
      match_id: elem.match.id,
      teamOne: elem.match.player1_id,
      teamTwo: elem.match.player2_id,
      round: elem.match.round,
    });

    payload[elem.match.player2_id].matches.push({
      match_id: elem.match.id,
      teamOne: elem.match.player1_id,
      teamTwo: elem.match.player2_id,
      round: elem.match.round,
    });
  });

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

  // Add team names to next to Ids
  participants.forEach((elem) => {
    payload[elem.participant.group_player_ids].teamChallongeId = elem.participant.id;
    payload[elem.participant.group_player_ids].teamName = elem.participant.name;
  });

  const payloadKeys = Object.keys(payload);
  const teams = [];
  payloadKeys.forEach((key) => {
    teams.push(payload[key]);
  });

  reply.send({
    status: 'OK',
    teams,
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
