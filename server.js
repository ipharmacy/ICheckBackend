const express = require('express')
const connectDB = require('./dB/connection.js')
const scout = require("@scout_apm/scout-apm");

// The "main" function
async function start() {
  // Trigger the download and installation of the core-agent
  await scout.install({
    allowShutdown: true, // allow shutting down spawned scout-agent processes from this program
    monitor: true, // enable monitoring
    name: "",
    key: "",
  });

const app = express();

connectDB();

app.use(express.json({ extended: false }));

app.use('/uploads', express.static(__dirname + '/public'));

app.use('/api/user',require('./Controllers/userController'))
app.use('/api/products',require('./Controllers/productController'))
//app.use('/api/brands',require('./Controllers/brandController'))



const Port = process.env.Port || 3000
app.listen(process.env.PORT || 3000)
app.listen(Port,() => console.log('server started'))




  // Enable the app-wide scout middleware
  app.use(scout.expressMiddleware());

  // Add other middleware and routes
  // app.use( ... )
  // app.get( ... )

  // Start express
  app.start();
}

// If this script is executed directly, run the start function
if (require.main === module) { start(); }