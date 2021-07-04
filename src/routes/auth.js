const express = require('express');
const passport = require('passport');
// const facebookLogin = require('../../facebook');

const router = express.Router();

const userController = require('../controllers/user');

router.get(
  '/facebook',
  passport.authenticate('facebook'),
  userController.login,
);

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/fail',
  }),
);

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile'] }),
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/');
  },
);

router.get('/fail', (req, res) => {
  res.send('Failed attempt');
});

router.get('/', (req, res) => {
  res.send('Success');
});

module.exports = router;
