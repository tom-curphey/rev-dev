const User = require('../user/user.model');
const Recipe = require('./recipe.model');
const Ingredient = require('../ingredient/ingredient.model');

// Load Input Validation
const validateRecipeInput = require('../../config/validation/recipe');
const validateRecipeIngredientInput = require('../../config/validation/RecipeIngredient');

const getAllRecipes = (req, res) => {
  Recipe.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .populate('user', ['name'])
    .then(recipes => {
      if (!recipes) {
        res
          .status(404)
          .json({ message: "You don't have any saved recipes" });
      }
      console.log('Recipes: ', recipes);

      return res.status(200).json({ recipes: recipes });
    });
};
module.exports.getAllRecipes = getAllRecipes;

const getRecipeByName = (req, res) => {
  Recipe.findOne({ urlName: req.params.recipe_name })
    .populate('user', ['name'])
    .then(recipe => {
      if (!recipe) {
        return res
          .status(404)
          .json({ message: "You don't have a recipe by this name" });
      }
      return res.status(200).json(recipe);
    });
};
module.exports.getRecipeByName = getRecipeByName;

const getRecipeByID = (req, res) => {
  Recipe.findById(req.params.recipe_id)
    .populate('user', ['name'])
    .then(recipe => {
      if (!recipe) {
        return res
          .status(404)
          .json({ message: "You don't have a recipe by this id" });
      }
      return res.status(200).json(recipe);
    });
};
module.exports.getRecipeByID = getRecipeByID;

const addRecipe = (req, res) => {
  const { errors, isValid } = validateRecipeInput(req.body);

  // Check Validation
  if (!isValid) {
    // If any errors, send status 400 with errors object
    return res.status(400).json(errors);
  }

  const recipeFields = {};
  recipeFields.user = req.user.id;
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
  if (req.body.staffTimeInSeconds)
    recipeFields.staffTimeInSeconds = req.body.staffTimeInSeconds;
  if (req.body.totalCookingTime)
    recipeFields.totalCookingTime = req.body.totalCookingTime;
  if (req.body.expectedSalesPerDay)
    recipeFields.expectedSalesPerDay = req.body.expectedSalesPerDay;
  if (req.body.internalRecipe)
    recipeFields.internalRecipe = req.body.internalRecipe;

  Recipe.findOne({ urlName: recipeFields.urlName }).then(recipe => {
    if (recipe) {
      return res.status(400).json({
        message: `You have already created a recipe called: ${
          recipe.displayName
        }`
      });
    } else {
      const newRecipe = new Recipe(recipeFields);

      console.log(newRecipe);

      newRecipe
        .save()
        .then(recipe => {
          if (!recipe) {
            res.status(400).json({
              message: 'There was an error creating your recipe'
            });
          }
          return res.status(200).json(recipe);
        })
        .catch(err => {
          return res.status(400).json({
            message: 'There was an error saving your recipe',
            error: err
          });
        });
    }
  });
};
module.exports.addRecipe = addRecipe;

const deleteRecipeByID = (req, res) => {
  Recipe.findByIdAndDelete(req.params.recipe_id)
    .then(recipe => {
      if (recipe) {
        return res.status(200).json({
          message: `Your successfully deleted the recipe: ${
            recipe.displayName
          }`
        });
      } else {
        return res.status(404).json({
          message: 'We could not find an recipe by that ID'
        });
      }
    })
    .catch(err => {
      return res.status(404).json({
        message: 'We could not find an recipe by that ID',
        error: err
      });
    });
};
module.exports.deleteRecipeByID = deleteRecipeByID;

// const addIngredientToRecipe = (req, res) => {
//   req.body.recipe_id = req.params.recipe_id;
//   req.body.ingredient_id = req.params.ingredient_id;

//   const { errors, isValid } = validateRecipeIngredientInput(req.body);

//   // console.log('Valid: ', req.body);

//   // Check Validation
//   if (!isValid) {
//     return res.status(400).json(errors);
//   }

//   // Check if ingredient exsists to add to recipe
//   Ingredient.findById(req.body.ingredient_id).then(ingredient => {
//     if (!ingredient) {
//       errors.ingredient = 'We could not find the ingredient selected';
//       return res.status(404).json(errors);
//     }

//     // Check if recipe exists to add ingredient
//     Recipe.findById(req.body.recipe_id).then(recipe => {
//       if (!recipe) {
//         errors.recipe = 'We could not find the recipe selected';
//         return res.status(404).json(errors);
//       }

//       const ingredientData = {};
//       ingredientData.ingredient = req.body.ingredient_id;
//       ingredientData.amount = req.body.amount;
//       ingredientData.metric = req.body.metric;

//       ingredientIndex = recipe.ingredients.findIndex(
//         findIngredient => findIngredient.ingredient == ingredient.id
//       );

//       console.log('ingredientIndex: ', ingredientIndex);

//       if (ingredientIndex === -1) {
//         recipe.ingredients.push(ingredientData);
//         recipe
//           .save()
//           .then(recipeSaved => {
//             if (!recipeSaved) {
//               // errors.ingredient =
//               // 'We could save the ingredient to this supplier';
//               return res.status(400).json({
//                 message:
//                   'We could not save the ingredient to this recipe'
//               });
//             }
//             return res.status(200).json(recipe);
//           })
//           .catch(err => {
//             return res.status(400).json(err);
//           });
//       } else {
//         recipe.ingredients[ingredientIndex].amount =
//           ingredientData.amount;
//         recipe.ingredients[ingredientIndex].metric =
//           ingredientData.metric;

//         recipe.save().then(recipe => {
//           if (!recipe) {
//             errors.recipe =
//               'We could not update the ingredient in this recipe';
//             return res.status(404).json(errors);
//           }
//           return res.status(200).json(recipe);
//         });
//       }
//     });
//   });
// };
// module.exports.addIngredientToRecipe = addIngredientToRecipe;
