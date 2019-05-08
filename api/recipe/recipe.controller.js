const User = require('../user/user.model');
const Recipe = require('./recipe.model');
const Venue = require('../venue/venue.model');

const validateRecipeInput = require('../../config/validation/recipe');
const validateRecipeIngredientInput = require('../../config/validation/recipeIngredient');

const getAllUserRecipes = (req, res) => {
  let errors = {};
  console.log('Here');
  Recipe.find({ user: req.user.id }).then(recipes => {
    if (recipes.length < 1) {
      console.log(recipes);
      errors.recipe = 'There are no recipes for this user';
      return res.status(404).json(errors);
    }
    return res.json(recipes);
  });
};
module.exports.getAllUserRecipes = getAllUserRecipes;

const getRecipeByID = (req, res) => {
  Recipe.findOne({
    user: req.user.id,
    _id: req.params.recipe_id
  })
    .populate('ingredients.ingredient', ['displayName', 'metrics'])
    .then(recipe => {
      if (!recipe) {
        errors.recipe = 'This recipe does not exist';
        return res.status(404).json(errors);
      }
      return res.json(recipe);
    });
};
module.exports.getRecipeByID = getRecipeByID;

// Add a recipe
const addRecipe = (req, res) => {
  const { errors, isValid } = validateRecipeInput(req.body);

  console.log('isValid: ', isValid);
  console.log('errors: ', errors);

  // Check Validation
  if (!isValid) {
    // If any error, sent status 400 with errors object
    return res.status(400).json(errors);
  }

  Venue.findOne({ user: req.user.id })
    .then(venue => {
      console.log('isValid: ', isValid);
      console.log('Venue: ', venue);
      if (!venue) {
        errors.venue =
          'Please confirm the venue this recipe will be served in';
        return res.status(400).json(errors);
      }

      const recipeFields = {};
      recipeFields.user = req.user.id;
      recipeFields.venue = venue._id;
      if (req.body.displayName) {
        recipeFields.displayName = req.body.displayName;
        recipeFields.urlName = req.body.displayName
          .trim()
          .replace(/\s+/g, '-')
          .toLowerCase();
      }
      if (req.body.serves) recipeFields.serves = req.body.serves;
      if (req.body.salePricePerServe)
        recipeFields.salePricePerServe = req.body.salePricePerServe;
      if (req.body.staffTime)
        recipeFields.staffTime = req.body.staffTime;
      if (req.body.totalCookingTime)
        recipeFields.totalCookingTime = req.body.totalCookingTime;
      if (req.body.expectedSalesPerDay)
        recipeFields.expectedSalesPerDay =
          req.body.expectedSalesPerDay;
      if (req.body.internalRecipe)
        recipeFields.internalRecipe = req.body.internalRecipe;

      Recipe.findOne({
        urlName: recipeFields.urlName
      }).then(recipe => {
        if (recipe) {
          console.log('Recipe Exists: ', recipe);
          errors.recipe =
            'This recipe already exists for this venue, no need to create a new one.. To compare recipes use the compare recipe feature on the recipe results page. [link to page]';
          return res.status(400).json(errors);
        } else {
          const newRecipe = new Recipe(recipeFields);

          newRecipe
            .save()
            .then(recipe => {
              if (!recipe) {
                errors.recipe =
                  'There was an error saving your recipe..';
                return res.status(400).json(errors);
              }
              return res.status(200).json(recipe);
            })
            .catch(err => {
              console.log('Err: ', err);
            });
        }
      });
    })
    .catch(err => {
      console.log('Venue Error: ', err);
    });
};
module.exports.addRecipe = addRecipe;

