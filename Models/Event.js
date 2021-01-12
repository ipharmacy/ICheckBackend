const mongoose = require('mongoose');
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
  }
},{timestamps:true})
const Event = mongoose.model('events', event);
module.exports = Event
