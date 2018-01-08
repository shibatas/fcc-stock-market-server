//const express = require('express');
//const app = express();
//const passport = require('passport');

module.exports = function (app, passport) {
  app.get('/auth/', function(req, res) {
    console.log('user', req.user);
    res.send(req.user);
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