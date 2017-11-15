// Importing Node modules and initializing Express
const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  logger = require('morgan'),
  router = require('./router'),
  mongoose = require('mongoose'),
  config = require('./config/config'),
  helpers = require('./helpers');

const path = require('path');
const debug = require('debug')('mon-gen:server');
// Database Setup
mongoose.connect(config.database);

// Start the server
let server;
if (process.env.NODE_ENV != config.test_env) {
  const port = helpers.normalizePort(config.port);

  server = app.listen(port);
  console.log(`Your server is running on port ${config.port}.`);
} else{
  server = app.listen(config.test_port);
}

// Setting up basic middleware for all Express requests
app.use(bodyParser.urlencoded({ extended: false })); // Parses urlencoded bodies
app.use(bodyParser.json()); // Send JSON responses
app.use(logger('dev')); // Log requests to API using morgan

// Enable CORS from client-side
app.use((req, res, next) => {
  // res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// Import routes to be served
router(app);
// call by default index.html page


// // Serve static assets
// app.use(express.static(path.resolve(__dirname, 'public', 'build')));
//
// // Always return the main index.html, so react-router render the route in the client
// app.get('*', (req, res) => {
//   console.log('---', 'AAAAAAAAAAAAAAAAAAAAAAAAAaa');
//   res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
// });
app.use(express.static(`${__dirname}/public`));
app.get('*', (req, res) => {
  console.log('---', 'AAAAAAAAAAAAAAAAAAAAAAAAAaa');
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});


const socketIO = require('socket.io');
let io = socketIO(server);

require('./controllers/socketEvents')(io);

// necessary for testing
module.exports = server;