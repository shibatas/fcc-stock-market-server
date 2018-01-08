//const express = require('express');
//const app = express();
//const passport = require('passport');

module.exports = function (app, passport) {

  app.get('/auth/', function(req, res) {
    res.send('auth route working');
  })

  app.get('/auth/user', function(req, res) {
    res.json(req.user);
  })
  
  // Authentication
  app.get('/auth/facebook', passport.authenticate('facebook'));
  
  app.get('/auth/facebook/callback', passport.authenticate('facebook'),
    function(req, res) {
      console.log('auth success', req.session);
      res.redirect('/');
    } 
  );
  
  app.get('/auth/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  })
}