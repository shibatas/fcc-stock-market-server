'use strict';

const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../model/users.js');

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        const sessionUser = {
            _id: user._id,
            username: user.username,
            displayName: user.displayName
        }
		done(null, sessionUser);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});
	
	passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK
    }, function(accessToken, refreshToken, profile, cb) {
        console.log('passport.js', profile);
        User.findOne({ id: profile.id }, function (err, user) {
            if (err) {
                return cb(err);
            }
            if (user) {
                console.log('user found', user);
                return cb(null, user);
            } else {
                console.log('create new user');
                let newUser = new User;
                newUser.id = profile.id;
                newUser.username = profile.username;
                newUser.displayName = profile.displayName;
                console.log(newUser);
                newUser.save(function(err, user) {
                   if (err) throw err;
                   return cb(null, newUser);
                });
            }
        });
    }));
}