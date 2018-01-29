const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const http = require('http');
const https = require('https');
const fs = require('fs');
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

// setup WebSocket
//const sslOptions = {
    //key: fs.readFileSync('key.pem', 'utf8'),
    //cert: fs.readFileSync('cert.pem', 'utf8')
//}

const server = http.createServer(app).listen(port, function() {
    console.log(`server listening on port ${port}`);
});

const wss = new WebSocket.Server({ 
    server: server
});

wss.on('connection', function connection(ws, req) {
    console.log('connection');
    ws.on('message', function incoming(message) {
      console.log('received: %s', message);
      ws.send(`Received: ${message}`);
    });
  
    ws.send('Successfully connected');
});

// Load routes
routes(app, wss);

//app.listen(port, function() {
// console.log(`api running on port ${port}`);
//});
