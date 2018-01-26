const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const http = require('http');
const WebSocket = require('ws');
const routes = require('./config/routes.js');

require('dotenv').load();

app.use(cors());

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

// setup WebSocket

const server = http.createServer(app);
const wss = new WebSocket.Server({ 
    server,
    verifyClient: (info) => {
           console.log('verify client', info.origin, info.secure);
           return true;
    }
});

wss.on('connection', function connection(ws, req) {
    console.log('connection', req);
    ws.on('message', function incoming(message) {
      console.log('received: %s', message);
      ws.send('thanks for your message');
    });
  
    ws.send('something');
  });

server.listen(port, function() {
    console.log(`server listening on port ${port}`);
})

//app.listen(port, function() {
 //console.log(`api running on port ${port}`);
//});
