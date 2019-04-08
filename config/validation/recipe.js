const Validator = require('validator');
const isEmpty = require('../validation/is.empty');

module.exports = function validateRecipeInput(data) {
  let errors = {};

  data.displayName = !isEmpty(data.displayName)
    ? data.displayName
    : '';
  data.serves = !isEmpty(data.serves) ? data.serves : '';

  if (Validator.isEmpty(data.displayName)) {
    errors.displayName = 'Name is required';
  }
  if (Validator.isEmpty(data.serves)) {
    errors.serves = 'Recipe serves is required';
  }

  return {
    errors: errors,
    isValid: isEmpty(errors)
  };
};
