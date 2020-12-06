const mongoose = require('mongoose');
require('./Product');
const Schema = mongoose.Schema;

const favorite = new mongoose.Schema({
  product: {
    type: Schema.ObjectId,
    ref: 'products'
  }
},{timestamps:true})
const Favorite = mongoose.model('favorites', favorite);
module.exports = {
  FavoriteModel : Favorite,
  FavoriteSchema : favorite
}
