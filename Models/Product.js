const mongoose = require('mongoose');

const product = new mongoose.Schema({
  name: {
    type: String
  },
  description: {
    type: String
  },
  image: {
    type: String
  },
  brand: {
    type: String
  },
  category: {
    type: String
  },
  address: {
    type: String
  },
  available: {
    type: String
  },
  rate: {
    type: String
  }

},{timestamps:true})
const Product = mongoose.model('products', product);
module.exports = Product

