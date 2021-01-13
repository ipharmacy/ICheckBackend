const mongoose = require('mongoose');
require('./User');
const Schema = mongoose.Schema;

const participation = new mongoose.Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'users'
  }
},{timestamps:true})
const Participation = mongoose.model('participations', participation);
module.exports = {
  ParticipationModel : Participation,
  ParticipationSchema : participation
}
