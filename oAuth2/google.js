const passport = require('passport');
const GoogleTokenStrategy = require('passport-google-oauth20').Strategy;
const config = require('../config');
// const db = require('../_helpers/db');

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(
  new GoogleTokenStrategy(
    {
      clientID: config.google.clientId,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callback,
      profileFields: ['name', 'email', 'birthday'],
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile._json);
      // db.User.create(profile);
      done(null, accessToken);
    },
  ),
);
