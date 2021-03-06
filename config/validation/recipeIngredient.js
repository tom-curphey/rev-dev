const Validator = require('validator');
const isEmpty = require('./is.empty');

module.exports = function validateRecipeIngredientInput(data) {
  let errors = {};

  console.log('DATA: ', data);

  // Change empty values into strings for validation
  data.recipe_id = !isEmpty(data.recipe_id) ? data.recipe_id : '';
  data.ingredient_id = !isEmpty(data.ingredient_id)
    ? data.ingredient_id
    : '';
  data.quantity = !isEmpty(data.quantity) ? data.quantity : '';
  data.metric = !isEmpty(data.metric) ? data.metric : '';

  if (Validator.isEmpty(data.recipe_id)) {
    errors.recipe_id = 'You have not selected the recipe';
  }
  if (Validator.isEmpty(data.ingredient_id)) {
    errors.ingredient_id =
      'You have not selected the recipe to add to the ingredient';
  }
  if (Validator.isEmpty(data.quantity)) {
    errors.quantity = 'The ingredient quantity is required';
  }
  if (Validator.isEmpty(data.metric)) {
    errors.metric =
      'You have not selected the ingredient metric type';
  }

  return {
    errors: errors,
    isValid: isEmpty(errors)
  };
};
