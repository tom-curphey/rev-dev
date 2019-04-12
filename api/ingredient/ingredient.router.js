const express = require('express');
const router = express.Router();
const passport = require('passport');
const ingredientController = require('./ingredient.controller');

// @route   GET api/ingredient/all
// @desc    Get all ingredients for user
// @access  Private
router.get(
  '/all',
  passport.authenticate('jwt', { session: false }),
  ingredientController.getAllIngredients
);

// @route   GET api/ingredient/:ingredient_name
// @desc    Get recipe by name
// @access  Private
router.get(
  '/:ingredient_name',
  passport.authenticate('jwt', { session: false }),
  ingredientController.getIngredientByName
);

// @route   GET api/ingredient/id/:ingredient_id
// @desc    Get ingredient by id
// @access  Private
router.get(
  '/id/:ingredient_id',
  passport.authenticate('jwt', { session: false }),
  ingredientController.getIngredientByID
);

// @route   POST api/ingredient
// @desc    Create ingredient
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  ingredientController.addIngredient
);

// @route   POST api/ingredient
// @desc    Edit ingredient
// @access  Private
router.put(
  '/:ingredient_id',
  passport.authenticate('jwt', { session: false }),
  ingredientController.editIngredientByID
);

// @route   POST api/ingredient
// @desc    Delete ingredient
// @access  Private
router.delete(
  '/:ingredient_id',
  passport.authenticate('jwt', { session: false }),
  ingredientController.deleteIngredientByID
);

module.exports = router;

// @route   POST api/ingredient/supplier/:ingredient_id/:supplier_id
// @desc    Add ingredient supplier
// @access  Private
router.post(
  '/supplier/:ingredient_id/:supplier_id',
  passport.authenticate('jwt', { session: false }),
  ingredientController.addSupplierToIngredient
);

module.exports = router;
