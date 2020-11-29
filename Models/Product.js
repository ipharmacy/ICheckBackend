const mongoose = require('mongoose');
const Schema = mongoose.Schema
const Review = require('./Review').ReviewSchema; 
const product = new mongoose.Schema({
  name: {
    type: String
  },
  description: {
    type: String
  },
  image: [String],
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
  reviews:[Review]


},{timestamps:true})
const Product = mongoose.model('products', product);
module.exports = Product

