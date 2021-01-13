const mongoose = require('mongoose');
const Participation = require('./Participation').ParticipationSchema; 
require('./User');
const Schema = mongoose.Schema;

const event = new mongoose.Schema({
  title: {
    type: String
  },
  description: {
    type: String
  },
  user: {
    type: Schema.ObjectId,
    ref: 'users'
  },
  participations:[Participation]
},{timestamps:true})
const Event = mongoose.model('events', event);
module.exports = Event
