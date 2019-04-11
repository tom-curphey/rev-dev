const Validator = require('validator');
const isEmpty = require('../validation/is.empty');

module.exports = function validateIngredientInput(data) {
  let errors = {};

  console.log('Check Data: ', data);
  data.displayName = !isEmpty(data.displayName)
    ? data.displayName
    : '';

  data.cup = !isEmpty(data.cup) ? data.cup : '';

  if (Validator.isEmpty(data.displayName)) {
    errors.displayName = 'Ingredient name is required';
  }
  if (Validator.isEmpty(data.cup)) {
    errors.cup = 'Cup metric is required';
  }

  return {
    errors: errors,
    isValid: isEmpty(errors)
  };
};
