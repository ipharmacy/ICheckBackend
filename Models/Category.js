const mongoose = require('mongoose');


const category = new mongoose.Schema({
  name: {
    type: String
  },
  description: {
    type: String
  },
  image: {
    type: String
  }
},{timestamps:true})
const Category = mongoose.model('categories', category);
module.exports = Category
