const { log, getSingleTournament } = require('../../lib');

const schema = {
  description: 'Get a tournament from Challonge',
  summary: 'Get a tournament',
  tags: ['Tournament'],
  params: {
    type: 'object',
    properties: {
      tournamentID: {
        type: 'string',
        description: 'Challonge ID for the tournament',
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
    //     tournamentID: {
    //       type: 'string',
    //     },
    //   },
    // },
  },
};

const handler = async (req, reply) => {
  let tournament;
  try {
    tournament = await getSingleTournament(req.params.tournamentID);
  } catch (error) {
    log.error('Error when trying to get the tournament!', error);
    reply.status(500).send({
      status: 'ERROR',
      message: 'Internal Server Error',
    });
    return;
  }

  reply.send({
    status: 'OK',
    tournament,
  });
};

module.exports = async function (fastify) {
  fastify.route({
    method: 'GET',
    url: '/id/:tournamentID',
    handler,
    schema,
  });
};
