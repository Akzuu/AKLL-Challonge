const { log, submitScore } = require('../../lib');

const schema = {
  description: 'Submit match score.',
  summary: 'Submit match score',
  tags: ['Match'],
  params: {
    type: 'object',
    properties: {
      tournamentID: {
        type: 'string',
        description: 'Challonge ID for the tournament',
      },
      matchID: {
        type: 'string',
        description: 'Challonge ID for the match',
      },
    },
  },
  body: {
    type: 'object',
    properties: {
      scores: {
        type: 'string',
        example: '1-3,2-3',
        description: 'Comma separated set/game scores with player 1 score first (e.g. "1-3,3-0,3-2")',
      },
      winnerID: {
        type: 'string',
        description: 'The participant ID of the winner or "tie" if applicable (Round Robin and Swiss). NOTE: If you change the outcome of a completed match, all matches in the bracket that branch from the updated match will be reset.',
      },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
        },
      },
    },
  },
};

const handler = async (req, reply) => {
  const { tournamentID, matchID } = req.params;
  const { scores, winnerID } = req.body;

  try {
    await submitScore(tournamentID, matchID, {
      scores_csv: scores,
      winner_id: winnerID,
    });
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
  });
};

module.exports = async function (fastify) {
  fastify.route({
    method: 'POST',
    url: '/:tournamentID/matches/:matchID/submit',
    handler,
    schema,
  });
};
