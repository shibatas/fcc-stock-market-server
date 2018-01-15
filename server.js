const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());

const routes = require('./config/routes.js');

require('dotenv').load();

const port = process.env.PORT || 4000;

// db config
const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useMongoClient: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// configure body parser for json format
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Load routes
routes(app);

app.listen(port, function() {
 console.log(`api running on port ${port}`);
});
