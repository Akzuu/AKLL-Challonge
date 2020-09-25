// const config = require('config');
// const bent = require('bent');
// const { TeamLink } = require('../models');
// const log = require('./logger');

// const AKL_CORE_BACKEND_URL = config.get('coreBackendUrl');

// const getTeam = bent(AKL_CORE_BACKEND_URL, 'GET', 'json', 200);

// const linkTeamIds = async (teamsObject) => {
//   const teamsObj = teamsObject;

//   const teamsObjectKeys = Object.keys(teamsObject);
//   const promises = [];
//   const payload = {};
//   teamsObjectKeys.forEach((teamId) => {
//     promises.push(getTeam(`/team/teamName/${teamsObject[teamId].teamName}/info`));
//   });

//   const results = await Promise.all(promises);
//   results.forEach((result) => {
//     payload[result.teamName].insertOne.document.teamCoreId = result._id;
//     teamsObj[payload[result.teamName].insertOne.document.teamParticipantChallongeId]
//       .teamCoreId = result._id;
//   });

//   const payloadKeys = Object.keys(payload);
//   const teamLinks = [];
//   payloadKeys.forEach((key) => {
//     teamLinks.push(payload[key]);
//   });

//   try {
//     await TeamLink.bulkWrite(teamLinks);
//   } catch (error) {
//     log.error('Links already done');
//   }

//   return teamsObj;
// };

// module.exports = linkTeamIds;
