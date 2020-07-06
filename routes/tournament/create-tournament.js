const { log, createTournament } = require('../../lib');

const schema = {
  description: 'Create a tournament to challonge.',
  summary: 'Create a tournament',
  tags: ['Tournament'],
  body: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Name for the tournament',
      },
      tournamentType: {
        type: 'string',
        enum: ['single elimination', 'double elimination', 'round robin', 'swiss'],
      },
      tournamentDescription: {
        type: 'string',
        description: 'Description/instructions to be displayed above the bracket',
      },
      swissRounds: {
        type: 'integer',
        minimium: 1,
        description: 'Number of swiss rounds. Only for swiss tournaments.',
      },
      subdomain: {
        type: 'string',
        description: 'E.g. akl when tournament will be located at akl.challonge.com',
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
  const {
    name, tournamentType, tournamentDescription, swissRounds,
  } = req.body;

  let tournament;
  try {
    tournament = await createTournament({
      name,
      tournament_type: tournamentType,
      description: tournamentDescription,
      swiss_rounds: swissRounds,
    });
  } catch (error) {
    log.error(error);
    reply.status(500).send({
      status: 'ERROR',
      message: 'Internal Server Error',
    });
    return;
  }

  reply.send({
    status: 'OK',
    tournamentID: tournament.id,
  });
};

module.exports = async function (fastify) {
  fastify.route({
    method: 'POST',
    url: '/create',
    handler,
    schema,
  });
};
