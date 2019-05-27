const User = require('../user/user.model');
const Recipe = require('./recipe.model');
const Venue = require('../venue/venue.model');

const validateRecipeInput = require('../../config/validation/recipe');
const validateRecipeIngredientInput = require('../../config/validation/recipeIngredient');

const getAllUserRecipes = (req, res) => {
  let errors = {};
  Recipe.find({ user: req.user.id })
    .then(recipes => {
      if (recipes.length < 1) {
        console.log(recipes);
        errors.recipe = 'There are no recipes for this user';
        console.log(errors);
        return res.status(404).json(errors);
      }
      return res.json(recipes);
    })
    .catch(err => {
      return res.status(404).json(err);
    });
};
module.exports.getAllUserRecipes = getAllUserRecipes;

const getRecipeByID = (req, res) => {
  Recipe.findOne({
    user: req.user.id,
    _id: req.params.recipe_id
  })
    .populate('ingredients.ingredient', [
      'displayName',
      'metrics',
      'packageCost',
      'packageGrams'
    ])
    .then(recipe => {
      if (!recipe) {
        errors.recipe = 'This recipe does not exist';
        return res.status(404).json(errors);
      }

      Profile.findOne({ user: req.user._id }).then(profile => {
        if (!profile) {
          errors.profile = 'This profile does not exist';
          return res.status(404).json(errors);
        }

        const updatedRecipeIngredients = [];
        let recipeIngredientSupplierData = {};
        for (let r = 0; r < recipe.ingredients.length; r++) {
          // console.log('RRRI: ', recipe.ingredients[r].ingredient._id);
          let check = 0;
          for (let p = 0; p < profile.ingredients.length; p++) {
            // console.log('PI: ', recipe.ingredients[r]._id);
            if (
              recipe.ingredients[r]._id.toString() ==
              profile.ingredients[p].ingredient.toString()
            ) {
              const preferredSupplier = profile.ingredients[
                p
              ].suppliers.filter(supplier => {
                return supplier.preferred === true;
              });
              console.log('----------: ', r);
              console.log('RI::: ', recipe.ingredients[r]);
              if (preferredSupplier[0]) {
                console.log('PIS:: ', preferredSupplier[0]);

                check = 1;
                recipeIngredientSupplierData;
                recipeIngredientSupplierData._id =
                  recipe.ingredients[r].ingredient._id;
                recipeIngredientSupplierData.displayName =
                  recipe.ingredients[r].ingredient.displayName;
                recipeIngredientSupplierData.metrics =
                  recipe.ingredients[r].ingredient.metrics;
                recipeIngredientSupplierData.supplier = {};
                recipeIngredientSupplierData.supplier.supplier =
                  preferredSupplier[0].supplier;
                recipeIngredientSupplierData.supplier.packageCost =
                  preferredSupplier[0].packageCost;
                recipeIngredientSupplierData.supplier.packageGrams =
                  preferredSupplier[0].packageGrams;
              }
            }
          }
          if (check === 0) {
            updatedRecipeIngredients.push(recipe.ingredients[r]);
          } else {
            updatedRecipeIngredients.push(
              recipeIngredientSupplierData
            );
          }
        }

        const newRecipe = {
          ...recipe._doc,
          ingredients: updatedRecipeIngredients
        };
        console.log('RECIPE: ', newRecipe);

        return res.json(newRecipe);
      });
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
      if (req.body.staffTimeUnit)
        recipeFields.staffTimeUnit = req.body.staffTimeUnit;
      if (req.body.totalCookingTime)
        recipeFields.totalCookingTime = req.body.totalCookingTime;
      if (req.body.cookingTimeUnit)
        recipeFields.cookingTimeUnit = req.body.cookingTimeUnit;
      if (req.body.expectedSales)
        recipeFields.expectedSales = req.body.expectedSales;
      if (req.body.internalRecipe)
        recipeFields.internalRecipe = req.body.internalRecipe;

      Recipe.findOne({
        urlName: recipeFields.urlName
      }).then(recipe => {
        if (recipe) {
          // console.log('Recipe Exists: ', recipe);
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

    console.log('FOUND', recipe);

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
        if (req.body.staffTimeUnit)
          recipeFields.staffTimeUnit = req.body.staffTimeUnit;
        if (req.body.totalCookingTime)
          recipeFields.totalCookingTime = req.body.totalCookingTime;
        if (req.body.cookingTimeUnit)
          recipeFields.cookingTimeUnit = req.body.cookingTimeUnit;
        if (req.body.expectedSalesPerDay)
          recipeFields.expectedSales = req.body.expectedSales;
        if (req.body.internalRecipe)
          recipeFields.internalRecipe = req.body.internalRecipe;

        req.body.ingredients && req.body.ingredients.length > 0
          ? (recipeFields.ingredients = req.body.ingredients)
          : (recipeFields.ingredients = []);

        Recipe.findOneAndUpdate(
          { _id: req.params.recipe_id },
          { $set: recipeFields },
          { new: true }
        )
          .populate('ingredients.ingredient', [
            'displayName',
            'metrics',
            'packageCost',
            'packageGrams'
          ])
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

          console.log('INGREDIENT: ', ingredient);

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
