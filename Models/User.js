const mongoose = require('mongoose');

const Favorite = require('./Favorite').FavoriteSchema; 
const user = new mongoose.Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  phone: {
    type: String
  },
  sexe: {
    type: String
  },
  avatar: {
    type: String
  },
  favorites:[Favorite]
},{timestamps:true})

const User = mongoose.model('users', user);
module.exports = User