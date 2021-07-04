const passport = require('passport');
const FacebookTokenStrategy = require('passport-facebook').Strategy;
const config = require('../config');
// const db = require('../_helpers/db');

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(
  new FacebookTokenStrategy(
    {
      clientID: config.facbook.clientId,
      clientSecret: config.facbook.clientSecret,
      callbackURL: config.facbook.callback,
      profileFields: ['name', 'email', 'birthday'],
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile._json);
      // db.User.create(profile);
      done(null, accessToken);
    },
  ),
);
