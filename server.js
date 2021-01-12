const express = require('express')
const connectDB = require('./dB/connection.js')
const app = express();

connectDB();

app.use(express.json({ extended: false }));

app.use('/uploads', express.static(__dirname + '/public'));

app.use('/api/user',require('./Controllers/userController'))
app.use('/api/chat',require('./Controllers/chatController'))
app.use('/api/products',require('./Controllers/productController'))
app.use('/api/categories',require('./Controllers/categoryController'))
app.use('/api/brands',require('./Controllers/brandController'))
app.use('/api/posts',require('./Controllers/postController'))
app.use('/api/events',require('./Controllers/eventController'))

//const Port = process.env.Port || 3000
app.listen(process.env.PORT || 3000)
//app.listen(Port,() => console.log('server started'))
