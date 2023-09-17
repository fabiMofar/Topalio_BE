const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('./../models/user');
const fs = require('fs');
const profile = './../../public/uploads/images/default-avatar.png';


passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
   
  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

passport.use('local.login' , new localStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
} , (req , email ,  password , done) => {
    User.findOne({ 'email' : email } , (err , user) => {
        if(err) return done(err);

        if(! user || ! user.comparePassword(password)) {
            return done(null , false);
        }

        done(null , user);
    })
}))
