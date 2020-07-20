const { log, addTeamToTournament } = require('../../lib');

const schema = {
  description: 'Add team to existing challonge tournament.',
  summary: 'Add a participant',
  tags: ['Participant'],
  params: {
    type: 'object',
    properties: {
      tournamentID: {
        type: 'string',
        description: 'Challonge ID for the tournament',
      },
    },
  },
  body: {
    type: 'object',
    properties: {
      teamName: {
        type: 'string',
        description: 'Name for the tournament',
      },
      teamID: {
        type: 'string',
      },
    },
    required: ['teamName', 'teamID'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
        },
        tournamentID: {
          type: 'number',
        },
      },
    },
  },
};

const handler = async (req, reply) => {
  const {
    teamName, teamID,
  } = req.body;

  try {
    await addTeamToTournament(req.params.tournamentID, {
      name: teamName,
      misc: teamID,
    });
  } catch (error) {
    log.error('Error when trying to create a tournament! ', error);
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
    url: '/:tournamentID/addteam',
    handler,
    schema,
  });
};
