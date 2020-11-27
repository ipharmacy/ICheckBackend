const mongoose = require('mongoose');

const product = new mongoose.Schema({
  name: {
    type: String
  },
  description: {
    type: String
  },
  Brandlogo: {
    type: String
  },
  image: {
    type: String
  }
},{timestamps:true})
const Product = mongoose.model('products', product);
module.exports = Product

