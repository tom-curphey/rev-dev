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

// @route   POST api/profile/deactivate
// @desc    Creates the user profile
// @access  Private
router.post(
  '/deactivate',
  passport.authenticate('jwt', { session: false }),
  profileController.deactivateProfile
);

// // @route   POST api/profile/ingredient/:ingredient_id/:supplier_id
// // @desc    Add profile ingredient
// // @access  Private
router.post(
  '/ingredient/:ingredient_id/:supplier_id',
  passport.authenticate('jwt', { session: false }),
  profileController.addOrEditProfileIngredient
);

module.exports = router;
