const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const https = require('https');
const fs = require('fs');
const proxyServer = require('http-proxy').createProxyServer({secure: false});
const WebSocket = require('ws');
const routes = require('./config/routes.js');

require('dotenv').load();

const mainApp = express();
mainApp.use(cors());

const portHttp = process.env.PORT || 4000;
const portHttps = process.env.PORT_SECURE || 4001;

// db config
const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useMongoClient: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// configure body parser for json format
mainApp.use(bodyParser.urlencoded({ extended: true }));
mainApp.use(bodyParser.json());

// Route all traffic to https server
mainApp.all('/*', function(req, res) {
    console.log('redirect to https');
    //res.send('redirect to https');
    proxyServer.web(req, res, {target: 'https://0.0.0.0:8081'});
});

// HTTP server
const serverHttp = http.createServer(mainApp).listen(portHttp, function() {
    console.log(`non-secure server listening on port ${portHttp}`);
});

// HTTPS server
const secureApp = express();

secureApp.use(bodyParser.urlencoded({ extended: true }));
secureApp.use(bodyParser.json());

const sslOptions = {
    key: fs.readFileSync('key.pem', 'utf8'),
    cert: fs.readFileSync('cert.pem', 'utf8')
}

secureApp.use(function(req, res, next) {
    console.log('secure route');
    next();
})

const serverHttps = https.createServer(sslOptions, secureApp).listen(portHttps, function() {
    console.log(`secure server listening on port ${portHttps}`);
});

//const serverHttps = http.createServer(secureApp).listen(portHttps, function() {
    //console.log(`secure server listening on port ${portHttps}`);
//});


const wss = new WebSocket.Server({ 
    server: serverHttps
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
routes(secureApp, wss);

//app.listen(port, function() {
// console.log(`api running on port ${port}`);
//});
