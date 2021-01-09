const mongoose = require('mongoose');
require('./User');
const Schema = mongoose.Schema;

const friendship = new mongoose.Schema({
	Accepted: {
    	type: Number
  	},
  	user: {
    	type: Schema.ObjectId,
    	ref: 'users'
  	}
},{timestamps:true})
const Friendship = mongoose.model('friendships', friendship);
module.exports = {
  FriendshipModel : Friendship,
  FriendshipSchema : friendship
}
