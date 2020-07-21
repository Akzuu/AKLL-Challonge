const { log, getMatches } = require('../../lib');

const schema = {
  description: 'Get matches for the tournament.',
  summary: 'Get matches',
  tags: ['Match'],
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
        default: 'all',
        description: 'Return matches based on their status.',
      },
      challongeTeamID: {
        type: 'string',
        description: 'Return mathces for certain team. Must use the ID Challonge gave when registering team to tournament',
      },
    },
  },
  response: {
    // 200: {
    //   type: 'object',
    //   properties: {
    //     status: {
    //       type: 'string',
    //     },
    //   },
    // },
  },
};

const handler = async (req, reply) => {
  const { matchState, challongeTeamID } = req.query;

  let matches;
  try {
    matches = await getMatches(req.params.tournamentID,
      matchState, challongeTeamID);
  } catch (error) {
    log.error('Error when trying to get matches! ', error);
    reply.status(500).send({
      status: 'ERROR',
      message: 'Internal Server Error',
    });
    return;
  }

  reply.send({
    status: 'OK',
    matches,
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
