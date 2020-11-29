const mongoose = require('mongoose');
require('./User');
const Schema = mongoose.Schema;

const review = new mongoose.Schema({
  review: {
    type: String
  },
  rate: {
    type: String
  },
  user: {
    type: Schema.ObjectId,
    ref: 'users'
  }
},{timestamps:true})
const Review = mongoose.model('reviews', review);
module.exports = {
  ReviewModel : Review,
  ReviewSchema : review
}
