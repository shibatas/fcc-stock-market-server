//const express = require('express');
const request = require('request');
const Bar = require('../model/bars.js');
//const app = express();

module.exports = function (app) {
  function isLoggedIn (req, res, next) {
    if (req.isAuthenticated()) {
      console.log('user logged in', req.user);
      return next();
    } else {
      console.log('user not logged in');
      res.json({ 'message': 'not logged in' });
    }
  }
  
  app.get('/api/', isLoggedIn, function(req, res) {
    res.send('API Working');
  })
  
  // Yelp query
  app.get('/api/yelp', function(req, res) {
    console.log(req.query);
    let term = 'term=' + req.query.term;
    let query = term;
    if (req.query.location) {
      let location = 'location=' + req.query.location;
      query += '&' + location;
    } else if (req.query.latitude) {
      let latitude = 'latitude=' + req.query.latitude;
      let longitude = 'longitude=' + req.query.longitude;
      query += '&' + latitude + '&' + longitude;
    }
    console.log(query);
    request({
      url: process.env.YELP_APIURL + '?' + query,
      headers: {
        'Authorization': 'Bearer ' + process.env.YELP_KEY
      }
    }, function(err, data, body) {
      if (err) throw err;
      res.json(JSON.parse(body).businesses);
    });
  })
  
  // Process Yelp query results
  app.post('/api/bars', function(req, res) {
    Bar.findOne({
        'id': req.body.id
      }, function(err, doc) {
      if (err) throw err;
      if (doc) {
        //console.log('found', doc);
        doc.name = req.body.name;
        doc.image_url = req.body.image_url;  
        // update doc in case yelp data is changed
        doc.save(function(err, updatedDoc) {
          if (err) throw err;
          res.json(updatedDoc);
        });
      } else {
        //console.log('not found');
        let newBar = new Bar;
        newBar.id = req.body.id;
        newBar.name = req.body.name;
        newBar.image_url = req.body.image_url;
        newBar.going = [];
        newBar.save(function(err) {
          if (err) { throw err; }
          else { res.json(newBar); }
        });
      }
    });
  })
  
  // Get a single document from database
  app.get('/api/bars/:id', function (req, res) {
    //console.log(req.params.id);
    //console.log('get bar info by id');
    Bar.findOne({
      'id': req.params.id
    }, function(err, doc) {
      if (err) throw err;
      if (doc) {
        res.json(doc);
      }
    });
  
  })
  
  app.route('/api/going')
    .post(isLoggedIn, function(req, res) {
      Bar.findOne({
          'id': req.body.id
        }, function(err, doc) {
        if (err) throw err;
        if (doc) {
          console.log('found', doc);
          doc.going.push({
            username: req.body.username
          });
          doc.save(function(err, updatedDoc) {
            if (err) throw err;
            console.log('updated doc', updatedDoc);
            res.json(updatedDoc);
          });
        } else {
          console.log('error doc not found');
        }
      });
    })
};