const editRecipeByID = (req, res) => {
  const { errors, isValid } = validateRecipeInput(req.body);

  // Check Validation
  if (!isValid) {
    // If any error, sent status 400 with errors object
    return res.status(400).json(errors);
  }

  Recipe.findOne({ _id: req.params.recipe_id }).then(recipe => {
    if (!recipe) {
      errors.recipe = 'Could not find the recipe you want to edit';
      return res.status(404).json(errors);
    }

    if (req.body.venue) {
      Venue.findById(req.body.venue).then(venue => {
        if (!venue) {
          errors.venue = 'The selected venue could not be found';
          return res.status(400).json(errors);
        }

        const recipeFields = {};
        recipeFields.user = req.user.id;
        recipeFields.venue = req.body.venue;
        if (req.body.displayName) {
          recipeFields.displayName = req.body.displayName;
          recipeFields.urlName = req.body.displayName
            .trim()
            .replace(/\s+/g, '-')
            .toLowerCase();
        }
        if (req.body.serves) recipeFields.serves = req.body.serves;
        if (req.body.salePricePerServe)
          recipeFields.salePricePerServe = req.body.salePricePerServe;
        if (req.body.staffTime)
          recipeFields.staffTime = req.body.staffTime;
        if (req.body.totalCookingTime)
          recipeFields.totalCookingTime = req.body.totalCookingTime;
        if (req.body.expectedSalesPerDay)
          recipeFields.expectedSalesPerDay =
            req.body.expectedSalesPerDay;
        if (req.body.internalRecipe)
          recipeFields.internalRecipe = req.body.internalRecipe;

        Recipe.findOneAndUpdate(
          { _id: req.params.recipe_id },
          { $set: recipeFields },
          { new: true }
        )
          .then(recipe => {
            if (!recipe) {
              errors.recipe = 'Unable to update recipe..';
              return res.status(400).json(errors);
            }
            return res.status(200).json(recipe);
          })
          .catch(err => {
            'There was an error saving the recipe to the database';
            return res.status(400).json(err.response.data);
          });
      });
    } else {
      errors.venue = 'The selected venue could not be found';
      return res.status(400).json(errors);
    }
  });
};
module.exports.editRecipeByID = editRecipeByID;

const deleteRecipeByID = (req, res) => {
  let errors = {};
  Recipe.findByIdAndDelete(req.params.recipe_id).then(recipe => {
    if (!recipe) {
      errors.recipe =
        'There was an error deleting the recipe from the database';
      return res.status(400).json(errors);
    }
    return res.status(200).json({
      message: `${recipe.displayName} was successfully deleted`
    });
  });
};
module.exports.deleteRecipeByID = deleteRecipeByID;

const addOrEditRecipeIngredient = (req, res) => {
  if (req.params.recipe_id) {
    req.body.recipe_id = req.params.recipe_id;
  }
  if (req.params.ingredient_id) {
    req.body.ingredient_id = req.params.ingredient_id;
  }

  const { errors, isValid } = validateRecipeIngredientInput(req.body);

  // Check Validation
  if (!isValid) {
    // If any error, sent status 400 with errors object
    return res.status(400).json(errors);
  }

  Recipe.findById(req.body.recipe_id)
    .then(recipe => {
      if (!recipe) {
        errors.recipe = 'Selected recipe could not be found';
        res.status(404).json(errors);
      }

      Ingredient.findById(req.body.ingredient_id)
        .then(ingredient => {
          if (!ingredient) {
            errors.recipe = 'Selected ingredient could not be found';
            res.status(404).json(errors);
          }

          const RecipeIngredientData = {};
          RecipeIngredientData.ingredient = req.body.ingredient_id;
          RecipeIngredientData.quantity = req.body.quantity;
          RecipeIngredientData.metric = req.body.metric;
          RecipeIngredientData.grams = req.body.grams;

          let updateCheck = 0;
          for (
            let index = 0;
            index < recipe.ingredients.length;
            index++
          ) {
            if (
              recipe.ingredients[index].ingredient ==
              req.body.ingredient_id
            ) {
              RecipeIngredientData._id =
                recipe.ingredients[index]._id;
              recipe.ingredients[index] = RecipeIngredientData;
              updateCheck = 1;
            }
          }

          console.log('recipe.ingredients: ', recipe.ingredients);

          if (updateCheck === 0) {
            console.log('ADD RECIPE INGREDIENT');
            recipe.ingredients.push(RecipeIngredientData);
          }

          recipe
            .save()
            .then(recipeSaved => {
              if (!recipeSaved) {
                errors.recipe =
                  'There was an error saving the ingredient to the recipe';
                return res.status(400).json(err.response.data);
              }
              res.status(200).json(recipe);
            })
            .catch(err => {
              errors.recipe =
                'There was an error saving the ingredient to the recipe in the database';
              return res.status(400).json(err);
            });
        })
        .catch(err => {
          errors.recipe =
            'There was an error retrieving the ingredient to add to the recipe in the database';
          return res.status(400).json(err);
        });
    })
    .catch(err => {
      errors.recipe =
        'There was an error adding the ingredient to the recipe in the database';
      return res.status(400).json(err.response.data);
    });

  // console.log('isValid REQ: ', req.body);
};
module.exports.addOrEditRecipeIngredient = addOrEditRecipeIngredient;
