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

module.exports = router;
