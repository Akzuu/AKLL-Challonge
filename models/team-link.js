const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const schema = new Schema({
  teamCoreId: {
    type: ObjectId,
    required: true,
  },
  teamChallongeId: {
    type: ObjectId,
    required: true,
    unique: true,
  },
  teamParticipantChallongeId: {
    type: ObjectId,
    required: true,
    unique: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('teamLinks', schema);
