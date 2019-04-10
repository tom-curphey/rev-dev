const express = require('express');
const router = express.Router();
const passport = require('passport');
const venueController = require('./venue.controller');

// @route   GET api/venue
// @desc    Gets the user venue
// @access  Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  venueController.getVenue
);

// @route   GET api/venue/:venue
// @desc    Get venue by venueName
// @access  Private
router.get(
  '/:venue_name',
  passport.authenticate('jwt', { session: false }),
  venueController.venueByName
);

// @route   GET api/venue/user/:venue
// @desc    Get venue by user ID
// @access  Private
router.get(
  '/user/:user_id',
  passport.authenticate('jwt', { session: false }),
  venueController.venueByID
);

// @route   POST api/venue
// @desc    Add & Edit Venue Document
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  venueController.addOrEditVenue
);

// @route   DELETE api/venue
// @desc    Delete the user & the venue
// @access  Private
router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  venueController.deleteUserAndVenue
);

module.exports = router;
