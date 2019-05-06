const express = require('express');
const router = express.Router();
const passport = require('passport');
const recipeController = require('./recipe.controller');

// @route   GET api/recipe/all
// @desc    Get all recipes
// @access  Private
router.get(
  '/all',
  passport.authenticate('jwt', { session: false }),
  recipeController.getAllUserRecipes
);

// @route   POST api/recipe
// @desc    Create recipe
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  recipeController.addRecipe
);

// @route   PUT api/recipe/:recipe_id
// @desc    edit recipe
// @access  Private
router.put(
  '/:recipe_id',
  passport.authenticate('jwt', { session: false }),
  recipeController.editRecipeByID
);

// @route   DELETE api/recipe/:recipe_id
// @desc    Delete recipe
// @access  Private
router.delete(
  '/:recipe_id',
  passport.authenticate('jwt', { session: false }),
  recipeController.deleteRecipeByID
);

module.exports = router;
