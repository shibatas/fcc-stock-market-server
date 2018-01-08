const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./config/routes.js');
const auth = require('./config/auth.js');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');

const app = express();
app.use(cors());

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
