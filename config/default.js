module.exports = {
  port: 3001,
  swagger: {
    host: 'localhost:3001',
    schemes: ['http', 'https'],
  },
  database: {
    mongo: {
      options: {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      },
    },
  },
  routePrefix: '/akll-challonge',
  fastifyOptions: {
    logger: false,
    ignoreTrailingSlash: true,
  },
};
