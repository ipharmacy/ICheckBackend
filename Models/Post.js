const mongoose = require('mongoose');
require('./User');
const Schema = mongoose.Schema;

const post = new mongoose.Schema({
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
const Post = mongoose.model('posts', post);
module.exports = Post
