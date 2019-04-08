const Validator = require('validator');
const isEmpty = require('../validation/is.empty');

module.exports = function validateIngredientInput(data) {
  let errors = {};

  console.log('Check Data: ', data);
  data.displayName = !isEmpty(data.displayName)
    ? data.displayName
    : '';
  data.packageCost = !isEmpty(data.packageCost)
    ? data.packageCost
    : '';
  data.packageGram = !isEmpty(data.packageGram)
    ? data.packageGram
    : '';
  data.cup = !isEmpty(data.cup) ? data.cup : '';

  if (Validator.isEmpty(data.displayName)) {
    errors.displayName = 'Ingredient name is required';
  }
  if (Validator.isEmpty(data.packageCost)) {
    errors.packageCost = 'Ingredient package cost is required';
  }
  if (Validator.isEmpty(data.packageGram)) {
    errors.packageGram = 'Ingredient package grams is required';
  }
  if (Validator.isEmpty(data.cup)) {
    errors.cup = 'Ingredient cup metric is required';
  }

  return {
    errors: errors,
    isValid: isEmpty(errors)
  };
};
