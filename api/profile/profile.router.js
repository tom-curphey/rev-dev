const express = require('express');
const router = express.Router();
const passport = require('passport');
const profileController = require('./profile.controller');

// @route   GET api/profile
// @desc    Gets the user profile
// @access  Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  profileController.getProfile
);

// @route   POST api/profile
// @desc    Creates the user profile
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  profileController.editProfile
);

module.exports = router;

// @route   POST api/profile/deactivate
// @desc    Creates the user profile
// @access  Private
router.post(
  '/deactivate',
  passport.authenticate('jwt', { session: false }),
  profileController.deactivateProfile
);

module.exports = router;
