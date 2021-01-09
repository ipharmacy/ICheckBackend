const mongoose = require('mongoose');
require('./User');
const Schema = mongoose.Schema;

const notification = new mongoose.Schema({
  receiver: {
    type: Schema.ObjectId,
    ref: 'users'
  },	
  title: {
    type: String
  },
  description: {
    type: String
  },
  image: {
    type: String
  },
  type: {
    type: String
  },
  link: {
    type: String
  }
},{timestamps:true})
const Notification = mongoose.model('notifications', notification);
module.exports = Notification
