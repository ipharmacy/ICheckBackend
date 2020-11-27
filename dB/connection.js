const mongoose = require('mongoose');

const URI ="mongodb+srv://dbYoussef:31121998m@icheck.mlagr.mongodb.net/db_icheck?retryWrites=true&w=majority";

const connectDB = async () => {
  await mongoose.connect(URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });
  console.log('db connected..!');
};

module.exports = connectDB;