const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./config/routes.js');
const auth = require('./config/auth.js');
const session = require('express-session');
const passport = require('passport');

const app = express();

require('dotenv').load();
require('./config/passport.js')(passport);

const port = process.env.PORT || 4000;

// db config
const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useMongoClient: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// configure body parser for json format
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// To prevent errors from Cross Origin Resource Sharing, we will set our headers to allow CORS with middleware like so:
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  //and remove cacheing so we get the most recent comments
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

// Initiate express-session and passport
app.use(session({
  secret: 'fcc-nightlife',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Defines api route root
routes(app);
auth(app, passport);

// Serve static assets
app.use(express.static(path.resolve('build')));

app.get('*', function(req, res) {
  res.sendFile(path.resolve('build', 'index.html'));
});

app.listen(port, function() {
 console.log(`api running on port ${port}`);
});
