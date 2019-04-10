const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const passport = require('passport');

// /api/user
router.get('/findall', userController.findAll);
router.post('/register', userController.addUser);
router.post('/login', userController.login);

// /api/user/:id
// router.route('/:id').delete(itemController.removeItem);
// .get(controllers.getOne)
// router.route('/:id').put(itemController.updateItem);

// Protected API Routes
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  userController.currentUser
);
router.post(
  '/reactivate',
  passport.authenticate('jwt', { session: false }),
  userController.reactivateUser
);

// @route   POST api/ingredient/supplier/:ingredient_id/:supplier_id
// @desc    Add user ingredient
// @access  Private
router.post(
  '/ingredient/:ingredient_id/:supplier_id',
  passport.authenticate('jwt', { session: false }),
  userController.addOrEditUserIngredient
);

module.exports = router;
