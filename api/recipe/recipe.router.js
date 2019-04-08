const express = require('express');
const router = express.Router();
const passport = require('passport');
const recipeController = require('./recipe.controller');

// @route   GET api/recipes
// @desc    Get all Recipes for user
// @access  Private
router.get(
  '/all',
  passport.authenticate('jwt', { session: false }),
  recipeController.getAllRecipes
);

// @route   GET api/recipe/:recipe_name
// @desc    Get recipe by name
// @access  Private
router.get(
  '/:recipe_name',
  passport.authenticate('jwt', { session: false }),
  recipeController.getRecipeByName
);

// @route   GET api/recipe/:recipe_id
// @desc    Get recipe by id
// @access  Private
router.get(
  '/id/:recipe_id',
  passport.authenticate('jwt', { session: false }),
  recipeController.getRecipeByID
);

// @route   POST api/recipe
// @desc    Create Recipe
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  recipeController.addRecipe
);

// @route   POST api/recipe/ingredient
// @desc    Add Ingredient to Recipe
// @access  Private
// router.post(
//   '/ingredient/:recipe_id/:ingredient_id',
//   passport.authenticate('jwt', { session: false }),
//   recipeController.addIngredientToRecipe
// );

// @route   POST api/recipe
// @desc    Delete Recipe
// @access  Private
router.delete(
  '/:recipe_id',
  passport.authenticate('jwt', { session: false }),
  recipeController.deleteRecipeByID
);

module.exports = router;
