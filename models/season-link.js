const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const schema = new Schema({
  coreSeasonId: {
    type: ObjectId,
    required: true,
    unique: true,
  },
  challongeSeasonId: {
    type: String,
    required: true,
    unique: true,
  },
  seasonName: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('seasonLinks', schema);
